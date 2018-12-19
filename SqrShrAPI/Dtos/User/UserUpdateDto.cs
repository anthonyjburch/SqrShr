namespace SqrShrAPI.Dtos.User
{
    public class UserUpdateDto
    {
        public string Email { get; set;}
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsPrivate { get; set; }
    }
}