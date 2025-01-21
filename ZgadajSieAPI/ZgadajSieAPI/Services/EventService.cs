using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models.Other;
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

        public List<EventMapPinDTO> FetchEventPinsToList()
        {
            var events = db.Events.ToList();

            var titles = db.EventsDetails.Select(d => d.Title).ToList();

            var pins = new List<EventMapPinDTO>();

            try
            {
                for (int i = 0; i < events.Count; i++)
                {
                    pins.Add(new EventMapPinDTO(events[i], titles[i]));
                }
            }

            catch (ArgumentOutOfRangeException) { }

            catch (Exception) { }

            return pins;
        }

        public Event CreateNewEvent(EventCreateDTO model, string userId, List<Tag>? tags)
        {
            // parse id

            var parsedId = Guid.Parse(userId);

            // create event

            var newEvent = new Event
            {
                EventId = Guid.NewGuid(),
                StartDate = model.StartDate,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                OrganizerId = parsedId,
                EventDetails = new EventDetails
                {
                    Title = model.Title,
                    Description = model.Description,
                    City = model.City,
                    Street = model.Street,
                    BuildingNumber = model.BuildingNumber,
                    MaxParticipation = model.MaxParticipation,
                },
                Tags = tags,
                CreationDate = DateTime.UtcNow,
                DeleteDate = DateTime.UtcNow.AddMonths(1),
                Status = "created"
            };

            return newEvent;
        }

        public async Task AddParticipant(Event @event, User user)
        {
            @event.Participants.Add(user);

            await db.SaveChangesAsync();

            return;
        }

        public List<EventPanelDTO> FilterEventsToList(EventFilterRequest request)
        {
            // może będzie trzeba dodać interfejs czy coś jak nie pyknie

            var query = db.Events.AsQueryable();

            return new List<EventPanelDTO>();
        }

        public async Task<List<Guid>> AttachTagsToEvent(Event @event, List<Tag> tags)
        {
            var addedTagIds = new List<Guid>();

            @event.Tags = new List<Tag>();

            foreach (var tag in tags)
            {
                @event.Tags.Add(tag);
                addedTagIds.Add(tag.Id);
            }
            await db.SaveChangesAsync();

            return addedTagIds;
        }

        public async Task<List<Guid>> DetachTagsToEvent(Event @event, List<Tag> tags)
        {
            var deletedTags = new List<Tag>();

            List<Guid> tagIdsToRemove = tags.Select(t => t.Id).ToList();

            @event.Tags.RemoveAll(tag => tagIdsToRemove.Contains(tag.Id));

            await db.SaveChangesAsync();

            return tagIdsToRemove;
        }
    }
}
