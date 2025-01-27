﻿namespace ZgadajSieAPI.Models.DTO
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? Description { get; set; }

        public UserDTO(User u)
        {
            Id = u.Id;
            Name = u.Name;
            Email = u.Email;
            Age = u.Profile.Age;
            Gender = u.Profile.Gender;
            Description = u.Profile.Description;
        }
    }
}
