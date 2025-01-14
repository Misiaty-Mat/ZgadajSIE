using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Services.Interfaces;

namespace ZgadajSieAPI.Services
{
    public class EventService : IEventService
    {
        private readonly ZgadajsieDbContext db;

        public EventService(ZgadajsieDbContext db)
        {
            this.db = db;
        }

        public List<EventMapPinDTO> GetEventPins()
        {
            var events = db.Events.ToList();

            var pins = new List<EventMapPinDTO>();

            for (int i = 0; i < events.Count; i++)
            {
                pins[i] = new EventMapPinDTO(events[i]);
            }

            return pins;
        }

        public Event CreateNewEvent(EventCreateDTO model, string userId)
        {
            // parse id

            var parsedId = Guid.Parse(userId);

            // create event

            var newEvent = new Event
            {
                Title = model.Title,
                StartDate = model.StartDate,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                OrganizerId = parsedId,
                EventDetails = new EventDetails
                {
                    Description = model.Description,
                    City = model.City,
                    Street = model.Street,
                    BuildingNumber = model.BuildingNumber,
                    MinAttendee = model.MinAttendee,
                    MaxAttendee = model.MaxAttendee,
                },
                CreationDate = DateTime.UtcNow,
                DeleteDate = DateTime.UtcNow.AddMonths(1),
                Status = "created"
            };

            return newEvent;
        }
        // public Event ConfigureEvent(event)
    }
}
