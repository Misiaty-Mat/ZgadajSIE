using Microsoft.Extensions.Logging;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models.Other;
using ZgadajSieAPI.Models.Validations;

namespace ZgadajSieAPI.Services.Interfaces
{
    public interface IEventService
    {
        List<EventMapPinDTO> FetchEventPinsToList();
        Event CreateNewEvent(EventCreateDTO model, string userId, List<Tag>? tags);
        Task AddParticipant(Event @event, User user);
        double CalculateDistance(Coordinates userCoords, double eventLat, double eventLng);
        Task<List<Guid>> AttachTagsToEvent(Event @event, List<Tag> tags);
        Task<List<Guid>> DetachTagsToEvent(Event @event, List<Tag> tags);
    }
}
