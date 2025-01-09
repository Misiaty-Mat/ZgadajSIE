using ZgadajSieAPI.Models;

namespace ZgadajSieAPI.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        string? ValidateToken(string token);
    }
}