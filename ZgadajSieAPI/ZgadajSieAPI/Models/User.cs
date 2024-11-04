using Microsoft.AspNetCore.Identity;

namespace ZgadajSieAPI.Models
{
    public class User : IdentityUser
    {
        public Profile? Profile { get; set; }
    }
}
