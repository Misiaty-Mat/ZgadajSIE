using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Filters.ActionFilters;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models.Other;
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
            var pins = e.FetchEventPinsToList();

            return Ok(new { Pins = pins });
        }

        //[HttpGet]
        //public IActionResult GetEvents()
        //{
        //    return Ok();
        //}

        [HttpPost]
        public IActionResult GetFilteredEvents([FromBody] EventFilterRequest request)
        {
            var events = e.FilterEventsToList(request);

            return Ok(new { Event = events });
        }

        [HttpGet("{eventId}")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_NullCheckFilterAttribute))]
        public IActionResult GetEventById([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            return Ok(new { Event = new EventDTO(@event, @event.EventDetails) });
        }

        [Authorize]
        [HttpPost("create")]
        [TypeFilter(typeof(Event_CreateEventFilterAttribute))]
        public async Task<IActionResult> CreateEvent([FromBody] EventCreateDTO model)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var tags = HttpContext.Items["tags"] as List<Tag>;

            var @event = e.CreateNewEvent(model, userId, tags);

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
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_NullCheckFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateJoinEventFilterAttribute))]
        public IActionResult JoinEvent([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            var @user = HttpContext.Items["User"] as User;

            e.AddParticipant(@event, @user);

            return Ok();
        }

        [Authorize]
        [HttpPost("{eventId}/attach")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateTagIdsFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventsOrganizerFilterAttribute))]
        //[TypeFilter(typeof(Event_ValidateTagsDuplicationFilterAttribute))]
        public async Task<IActionResult> AttachTagsToEvent([FromRoute] Guid eventId, [FromBody] TagIdsDTO tagIds)
        {
            var tags = HttpContext.Items["Tags"] as List<Tag>;

            var @event = HttpContext.Items["Event"] as Event;

            e.AttachTagsToEvent(@event, tags);

            return Ok();
        }
    }
}
