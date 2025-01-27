using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Data
{
    public class ZgadajsieDbSeeder
    {
        public static void Seed(ZgadajsieDbContext context)
        {
            // Upewnij się, że baza danych istnieje i jest zaktualizowana
            context.Database.Migrate();

            // Sprawdź, czy dane już istnieją
            if (!context.Tags.Any())
            {
                context.Tags.AddRange(
                    new Tag { Id = Guid.NewGuid(), Name = "Sport", Description = "Wydarzenia związane z ruchem" },
                    new Tag { Id = Guid.NewGuid(), Name = "Muzyka", Description = "Wydarzenia z muzycznym duchem" },
                    new Tag { Id = Guid.NewGuid(), Name = "Alkohol", Description = "Wydarzenia skrapiane etanolem" },

                    new Tag { Id = Guid.NewGuid(), Name = "Relaks", Description = "Wydarzenia o spokojnych charakterze" },
                    new Tag { Id = Guid.NewGuid(), Name = "Eksteremalne", Description = "Wydarzenia z dreszczykiem emocji" },
                    new Tag { Id = Guid.NewGuid(), Name = "Nauka", Description = "Wydarzenia po których dowiesz się nowych rzeczy" },
                    new Tag { Id = Guid.NewGuid(), Name = "Imprezy", Description = "Wydarzenia na których liczy się zabawa w grupie" },
                    new Tag { Id = Guid.NewGuid(), Name = "Charytatywnie", Description = "Wydarzenia z dobrym celem" }
                );
            }
            context.SaveChanges();
        }
    }
}
