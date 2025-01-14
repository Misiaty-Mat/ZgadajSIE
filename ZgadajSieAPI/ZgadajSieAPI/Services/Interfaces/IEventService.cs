using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;

namespace ZgadajSieAPI.Services.Interfaces
{
    public interface IEventService
    {
        List<EventMapPinDTO> GetEventPins();
        Event CreateNewEvent(EventCreateDTO model, string userId);
    }
}
