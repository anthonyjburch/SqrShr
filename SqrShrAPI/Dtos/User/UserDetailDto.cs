using System;
using System.Collections.Generic;
using SqrShrAPI.Models;

namespace SqrShrAPI.Dtos.User
{
    public class UserDetailDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateLastActive { get; set; }
        public string Bio { get; set; }
        public string ProfileImageUrl { get; set; }
        public bool IsPrivate { get; set; }
        public bool IsFollowing { get; set; } = false;
    }
}