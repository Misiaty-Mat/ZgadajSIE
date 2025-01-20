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
        void AddParticipant(Event @event, User user);
        List<EventPanelDTO> FilterEventsToList(EventFilterRequest request);
        void AttachTagsToEvent(Event @event, List<Tag> tags);
    }
}
