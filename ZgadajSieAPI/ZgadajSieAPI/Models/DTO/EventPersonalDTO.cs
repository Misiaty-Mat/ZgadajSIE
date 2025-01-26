namespace ZgadajSieAPI.Models.DTO
{
    public class EventPersonalDTO
    {
        public Guid EventId { get; set; }
        public DateTime StartDate { get; set; }
        public string Title { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string BuildingNumber { get; set; }
        public List<string> TagNames { get; set; }

        public EventPersonalDTO(Event e)
        {
            EventId = e.EventId;
            StartDate = e.StartDate;
            Title = e.EventDetails.Title;
            City = e.EventDetails.City;
            Street = e.EventDetails.Street;
            BuildingNumber = e.EventDetails.BuildingNumber;
            TagNames = e.Tags.Select(t => t.Name).ToList();
        }
    }
}
