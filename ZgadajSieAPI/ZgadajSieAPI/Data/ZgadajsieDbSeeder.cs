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
                    new Tag { Id = Guid.NewGuid(), Name = "Sport", Description = "Wydarzenia sportowe." },
                    new Tag { Id = Guid.NewGuid(), Name = "Muzyka", Description = "Wydarzenia muzyczne." },
                    new Tag { Id = Guid.NewGuid(), Name = "Alkoholowe", Description = "Wydarzenia skrapane etanolem." }
                );
            }
            context.SaveChanges();
        }
    }
}
