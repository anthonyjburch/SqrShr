using System;
using System.Collections.Generic;
using System.Linq;
using SqrShrAPI.Interfaces;

namespace SqrShrAPI.Models
{
    public class Post : ICommentable, IVotable
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public bool IsDeleted { get; set;}
        public ICollection<Vote> Votes { get; set; }
        public ICollection<PostImage> PostImages { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public DateTime DateCreated { get; set; }

        public Post()
        {
            this.DateCreated = DateTime.UtcNow;
        }
    }
}