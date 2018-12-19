using Microsoft.AspNetCore.Mvc;

namespace SqrShrAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemController : ControllerBase
    {
        [HttpGet("status")]
        public IActionResult Status ()
        {
            return Ok("Online");
        }
    }
}