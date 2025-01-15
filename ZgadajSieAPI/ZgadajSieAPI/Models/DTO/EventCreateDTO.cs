using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.Validations;

namespace ZgadajSieAPI.Models.DTO
{
    public class EventCreateDTO
    {
        [Required]
        public string Title { get; set; }
        
        [Required]
        [Event_StartDate]
        public DateTime StartDate { get; set; }

        [Event_OlderOrEqualToStartDate]
        public DateTime EndDate { get; set; }

        [Required]
        public string Latitude { get; set; }

        [Required]
        public string Longitude { get; set; }

        public string? Description { get; set; }

        public string? City { get; set; }

        public string? Street { get; set; }

        public string? BuildingNumber { get; set; }

        [EventDetails_MinAttendance]
        public int? MinAttendance { get; set; }

        [EventDetails_MaxAttendance]
        public int? MaxAttendance { get; set; }
    }
}