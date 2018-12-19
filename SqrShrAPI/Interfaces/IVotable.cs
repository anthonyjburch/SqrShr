using System.Collections.Generic;
using SqrShrAPI.Models;

namespace SqrShrAPI.Interfaces
{
    public interface IVotable
    {
        int Id { get; set;}
        ICollection<Vote> Votes { get; set; }
    }
}