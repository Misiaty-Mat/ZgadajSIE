namespace ZgadajSieAPI.Models.DTO
{
    public class UserWithoutSensitiveDataDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public Profile Profile { get; set; }
        public List<Event> OrganizedEvents { get; set; }
        public List<Event> JoinedEvents { get; set; }
    }
}
