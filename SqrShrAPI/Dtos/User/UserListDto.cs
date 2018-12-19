using System;

namespace SqrShrAPI.Dtos.User
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateLastActive { get; set; }
        public string ProfileImageUrl { get; set; }
        public string Bio { get; set; }
        public bool IsPrivate { get; set; }
        public bool IsFollowing { get; set;} = false;
    }
}