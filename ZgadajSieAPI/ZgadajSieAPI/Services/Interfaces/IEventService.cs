using Microsoft.Extensions.Logging;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models.Other;

namespace ZgadajSieAPI.Services.Interfaces
{
    public interface IEventService
    {
        List<EventMapPinDTO> FetchEventPinsToList();
        Event CreateNewEvent(EventCreateDTO model, string userId, List<Tag>? tags);
        Task AddParticipant(Event @event, User user);
        List<EventPanelDTO> FilterEventsToList(EventFilterRequest request);
        Task<List<Guid>> AttachTagsToEvent(Event @event, List<Tag> tags);
        Task<List<Guid>> DetachTagsToEvent(Event @event, List<Tag> tags);
    }
}
