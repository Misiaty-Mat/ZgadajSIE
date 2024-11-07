using Microsoft.AspNetCore.Identity;

namespace ZgadajSieAPI.Models
{
    public class User : IdentityUser
    {
        public Profile? Profile { get; set; }

        public List<Event> OrganizedEvents { get; set; } = new List<Event>();

        public List<Event> JoinedEvents { get; set; } = new List<Event>();
    }
}
