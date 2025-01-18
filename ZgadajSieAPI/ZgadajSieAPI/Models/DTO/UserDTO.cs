namespace ZgadajSieAPI.Models.DTO
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Profile Profile { get; set; }
        public List<Event> OrganizedEvents { get; set; }
        public List<Event> JoinedEvents { get; set; }

        public UserDTO(User user)
        {
            Id = user.Id;
            Name = user.Name;
            Email = user.Email;
            Profile = user.Profile;
            OrganizedEvents = user.OrganizedEvents;
            JoinedEvents = user.JoinedEvents;
        }
        public UserDTO()
        {
            
        }
    }
}
