using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Filters.ActionFilters;
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
        private readonly IEventService e;
        public EventController(ZgadajsieDbContext db, IEventService e)
        {
            this.db = db;
            this.e = e;
        }

        [HttpGet("pins")]
        public IActionResult GetPins(/*userLat, userLon*/)
        {
            var pins = e.GetEventPins();

            return Ok(new { Pins = pins });
        }

        [Authorize]
        [HttpGet("{eventId}")]
        [TypeFilter(typeof(Event_ValidateGetEventFilterAttribute))]
        public IActionResult GetEvent([FromHeader(Name = "Authorization")] string token, [FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            return Ok(new { Event = @event });
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateEvent([FromBody] EventCreateDTO model)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var newEvent = e.CreateNewEvent(model, userId);

            db.Events.Add(newEvent);

            await db.SaveChangesAsync();

            return Ok();
        }
    }
}
