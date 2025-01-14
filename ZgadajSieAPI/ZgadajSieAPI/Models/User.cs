
using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string? Name { get; set; }

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public Profile? Profile { get; set; }


        // Relations stuff
        public List<Event> OrganizedEvents { get; set; } = new List<Event>();
        public List<Event> JoinedEvents { get; set; } = new List<Event>();
    }
}
