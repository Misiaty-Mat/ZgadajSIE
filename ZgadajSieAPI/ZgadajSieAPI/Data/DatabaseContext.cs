using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Data
{
    public class DatabaseContext : IdentityDbContext<User>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            
        }
        public DbSet<Profile> Profiles { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Nazwy tabel
            builder.Entity<User>().ToTable("Users");
            builder.Entity<IdentityUserClaim<string>>().ToTable("Claims");
            builder.Entity<IdentityUserRole<string>>().ToTable("Roles");
            builder.Entity<IdentityUserLogin<string>>().ToTable("ThirdPartyLogins");
            builder.Entity<IdentityUserToken<string>>().ToTable("Tokens");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims"); // Zmiana nazwy tabeli AspNetRoleClaims na RoleClaims
            builder.Entity<IdentityRole>().ToTable("IdentityRoles"); // Zmiana nazwy tabeli AspNetRoles na Roles

            // Konfiguracja relacji one-to-one
            builder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId);
        }
    }
}
