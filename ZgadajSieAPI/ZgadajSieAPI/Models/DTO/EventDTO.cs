using System.ComponentModel.DataAnnotations.Schema;

namespace ZgadajSieAPI.Models.DTO
{
    public class EventDTO
    {
        public Guid EventId { get; set; }

        public Guid OrganizerId { get; set; }

        public DateTime StartDate { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }

        public string? City { get; set; }

        public string? Street { get; set; }

        public string? BuildingNumber { get; set; }

        public int? MaxParticipation { get; set; }

        public EventDTO(Event e, EventDetails d)
        {
            // event
            EventId = e.EventId;
            OrganizerId = e.OrganizerId;
            StartDate = e.StartDate;
            // details
            Title = d.Title;
            Description = d.Description;
            City = d.City;
            Street = d.Street;
            BuildingNumber = d.BuildingNumber;
            MaxParticipation = d.MaxParticipation;
        }
    }
}
