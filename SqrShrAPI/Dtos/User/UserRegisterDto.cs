using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace SqrShrAPI.Dtos.User
{
    public class UserRegisterDto
    {
        [Required]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 30 characters")]
        [UsernameValidator(ErrorMessage = "Username must contain a letter or a number. Usernames can only consist of letters, numbers, -, _")]
        public string Username { get; set; }
        [Required]
        [StringLength(24, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 24 characters")]
        public string Password { get; set; }   
        [RegularExpression(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", ErrorMessage = "The e-mail address entered is invalid.")]  
        public string Email { get; set;}
    }

    public class UsernameValidator : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            var strVal = value as string;

            if(!string.IsNullOrWhiteSpace(strVal))
            {
                //1. Username must contain a letter or a number
                var letters = Regex.Matches(strVal, @"[a-zA-Z]").Count;
                var numbers = Regex.Matches(strVal, @"[0-9]").Count;
                if (letters < 1 && numbers < 1)
                    return false;

                //2. Username must consist only of letters, numbers, -, _
                foreach (var c in strVal)
                {
                    if (c == ' ' || (!char.IsLetter(c) && !char.IsNumber(c) && c != '-' && c != '_'))
                        return false;
                }
            }

            return true;
        }
    }
}