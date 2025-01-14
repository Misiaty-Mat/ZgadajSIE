using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZgadajSieAPI.Models
{
    public class Event
    {
        public Guid EventId { get; set; } = Guid.NewGuid();

        [ForeignKey("User")]
        public Guid OrganizerId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime DeleteDate { get; set; }
        
        public string Title { get; set; }

        public string Status { get; set; }

        public string Latitude { get; set; }

        public string Longitude{ get; set; }

        public EventDetails? EventDetails { get; set; }


        // Relations stuff
        public User Organiser { get; set; }
        public List<User> Attendees { get; set; } = new List<User>();
    }
}
