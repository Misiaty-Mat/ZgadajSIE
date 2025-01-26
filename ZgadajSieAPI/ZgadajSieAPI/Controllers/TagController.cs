using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Services.Interfaces;

namespace ZgadajSieAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagController : ControllerBase
    {
        private readonly ZgadajsieDbContext db;

        public TagController(ZgadajsieDbContext db)
        {
            this.db = db;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetTags()
        {
            var tags = await db.Tags
                .Select(t => new TagDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description
                })
                .ToListAsync();

            return Ok(tags);
        }
    }
}
