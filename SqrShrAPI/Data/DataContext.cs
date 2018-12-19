using Microsoft.EntityFrameworkCore;
using SqrShrAPI.Models;

namespace SqrShrAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<ProfileImage> ProfileImages { get; set; }
        public DbSet<PostImage> PostImages { get; set;}
        public DbSet<Follow> Follows { get; set; }
        public DbSet<Vote> Votes { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Follow>().HasKey(k => new { k.SourceId, k.TargetId });

            builder.Entity<Follow>()
                .HasOne(u => u.Target)
                .WithMany(u => u.Followers)
                .HasForeignKey(u => u.TargetId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Follow>()
                .HasOne(u => u.Source)
                .WithMany(u => u.Following)
                .HasForeignKey(u => u.SourceId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}