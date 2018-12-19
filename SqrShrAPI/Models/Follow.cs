namespace SqrShrAPI.Models
{
    public class Follow
    {
        public int SourceId { get; set; }
        public int TargetId { get; set; }
        public User Source { get; set; }
        public User Target { get; set; }
    }
}