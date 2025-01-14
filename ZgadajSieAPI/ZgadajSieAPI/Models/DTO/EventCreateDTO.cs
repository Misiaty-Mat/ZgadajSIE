namespace ZgadajSieAPI.Models.DTO
{
    public class EventCreateDTO
    {
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string? Description { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? BuildingNumber { get; set; }
        public int? MinAttendee { get; set; }
        public int? MaxAttendee { get; set; }
    }
}
/*{
  "title": "Event name",
  "lat": 52.37326836035407,
  "lng": 16.919445027918965,
  "beginAt": "2025-01-23T05:30:00.000Z",
  "city": "Poznań",
  "street": "Piastowska",
  "building": "98",
  "minInvites": 1,
  "maxInvites": 8,
  "description": "Decription\n"
}*/
