using System;

namespace SqrShrAPI.Models
{
    public class ProfileImage
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime DateAdded { get; set; }
        public bool Current { get; set; }
        public string PublicId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public bool IsDeleted { get; set;}
    }
}