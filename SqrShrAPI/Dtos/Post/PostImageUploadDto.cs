using System;
using Microsoft.AspNetCore.Http;

namespace SqrShrAPI.Dtos.Post
{
    public class PostImageUploadDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }
        
        public PostImageUploadDto()
        {
            DateAdded = DateTime.UtcNow;
        }
    }
}