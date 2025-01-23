using System.ComponentModel.DataAnnotations;
using ZgadajSieAPI.Models.Validations;

namespace ZgadajSieAPI.Models.Other
{
    public class Coordinates
    {
        [Event_Latitude]
        public double Latitude { get; set; }

        [Event_Longitude]
        public double Longitude { get; set; }
    }
}
