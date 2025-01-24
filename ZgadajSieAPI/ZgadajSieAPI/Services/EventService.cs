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

        public List<EventTileDTO> FilterEventsToList(Coordinates request)
        {
            // może będzie trzeba dodać interfejs czy coś jak nie pyknie

            var query = db.Events.AsQueryable();

            return new List<EventTileDTO>();
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

        public double CalculateDistance(Coordinates userCoords, double eventLat, double eventLng)
        {
            // Promień Ziemi w metrach
            const double R = 6378137; 

            // Funkcja pomocnicza do konwersji stopni na radiany
            double ToRadians(double degrees) => (Math.PI / 180) * degrees;

            // Różnica szerokości i długości geograficznej w radianach
            double dLat = ToRadians(eventLat - userCoords.Latitude);
            double dLng = ToRadians(eventLng - userCoords.Longitude);

            // Implementacja formuły Haversine
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(ToRadians(userCoords.Latitude)) *
                       Math.Cos(ToRadians(eventLat)) *
                       Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            // Obliczenie odległości
            double distance = R * c;

            // Konwersja na km
            distance /= 1000;

            return distance; // Zwraca dystans w metrach
        }
    }
}
