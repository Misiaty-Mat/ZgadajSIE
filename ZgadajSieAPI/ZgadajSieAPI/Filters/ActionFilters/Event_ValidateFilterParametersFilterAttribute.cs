using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.ComponentModel.DataAnnotations;
using System.IO;
using ZgadajSieAPI.Data;
using ZgadajSieAPI.Models;
using ZgadajSieAPI.Models.Other;

namespace ZgadajSieAPI.Filters.ActionFilters
{
    public class Event_ValidateFilterParametersFilterAttribute : ActionFilterAttribute
    {
        private readonly ZgadajsieDbContext db;

        public Event_ValidateFilterParametersFilterAttribute(ZgadajsieDbContext db)
        {
            this.db = db;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);

            var request = context.ActionArguments["request"] as EventFilterRequest;

            // pusty request

            if (request == null)
            {
                context.ModelState.AddModelError("Request", "Request data is empty.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // koordynaty

            if (VerifyCoordinate(request.Latitude) || VerifyCoordinate(request.Longitude))
            {
                context.ModelState.AddModelError("Coordinates", "Coordinate must have at most 6 decimal places.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            if ((request.Latitude < -90 || request.Latitude > 90) || (request.Longitude < -180 || request.Longitude > 180))
            {
                context.ModelState.AddModelError("Coordinates", "Latitude must be between - 90 and 90. \nLongitude must be between -180 and 180.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // range

            if (request.Range < 0)
            {
                context.ModelState.AddModelError("Range", "Range must be integer greater than 0.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // page

            if (request.Page < 0)
            {
                context.ModelState.AddModelError("Page", "Page must be integer greater than 0.");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // sortingOption

            if (!(request.SortingOption.Equals("distance_asc", StringComparison.OrdinalIgnoreCase) ||
                request.SortingOption.Equals("distance_desc", StringComparison.OrdinalIgnoreCase) ||
                request.SortingOption.Equals("start_date_asc", StringComparison.OrdinalIgnoreCase) ||
                request.SortingOption.Equals("start_date_desc", StringComparison.OrdinalIgnoreCase) ||
                request.SortingOption.Equals("creation_date_asc", StringComparison.OrdinalIgnoreCase) ||
                request.SortingOption.Equals("creation_date_desc", StringComparison.OrdinalIgnoreCase)))
            {
                context.ModelState.AddModelError("SortingOption", "Invalid value for sorting option. Possible values:" +
                    "distance_asc, distance_desc" +
                    "start_date_asc, start_date_desc" +
                    "creation_date_asc, creation_date_desc");
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Status = StatusCodes.Status400BadRequest
                };
                context.Result = new BadRequestObjectResult(problemDetails);

                return;
            }

            // tagIds
        }

        private bool VerifyCoordinate(double coordinate)
        {
            if (Math.Round(coordinate, 6) != coordinate)
            {
                return true;
            }

            return false;
        }
    }
}
