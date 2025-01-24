namespace ZgadajSieAPI.Models.DTO
{
    public class EventTileDTO
    {
        public Guid EventId { get; set; }
        public DateTime StartDate { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Title { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string BuildingNumber { get; set; }
        public double Distance { get; set; }
        public List<string> TagNames { get; set; }
    }
}