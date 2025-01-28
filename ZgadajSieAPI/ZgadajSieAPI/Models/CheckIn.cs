using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models
{
    public class CheckIn
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("Event")]
        public Guid EventId { get; set; }

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        public DateTime ScannedAt { get; set; } = DateTime.UtcNow;


        // relacje
        public Event Event { get; set; }
        public User User { get; set; }
    }
}
