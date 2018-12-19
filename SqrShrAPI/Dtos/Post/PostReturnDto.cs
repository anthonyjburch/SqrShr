using System;
using System.Collections.Generic;
using SqrShrAPI.Models;

namespace SqrShrAPI.Dtos.Post
{
    public class PostReturnDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public PostUserReturnDto User { get; set; }
        public int UserId { get; set; }
        public DateTime DateCreated { get; set; }
        public ICollection<string> PostImages { get; set; }
        public ICollection<CommentReturnDto> Comments { get; set; }
        public int Score { get; set; }
    }
}