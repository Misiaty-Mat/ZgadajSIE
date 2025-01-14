using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Services.Interfaces;

namespace ZgadajSieAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly ZgadajsieDbContext db;
        private readonly IEventService es;
        public EventController(ZgadajsieDbContext db, IEventService ev)
        {
            this.db = db;
            this.es = ev;
        }

        [HttpGet]
        public IActionResult Test()
        {
            return Ok();
        }

        [HttpGet("pins")]
        public IActionResult GetPins(/*userLat, userLon*/)
        {
            var pins = es.GetEventPins();

            return Ok(new { Pins = pins });
        }
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateEvent([FromBody] EventCreateDTO model)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var newEvent = es.CreateNewEvent(model, userId);

            db.Events.Add(newEvent);

            await db.SaveChangesAsync();

            return Ok();
        }
    }
}
