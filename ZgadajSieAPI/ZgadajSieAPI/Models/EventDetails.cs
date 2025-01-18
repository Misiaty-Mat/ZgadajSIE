using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ZgadajSieAPI.Models
{
    public class EventDetails
    {
        [Key]
        [ForeignKey("Event")]
        public Guid EventId { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        public string? City { get; set; }

        public string? Street { get; set; }

        public string? BuildingNumber { get; set; }

        public int? MaxParticipation { get; set; }


        // Relations stuff
        public Event Event { get; set; }
    }
}
