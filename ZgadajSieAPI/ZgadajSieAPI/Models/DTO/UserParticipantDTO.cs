namespace ZgadajSieAPI.Models.DTO
{
    public class UserParticipantDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? Description { get; set; }

        public UserParticipantDTO(User u)
        {
            Id = u.Id;
            Name = u.Name;
            Age = u.Profile.Age;
            Gender = u.Profile.Gender;
            Description = u.Profile.Description;
        }
    }
}
