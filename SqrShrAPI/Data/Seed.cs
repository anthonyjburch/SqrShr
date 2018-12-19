using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SqrShrAPI.Models;

namespace SqrShrAPI.Data
{
    public class Seed
    {
        private readonly DataContext _context;
        private readonly Random _random;
        public Seed(DataContext context)
        {
            _context = context;
            _random = new Random();
        }

        public void SeedUsers()
        {
            if (_context.Users.Any())
            {
                // _context.Users.RemoveRange(_context.Users);
                // _context.Follows.RemoveRange(_context.Follows);
                // _context.Posts.RemoveRange(_context.Posts);
                // _context.PostImages.RemoveRange(_context.PostImages);
                // _context.Votes.RemoveRange(_context.Votes);
                // _context.Comments.RemoveRange(_context.Comments);
                // _context.SaveChanges();

                return;
            }

            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);

            //Set password
            foreach (var user in users)
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash("password", out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Username = user.Username.ToLower();

                _context.Users.Add(user);
            }

            _context.SaveChanges();

            var usersFromDb = _context.Users.ToList();

            //Follow other users
            for (int i = 1; i <= 8; i++)
            {
                var user = _context.Users.Where(u => u.Id == i).FirstOrDefault();
                var userIdsToFollow = new List<int>();
                var numUsersToFollow = _random.Next(3,6);
                while (userIdsToFollow.Count() <= numUsersToFollow)
                {
                    var userIdToFollow = _random.Next(1,9);
                    if (userIdToFollow != user.Id && !userIdsToFollow.Contains(userIdToFollow))
                        userIdsToFollow.Add(userIdToFollow);
                }

                foreach (var uId in userIdsToFollow)
                {
                    var follow = new Follow
                    {
                        SourceId = user.Id,
                        TargetId = uId
                    };

                    _context.Follows.Add(follow);
                }
            }

            //Create posts
            for (int i = 1; i <= 8; i++)
            {
                var user = _context.Users.Where(u => u.Id == i).FirstOrDefault();
                var numPostsToCreate = _random.Next(10, 21);
                var posts = new List<Post>();

                

                while (posts.Count() <= numPostsToCreate)
                {
                    var dt = RandomDateBetween(new DateTime(2018, 01, 01), DateTime.Now);
                    var content = LoremNET.Lorem.Words(50, 100);
                    var numPostImagesToAdd = _random.Next(0,5);
                    var postImages = new List<PostImage>();

                    //create post images
                    while (postImages.Count() <= numPostImagesToAdd)
                    {
                        var postImage = new PostImage
                        {
                            DateAdded = dt,
                            Url = "https://source.unsplash.com/collection/" + _random.Next(1, 101) + "/500x500"
                        };

                        postImages.Add(postImage);
                    }

                    //add post votes
                    int numVotesToAdd = _random.Next(0, _context.Users.Count());
                    var votes = new List<Vote>();

                    while (votes.Count() <= numVotesToAdd)
                    {
                        var votingUserId = _random.Next(1, _context.Users.Count() + 1);
                        var upvote = _random.Next(1,3) == 1 ? true : false;
                        if (votes.Where(v => v.UserId == votingUserId).FirstOrDefault() == null)
                        {
                            var vote = new Vote
                            {
                                UserId = votingUserId,
                                Upvote = upvote
                            };

                            votes.Add(vote);
                        }
                    }

                    //add post comments
                    int numCommentsToAdd = _random.Next(0, 11);
                    var comments = new List<Comment>();                    

                    while (comments.Count() <= numCommentsToAdd)
                    {
                        var commentDate = RandomDateBetween(dt, DateTime.Now);
                        var comment = new Comment
                        {
                            UserId = _random.Next(1, _context.Users.Count() + 1),
                            Content = LoremNET.Lorem.Words(50, 100),
                            DateCreated = commentDate,
                        };

                        comments.Add(comment);
                    }

                    var post = new Post
                    {
                        UserId = user.Id,
                        DateCreated = dt,
                        Content = content,
                        PostImages = postImages,
                        Votes = votes,
                        Comments = comments

                    };

                    posts.Add(post);
                }

                _context.Posts.AddRange(posts);
            }            

            _context.SaveChanges();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private DateTime RandomDateBetween(DateTime start, DateTime end)
        {
            var span = end - start;
            var newSpan = new TimeSpan(0, _random.Next(0, (int)span.TotalMinutes), 0);
            return start + newSpan;
        }
    }
}