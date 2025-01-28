using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZgadajSieAPI.Models.DTO
{
    public class EventDTO
    {
        public Guid EventId { get; set; }

        public Guid OrganizerId { get; set; }

        public string OrganizerName { get; set; }

        public DateTime StartDate { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }

        public string? City { get; set; }

        public string? Street { get; set; }

        public string? BuildingNumber { get; set; }

        public int? MaxParticipation { get; set; }

        public List<string>? TagNames { get; set; }

        public EventDTO(Event e, string organizerName)
        {
            // event
            EventId = e.EventId;
            OrganizerId = e.OrganizerId;
            OrganizerName = organizerName;
            StartDate = e.StartDate;
            // details
            Title = e.EventDetails.Title;
            Description = e.EventDetails.Description;
            City = e.EventDetails.City;
            Street = e.EventDetails.Street;
            BuildingNumber = e.EventDetails.BuildingNumber;
            MaxParticipation = e.EventDetails.MaxParticipation;
            // tags
            if (e.Tags != null)
            {
                TagNames = new List<string>();

                for ( int i = 0; i < e.Tags.Count; i++)
                {
                    TagNames.Add(e.Tags[i].Name);
                }
            }
        }
    }
}
