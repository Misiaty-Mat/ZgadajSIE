using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models
{
    public class EventDetails
    {
        [Key]
        [ForeignKey("Event")]
        public Guid EventId { get; set; }

        public string? Description { get; set; }

        public string? City { get; set; }

        public string? Street { get; set; }

        public string? BuildingNumber { get; set; }

        public int? MinAttendance { get; set; }

        public int? MaxAttendance { get; set; }


        // Relations stuff
        public Event Event { get; set; }
    }
}
