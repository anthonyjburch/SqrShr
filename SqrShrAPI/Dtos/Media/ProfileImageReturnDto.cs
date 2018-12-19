using System;

namespace SqrShrAPI.Dtos.Media
{
    public class ProfileImageReturnDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }
        public Boolean Current { get; set; }
    }
}