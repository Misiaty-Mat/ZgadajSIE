using Microsoft.Extensions.Logging;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models.Other;
using ZgadajSieAPI.Models.Validations;

namespace ZgadajSieAPI.Services.Interfaces
{
    public interface IEventService
    {
        Event CreateNewEvent(EventCreateDTO model, string userId, List<Tag>? tags);
        Event UpdateEvent(Event @event, EventUpdateDTO model);
        Task AddParticipant(Event @event, User user);
        Task TakeParticipant(Event @event, Guid userId);
        double CalculateDistance(Coordinates userCoords, double eventLat, double eventLng);
        Task<List<Guid>> AttachTagsToEvent(Event @event, List<Tag> tags);
        Task<List<Guid>> DetachTagsToEvent(Event @event, List<Tag> tags);
        string FetchOrganizerName(Guid organizerId);
    }
}