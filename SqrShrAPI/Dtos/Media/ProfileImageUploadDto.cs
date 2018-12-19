using System;
using Microsoft.AspNetCore.Http;

namespace SqrShrAPI.Dtos.Media
{
    public class ProfileImageUploadDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }

        public ProfileImageUploadDto()
        {
            DateAdded = DateTime.UtcNow;
        }
    }
}