using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.Validations;

namespace ZgadajSieAPI.Models.DTO
{
    public class EventUpdateDTO
    {
        [Event_StartDate]
        public DateTime StartDate { get; set; }

        [Event_Latitude]
        public double Latitude { get; set; }

        [Event_Longitude]
        public double Longitude { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }

        public string? City { get; set; }

        public string? Street { get; set; }

        public string? BuildingNumber { get; set; }

        [EventDetails_MaxParticipation]
        public int? MaxParticipation { get; set; }
    }
}
