using System;
using Microsoft.EntityFrameworkCore;

namespace TestApp.Models 
{
    public class VirtualServerContext : DbContext
    {
        public DbSet<VirtualServerInfo> VirtualServers { get; set; }  

        public VirtualServerContext(DbContextOptions<VirtualServerContext> options) :base() 
        { 
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=ServerStorage;Trusted_Connection=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VirtualServerInfo>()
                .HasKey(vs => vs.VirtualServerId);
            modelBuilder.Entity<VirtualServerInfo>()
                .Property(vs => vs.SelectedForRemove).HasDefaultValue(false);
            modelBuilder.Entity<VirtualServerInfo>()
                .Property(vs => vs.CreateDateTime).HasDefaultValueSql("GETDATE()");
        }
    }
}