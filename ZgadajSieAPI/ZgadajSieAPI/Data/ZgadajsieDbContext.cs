using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Data
{
    public class ZgadajsieDbContext : DbContext
    {
        public ZgadajsieDbContext(DbContextOptions<ZgadajsieDbContext> options) : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventDetails> EventsDetails { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            /* Konfiguracja modeli */

            builder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();


            /* Konfiguracja relacji */

            // One-to-one
            builder.Entity<User>() 
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId);

            // One-to-one
            builder.Entity<Event>()
                .HasOne(e => e.EventDetails)
                .WithOne(ed => ed.Event)
                .HasForeignKey<EventDetails>(ed => ed.EventId);

            // One-to-many
            builder.Entity<Event>() 
                .HasOne(e => e.Organiser)
                .WithMany(u => u.OrganizedEvents)
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.Cascade); // Usunięcie User usunie wszystkie jego Eventy

            // Many-to-many
            builder.Entity<User>()
                .HasMany(u => u.JoinedEvents)
                .WithMany(e => e.Participants)
                .UsingEntity(t => t.ToTable("EventRegistrations")); // Tabela pośrednia wygeneruje się sama
        }
    }
}
