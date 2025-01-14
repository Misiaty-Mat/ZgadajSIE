namespace ZgadajSieAPI.Models.DTO
{
    public class EventMapPinDTO
    {
        public Guid EventId { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string TitleShorten { get; set; }

        public EventMapPinDTO(Event @event)
        {
            EventId = @event.EventId;
            Latitude = @event.Latitude;
            Longitude = @event.Longitude;
            TitleShorten = @event.Title;
        }
    }
}
