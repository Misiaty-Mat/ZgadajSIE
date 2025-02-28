﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.DTO;
using ZgadajSieAPI.Models.Other;
using ZgadajSieAPI.Services.Interfaces;

namespace ZgadajSieAPI.Services
{
    public class EventService : IEventService
    {
        private readonly ZgadajsieDbContext db;
        public EventService(ZgadajsieDbContext db)
        {
            this.db = db;
        }


        public Event CreateNewEvent(EventCreateDTO model, string userId, List<Tag>? tags)
        {
            // parse id

            var parsedId = Guid.Parse(userId);

            // create event

            var newEvent = new Event
            {
                EventId = Guid.NewGuid(),
                StartDate = model.StartDate,
                Latitude = model.Latitude.Value,
                Longitude = model.Longitude.Value,
                OrganizerId = parsedId,
                EventDetails = new EventDetails
                {
                    Title = model.Title,
                    Description = model.Description,
                    City = model.City,
                    Street = model.Street,
                    BuildingNumber = model.BuildingNumber,
                    MaxParticipation = model.MaxParticipation,
                },
                Tags = tags,
                CreationDate = DateTime.UtcNow,
                DeleteDate = DateTime.UtcNow.AddMonths(1),
                Status = "created",
                CheckInCode = GenerateRandomString(10)
            };

            return newEvent;
        }

        private string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            return new string(Enumerable.Range(0, length)
                .Select(_ => chars[RandomNumberGenerator.GetInt32(chars.Length)])
                .ToArray());
        }

        public Event UpdateEvent(Event e, EventUpdateDTO model, List<Tag>? tags)
        {
            e.StartDate = model.StartDate;
            e.Latitude = model.Latitude;
            e.Longitude = model.Longitude;
            e.EventDetails.Title = model.Title;
            e.EventDetails.Description = model.Description;
            e.EventDetails.City = model.City;
            e.EventDetails.Street = model.Street;
            e.EventDetails.BuildingNumber = model.BuildingNumber;
            e.EventDetails.MaxParticipation = model.MaxParticipation;

            e.Tags.Clear();

            foreach(var tag in tags)
            {
                e.Tags.Add(tag);
            }

            return e;
        }


        public async Task AddParticipant(Event @event, User user)
        {
            @event.Participants.Add(user);

            await db.SaveChangesAsync();

            return;
        }


        public async Task TakeParticipant(Event @event, Guid userId)
        {
            var userToRemove = @event.Participants.FirstOrDefault(u => u.Id == userId);

            @event.Participants.Remove(userToRemove);

            await db.SaveChangesAsync();

            return;
        }


        public double CalculateDistance(Coordinates userCoords, double eventLat, double eventLng)
        {
            // Promień Ziemi w metrach
            const double R = 6378137;

            // Funkcja pomocnicza do konwersji stopni na radiany
            double ToRadians(double degrees) => (Math.PI / 180) * degrees;

            // Różnica szerokości i długości geograficznej w radianach
            double dLat = ToRadians(eventLat - userCoords.Latitude);
            double dLng = ToRadians(eventLng - userCoords.Longitude);

            // Implementacja formuły Haversine
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(ToRadians(userCoords.Latitude)) *
                       Math.Cos(ToRadians(eventLat)) *
                       Math.Sin(dLng / 2) * Math.Sin(dLng / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            // Obliczenie odległości
            double distance = R * c;

            // Konwersja na km
            distance /= 1000;

            return distance;
        }


        public string FetchOrganizerName(Guid organizerId)
        {
            var name = db.Users
                .Where(u => u.Id == organizerId)
                .Select(u => u.Name)
                .FirstOrDefault();

            if (name == null)
            {
                throw new Exception();
            }

            return name;
        }
    }
}
