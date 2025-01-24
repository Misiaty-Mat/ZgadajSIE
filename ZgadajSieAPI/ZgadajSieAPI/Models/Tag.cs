namespace ZgadajSieAPI.Models
{
    public class Tag
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } 
        public string? Description { get; set; } // Opcjonalny opis tagu

        // relation stuff
        public List<Event> Events { get; set; } = new List<Event>();
    }
}
