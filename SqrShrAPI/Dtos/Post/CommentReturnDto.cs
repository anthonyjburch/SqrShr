using System;
using System.Collections.Generic;

namespace SqrShrAPI.Dtos.Post
{
    public class CommentReturnDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int Score { get; set; }
        public PostUserReturnDto User { get; set; }
        public DateTime DateCreated { get; set; }
        public ICollection<CommentReturnDto> Comments { get; set; }
    }
}