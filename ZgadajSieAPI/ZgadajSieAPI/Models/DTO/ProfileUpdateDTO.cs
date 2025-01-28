using ZgadajSieAPI.Models.Validations;

namespace ZgadajSieAPI.Models.DTO
{
    public class ProfileUpdateDTO
    {
        [User_Name]
        public string Name { get; set; }

        [Profile_Age]
        public int Age { get; set; }

        [Profile_Gender]
        public string? Gender { get; set; }

        public string? Description { get; set; }
    }
}
