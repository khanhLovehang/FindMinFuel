using Infrastructure.FindMinPath.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Infrastructure.FindMinPath.Repositories
{
    public class RepositoryContext : DbContext
    {
        public RepositoryContext()
        {
        }

        public RepositoryContext(DbContextOptions<RepositoryContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=NGOCKHANH\\MSSQLSERVER01;Database=FindMinPath;Trusted_Connection=True;TrustServerCertificate=True;");
        }
        public virtual DbSet<Map> Maps { get; set; }

        public virtual DbSet<MapDetail> MapDetails { get; set; }
    }
}
