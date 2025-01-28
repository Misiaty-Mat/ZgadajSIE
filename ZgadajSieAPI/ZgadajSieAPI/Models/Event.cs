using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZgadajSieAPI.Models
{
    public class Event
    {
        public Guid EventId { get; set; } = Guid.NewGuid();

        [ForeignKey("User")]
        public Guid OrganizerId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime CreationDate { get; set; }

        [Required]
        public DateTime DeleteDate { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        [Required]
        [StringLength(10)]
        public string CheckInCode { get; set; } 

        public EventDetails? EventDetails { get; set; }


        // Relations stuff
        public User Organiser { get; set; }
        public List<Tag> Tags { get; set; }
        public List<User> Participants { get; set; } = new List<User>();
        public List<CheckIn> CheckIns { get; set; } = new List<CheckIn>();

    }
}
