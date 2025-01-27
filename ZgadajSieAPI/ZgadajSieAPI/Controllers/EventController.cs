using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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


        [HttpPost("all")]
        public async Task<IActionResult> GetEvents([FromBody] Coordinates userCoords)
        {
            var events = await db.Events
                .Include(e => e.EventDetails)
                .Include(e => e.Tags)
                .Select(e => new EventTileDTO
                {
                    EventId = e.EventId,
                    StartDate = e.StartDate,
                    Latitude = e.Latitude,
                    Longitude = e.Longitude,
                    Title = e.EventDetails.Title,
                    City = e.EventDetails.City,
                    Street = e.EventDetails.Street,
                    BuildingNumber = e.EventDetails.BuildingNumber,
                    TagNames = e.Tags.Select(t => t.Name).ToList()
                }).ToListAsync();

            foreach (var @event in events)
            {
                @event.Distance = e.CalculateDistance(
                    userCoords,
                    @event.Latitude,
                    @event.Longitude);
            }

            return Ok(new { Event = events });
        }


        [HttpGet("{eventId}")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventDetailsFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventsTagsFilterAttribute))]
        public IActionResult GetEventById([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            var dto = new EventDTO(@event, e.FetchOrganizerName(@event.OrganizerId));

            return Ok(new { Event = dto });
        }


        [Authorize]
        [HttpPost("create")]
        [TypeFilter(typeof(Event_ValidateModelDataFilterAttribute))]
        public async Task<IActionResult> CreateEvent([FromBody] EventCreateDTO model)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var tags = HttpContext.Items["Tags"] as List<Tag>;

            var @event = e.CreateNewEvent(model, userId, tags);

            db.Events.Add(@event);

            await db.SaveChangesAsync();

            var eventDto = new EventDTO(@event, e.FetchOrganizerName(@event.OrganizerId));

            return CreatedAtAction(
                nameof(GetEventById),
                new { eventId = eventDto.EventId },
                new { Message = "Event created successfully.", eventDto });
        }


        [Authorize]
        [HttpPut("update/{eventId}")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventsOrganizerFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventDetailsFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateMaxParticipationFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateSentTagIdsFilterAttribute))]
        public async Task<IActionResult> UpdateEvent([FromRoute] Guid eventId, [FromBody] EventUpdateDTO model)
        {
            var @event = HttpContext.Items["Event"] as Event;

            var tags = HttpContext.Items["Tags"] as List<Tag>;

            db.Entry(@event).Collection(e => e.Tags).Load();

            @event = e.UpdateEvent(@event, model, tags);

            await db.SaveChangesAsync();

            return NoContent();
        }


        [Authorize]
        [HttpDelete("delete/{eventId}")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventsOrganizerFilterAttribute))]
        public async Task<IActionResult> DeleteEvent([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            db.Events.Remove(@event);

            await db.SaveChangesAsync();

            return Ok(@event);
        }


        [Authorize]
        [HttpPost("join/{eventId}")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventDetailsFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateCurrentUserFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateJoinEventFilterAttribute))]
        public async Task<IActionResult> JoinEvent([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            var @user = HttpContext.Items["User"] as User;

            await e.AddParticipant(@event, @user);

            return Ok((new { Message = "Event joined." }));
        }


        [Authorize]
        [HttpPost("leave/{eventId}")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateCurrentUserFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateLeaveEventFilterAttribute))]
        public async Task<IActionResult> LeaveEvent([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            var @user = HttpContext.Items["User"] as User;

            await e.TakeParticipant(@event, @user.Id);

            return Ok((new { Message = "Event left." }));
        }


        [HttpGet("{eventId}/participants")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        public async Task<IActionResult> GetEventParticipants([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            await db.Entry(@event).Collection(e => e.Participants).LoadAsync();

            var participantIds = @event.Participants.Select(p => p.Id).ToList();

            return Ok(new { ParticipantIds = participantIds });
        }


        [HttpGet("{eventId}/participants/{participantId}")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateParticipantFilterAttribute))]
        [TypeFilter(typeof(User_ValidateProfileFilterAttribute))]
        public async Task<IActionResult> GetEventParticipantById([FromRoute] Guid eventId, [FromRoute] Guid participantId)
        {
            var user = HttpContext.Items["User"] as User;

            return Ok(new { User = new UserParticipantDTO(user) });
        }


        // nowy endpoint GetQRCode(req = eventId, res = qrcode) 

        // nowy endpoint ReadQRCode(req = qrcode, res = null) 

    }
}
