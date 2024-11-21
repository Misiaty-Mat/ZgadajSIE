using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZgadajSieAPI.Models
{
    public class Event
    {
        [Key]
        public string EventId { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreationDate { get; set; }
        public string Status { get; set; }

        [ForeignKey("User")]
        public Guid OrganizerId { get; set; }


        public User Organiser { get; set; }
        public List<User> RegisteredUsers { get; set; } = new List<User>();
    }
}
