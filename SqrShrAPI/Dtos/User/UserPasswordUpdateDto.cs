using System.ComponentModel.DataAnnotations;

namespace SqrShrAPI.Dtos.User
{
    public class UserPasswordUpdateDto
    {
        public string Username { get; set; }
        [StringLength(24, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 24 characters")]
        public string NewPassword { get; set;}
        public string CurrentPassword { get; set; }
    }
}