using Microsoft.AspNetCore.Mvc;
using ZgadajSieAPI.Data;

namespace ZgadajSieAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase 
    {
        private readonly ZgadajsieDbContext db;
        public EventController(ZgadajsieDbContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public IActionResult Test() 
        {
            return Ok();
        }
    }
}
