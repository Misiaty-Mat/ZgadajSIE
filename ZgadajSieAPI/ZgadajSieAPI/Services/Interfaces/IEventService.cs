using Microsoft.Extensions.Logging;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models.Other;

namespace ZgadajSieAPI.Services.Interfaces
{
    public interface IEventService
    {
        List<EventMapPinDTO> FetchEventPinsToList();
        Event CreateNewEvent(EventCreateDTO model, string userId);
        void AddParticipant(Event @event, User user);
        List<EventPanelDTO> FilterEventsToList(EventFilterRequest request);
    }
}
