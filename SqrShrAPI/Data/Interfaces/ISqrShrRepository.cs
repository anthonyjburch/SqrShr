using System.Collections.Generic;
using System.Threading.Tasks;
using SqrShrAPI.Models;
using SqrShrAPI.Data.Interfaces;
using SqrShrAPI.Util;

namespace SqrShrAPI.Data.Interfaces
{
    public interface ISqrShrRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<PagedList<User>> GetUsers(PaginationParams paginationParams);
         Task<User> GetUser(string username);
         Task<ProfileImage> GetProfileImage(int id);
         Task<Follow> GetFollow(int sourceId, int targetId);
         Task<PagedList<User>> GetFollowers(int id, PaginationParams paginationParams);
         Task<IEnumerable<User>> GetAllFollowers(int userId);
         Task<PagedList<User>> GetFollowing(int id, PaginationParams paginationParams);
         Task<Post> GetPost(int postId);
         Task<PagedList<Post>> GetPosts(int userId, PaginationParams paginationParams);
         Task<Comment> GetComment(int commentId);
         Task<PagedList<Post>> GetStream(int userId, PaginationParams paginationParams);
         Task<Vote> GetPostVote(int userId, int postId);
         Task<Vote> GetCommentVote(int userId, int commentId);
         Task<IEnumerable<Vote>> GetUserVotes(int userId);
         Task<IEnumerable<Vote>> GetPostVotes(int postId);
    }
}