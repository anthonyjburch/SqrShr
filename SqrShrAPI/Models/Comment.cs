using System;
using System.Collections.Generic;
using SqrShrAPI.Interfaces;

namespace SqrShrAPI.Models
{
    public class Comment : ICommentable, IVotable
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public Post Post { get; set; }
        public int? PostId { get; set; }
        public Comment ParentComment { get; set; }
        public int? ParentCommentId { get; set; }
        public DateTime DateCreated { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Vote> Votes { get; set; }

        public Comment()
        {
            DateCreated = DateTime.UtcNow;
        }
    }
}