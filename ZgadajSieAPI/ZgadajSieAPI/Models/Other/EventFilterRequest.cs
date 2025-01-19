namespace ZgadajSieAPI.Models.Other
{
    public class EventFilterRequest
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public Guid[] TagIds { get; set; }
        public string SortingOption { get; set; }
        public int Range { get; set; }
        public int Page { get; set; }
    }
}
