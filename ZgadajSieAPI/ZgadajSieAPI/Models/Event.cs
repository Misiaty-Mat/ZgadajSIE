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

        public DateTime EndDate { get; set; }

        [Required]
        public DateTime CreationDate { get; set; }

        [Required]
        public DateTime DeleteDate { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        public string Latitude { get; set; }

        [Required]
        public string Longitude{ get; set; }

        public EventDetails? EventDetails { get; set; }


        // Relations stuff
        public User Organiser { get; set; }
        public List<User> Participants { get; set; } = new List<User>();
    }
}
