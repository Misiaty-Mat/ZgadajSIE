using System.ComponentModel.DataAnnotations;

namespace ZgadajSieAPI.Models.DTO
{
    public class EventMapPinDTO
    {
        public Guid EventId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        [MaxLength(50)]
        public string TitleShort { get; set; }

        public EventMapPinDTO(Event @event, string title)
        {
            EventId = @event.EventId;
            Latitude = @event.Latitude;
            Longitude = @event.Longitude;
            TitleShort = title.Length > 50 ? title.Substring(0, 50) : title;
        }
    }
}