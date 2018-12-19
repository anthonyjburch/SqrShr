using System.Threading.Tasks;
using SqrShrAPI.Models;

namespace SqrShrAPI.Data.Interfaces
{
    public interface IAuthRepository
    {
         Task<User> Register(User user, string password);
         Task<User> UpdatePassword(string username, string currentPassword, string newPassword);
         Task<User> DeleteUser(User user);
         Task<User> Login(string username, string password);
         Task<bool> UserExists(string username);
    }
}