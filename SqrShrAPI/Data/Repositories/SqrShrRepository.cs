using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SqrShrAPI.Data.Interfaces;
using SqrShrAPI.Models;
using SqrShrAPI.Util;

namespace SqrShrAPI.Data.Repositories
{
    public class SqrShrRepository : ISqrShrRepository
    {
        private readonly DataContext _context;
        public SqrShrRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(string username)
        {
            var user = await _context.Users.Include(u => u.ProfileImages).Where(u => !u.IsDeleted).FirstOrDefaultAsync(u => u.Username == username);

            return user;
        }

        public async Task<ProfileImage> GetProfileImage(int id)
        {
            var image = await _context.ProfileImages.FirstOrDefaultAsync(i => i.Id == id);

            return image;
        }

        public async Task<PagedList<User>> GetUsers(PaginationParams paginationParams)
        {
            var users = _context.Users.Include(u => u.ProfileImages).Where(u => !u.IsDeleted).OrderBy(u => u.Id);

            return await PagedList<User>.CreateAsync(users, paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<Follow> GetFollow(int sourceId, int targetId)
        {
            return await _context.Follows.FirstOrDefaultAsync(f => f.SourceId == sourceId && f.TargetId == targetId);
        }

        public async Task<PagedList<User>> GetFollowers(int userId, PaginationParams paginationParams)
        {
            var followers = _context.Follows.Where(f => f.TargetId == userId).Select(f => f.Source).Include(u => u.ProfileImages).OrderBy(f => f.Id);
            return await PagedList<User>.CreateAsync(followers, paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<IEnumerable<User>> GetAllFollowers(int userId)
        {
            var followers = await _context.Follows.Where(f => f.TargetId == userId).Select(f => f.Source).ToListAsync();
            return followers;
        }

        public async Task<PagedList<User>> GetFollowing(int id, PaginationParams paginationParams)
        {
            var following = _context.Follows.Where(f => f.SourceId == id).Select(f => f.Target).Include(u => u.ProfileImages).OrderBy(f => f.Id);
            return await PagedList<User>.CreateAsync(following, paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<Post> GetPost(int postId)
        {
            var post = await _context.Posts
                                     .Include(p => p.User)
                                        .ThenInclude(u => u.ProfileImages)
                                     .Include(p => p.PostImages)
                                     .Include(p => p.Votes)
                                     .Include(p => p.Comments)
                                        .ThenInclude(c => c.User)
                                            .ThenInclude(u => u.ProfileImages)
                                     .Include(p => p.Comments)
                                        .ThenInclude(c => c.Votes)
                                     .FirstOrDefaultAsync(p => !p.IsDeleted && p.Id == postId);

            post.Comments = post.Comments.OrderByDescending(c => c.DateCreated).ToList();

            // foreach (var comment in post.Comments)
            // {
            //     RecursiveLoadComments(comment);
            // }

            return post;
        }        

        public async Task<PagedList<Post>> GetPosts(int userId, PaginationParams paginationParams)
        {
            var posts = _context.Posts
                                .Include(p => p.User)
                                    .ThenInclude(u => u.ProfileImages)
                                .Include(p => p.PostImages)
                                .Include(p => p.Votes)
                                .Include(p => p.Comments)
                                    .ThenInclude(c => c.User)
                                        .ThenInclude(u => u.ProfileImages)
                                .Include(p => p.Comments)
                                    .ThenInclude(c => c.Votes)
                                .Where(p => !p.IsDeleted && p.UserId == userId)
                                .OrderByDescending(p => p.DateCreated);

            var pagedList = await PagedList<Post>.CreateAsync(posts, paginationParams.PageNumber, paginationParams.PageSize);
            
            return pagedList;
        }

        public async Task<Comment> GetComment(int commentId)
        {
            var comments = await _context.Comments.Include(c => c.Comments).FirstOrDefaultAsync(c => c.Id == commentId);

            return comments;
        }

        public async Task<PagedList<Post>> GetStream(int userId, PaginationParams paginationParams)
        {
            var followingIds = _context.Follows.Where(f => f.SourceId == userId).Select(f => f.Target.Id).ToList();
            followingIds.Add(userId);

            var posts = _context.Posts
                                .Include(p => p.User)
                                    .ThenInclude(u => u.ProfileImages)
                                .Include(p => p.PostImages)
                                .Include(p => p.Votes)
                                .Include(p => p.Comments)
                                    .ThenInclude(c => c.User)
                                        .ThenInclude(u => u.ProfileImages)
                                .Include(p => p.Comments)
                                    .ThenInclude(c => c.Votes)
                                .Where(p => !p.IsDeleted && followingIds.Contains(p.UserId))
                                .OrderByDescending(p => p.DateCreated);

            var pagedList = await PagedList<Post>.CreateAsync(posts, paginationParams.PageNumber, paginationParams.PageSize);

            return pagedList;
        }

        public async Task<Vote> GetPostVote(int userId, int postId)
        {
            var vote = await _context.Votes.FirstOrDefaultAsync(v => v.UserId == userId && v.PostId == postId);

            return vote;
        }

        public async Task<Vote> GetCommentVote(int userId, int commentId)
        {
            var vote = await _context.Votes.FirstOrDefaultAsync(v => v.UserId == userId && v.CommentId == commentId);

            return vote;
        }

        public async Task<IEnumerable<Vote>> GetUserVotes(int userId)
        {
            var votes = await _context.Votes.Where(v => v.UserId == userId).ToListAsync();

            return votes;
        }

        public async Task<IEnumerable<Vote>> GetPostVotes(int postId)
        {
            var votes = await _context.Votes.Where(v => v.PostId == postId).ToListAsync();

            return votes;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        private async void RecursiveLoadComments(Comment comment)
        {
            var comments = await _context.Comments
                                         .Where(c => c.ParentCommentId == comment.Id)
                                         .Include(c => c.User)
                                            .ThenInclude(u => u.ProfileImages)
                                         .Include(c => c.Votes)
                                         .OrderByDescending(c => c.DateCreated)
                                         .ToListAsync();

            foreach (var subComment in comments)
            {
                RecursiveLoadComments(subComment);
            }
        }
    }
}