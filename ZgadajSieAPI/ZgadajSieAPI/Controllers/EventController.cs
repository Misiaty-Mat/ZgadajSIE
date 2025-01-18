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
        public IActionResult GetPins()
        {
            var pins = e.GetEventPins();

            return Ok(new { Pins = pins });
        }

        [Authorize]
        [HttpGet("{eventId}")]
        [TypeFilter(typeof(Event_NullCheckFilterAttribute))]
        public IActionResult GetEventById([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as EventDTO;

            return Ok(new { Event = @event });
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateEvent([FromBody] EventCreateDTO model)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var @event = e.CreateNewEvent(model, userId);

            db.Events.Add(@event);

            await db.SaveChangesAsync();

            var eventDto = new EventDTO(@event, @event.EventDetails);

            return CreatedAtAction(
                nameof(GetEventById),
                new { eventId = eventDto.EventId },
                new { Message = "Event created successfully.", eventDto });
        }

        [Authorize]
        [HttpPost("join/{eventId}")]
        [TypeFilter(typeof(Event_NullCheckFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateJoinEventFilterAttribute))]
        public IActionResult JoinEvent([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            var @user = HttpContext.Items["User"] as User;

            e.AddParticipant(@event, @user);

            return Ok();
        }
    }
}
