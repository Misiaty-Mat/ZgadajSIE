﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

            return Ok(new { Event = new EventDTO(@event, @event.EventDetails) });
        }

        [Authorize]
        [HttpPost("create")]
        [TypeFilter(typeof(Event_ValidateModelDataFilterAttribute))]
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
        [TypeFilter(typeof(Event_ValidateEventDetailsFilterAttribute))] // zmień na ValidEventDetails i usuń część z tagami, dodaj filter na pobranie tagów do GetEventById
        [TypeFilter(typeof(Event_ValidateJoinEventFilterAttribute))]
        public async Task<IActionResult> JoinEvent([FromRoute] Guid eventId)
        {
            var @event = HttpContext.Items["Event"] as Event;

            var @user = HttpContext.Items["User"] as User;

            await e.AddParticipant(@event, @user);

            return Ok();
        }

        [Authorize]
        [HttpPost("{eventId}/attach")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventsOrganizerFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateSentTagIdsFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateTagsDuplicationFilterAttribute))]
        public async Task<IActionResult> AttachTagsToEvent([FromRoute] Guid eventId, [FromBody] TagIdsDTO tagIds)
        {
            var tags = HttpContext.Items["Tags"] as List<Tag>;

            var @event = HttpContext.Items["Event"] as Event;

            var addedTags = await e.AttachTagsToEvent(@event, tags);

            return Ok(new { Message = "Tags deleted.", Tags = addedTags });
        }

        [Authorize]
        [HttpPost("{eventId}/detach")]
        [TypeFilter(typeof(Event_ValidateEventIdFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventsOrganizerFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateSentTagIdsFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventsTagsFilterAttribute))]
        [TypeFilter(typeof(Event_ValidateEventsTagsToRemoveFilterAttribute))]
        public async Task<IActionResult> DetachTagsFromEvent([FromRoute] Guid eventId, [FromBody] TagIdsDTO tagIds)
        {
            var tags = HttpContext.Items["Tags"] as List<Tag>;

            var @event = HttpContext.Items["Event"] as Event;

            var deletedTags = await e.DetachTagsToEvent(@event, tags);

            return Ok( new {Message = "Tags deleted.", Tags = deletedTags });
        }
    }
}
