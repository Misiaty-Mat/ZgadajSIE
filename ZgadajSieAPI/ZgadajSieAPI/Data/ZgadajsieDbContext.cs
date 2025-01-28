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
        public DbSet<Tag> Tags { get; set; }
        public DbSet<CheckIn> CheckIns { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            /* Konfiguracja relacji */

            // One-to-one
            builder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Usunięcie User usunie też jego profil

            // One-to-one
            builder.Entity<Event>()
                .HasOne(e => e.EventDetails)
                .WithOne(ed => ed.Event)
                .HasForeignKey<EventDetails>(ed => ed.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-many
            builder.Entity<Event>()
                .HasOne(e => e.Organiser)
                .WithMany(u => u.OrganizedEvents)
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Many-to-many:
            builder.Entity<Event>()
                .HasMany(e => e.Participants)
                .WithMany(u => u.JoinedEvents)
                .UsingEntity<Dictionary<string, object>>(
                    "EventRegistrations",
                    j => j
                        .HasOne<User>()
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j => j
                        .HasOne<Event>()
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                );

            // Many-to-many
            builder.Entity<Event>()
                .HasMany(e => e.Tags)
                .WithMany(t => t.Events)
                .UsingEntity<Dictionary<string, object>>(
                    "EventTags",
                    j => j
                        .HasOne<Tag>()
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade),
                    j => j
                        .HasOne<Event>()
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                );

            // One-to-many
            builder.Entity<CheckIn>()
                .HasOne(ch => ch.Event)
                .WithMany(e => e.CheckIns)
                .HasForeignKey(ch => ch.EventId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // One-to-many
            builder.Entity<CheckIn>()
                .HasOne(ch => ch.User)
                .WithMany()
                .HasForeignKey(ch => ch.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            /* Konfiguracja modeli */

            builder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            builder.Entity<Tag>()
                .HasIndex(t => t.Name)
                .IsUnique();

            builder.Entity<CheckIn>()
                .HasIndex(ch => new { ch.EventId, ch.UserId })
                .IsUnique(); // Zapobiega wielokrotnemu skanowaniu przez tego samego użytkownika

        }
    }
}
