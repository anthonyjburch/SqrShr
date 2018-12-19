using System.Collections.Generic;
using SqrShrAPI.Models;

namespace SqrShrAPI.Interfaces
{
    public interface ICommentable
    {
         ICollection<Comment> Comments { get; set; }
    }
}