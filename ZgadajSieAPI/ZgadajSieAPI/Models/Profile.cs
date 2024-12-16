﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZgadajSieAPI.Models
{
    public class Profile
    {
        [Key]
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public int Age { get; set; }
        public string? Gender { get; set; }
        public string? Description { get; set; }
        public byte[]? Avatar { get; set; }

        public User User { get; set; }
    }
}