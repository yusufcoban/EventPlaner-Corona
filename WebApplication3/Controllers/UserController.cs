using System.Collections.Generic;
using System.Net;
using System.Web.Http.Description;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.Swagger.Annotations;

using WebApplication2.AppCode.Models;

namespace WebApplication2.AppCode.Handler
{
    [ApiController]
    [Route("User")]
    public class UserController : ControllerBase
    {

        [HttpGet("list")]
        [ResponseType(typeof(IEnumerable<User>))]
        [SwaggerResponse(HttpStatusCode.OK, "All users", typeof(IEnumerable<User>))]
        public IEnumerable<User> GetUsers()
        {
            return UserHandler.Get();
        }

        [HttpGet("byBarcode")]
        public User Get(string barcode)
        {
            return UserHandler.GetByBarCode(barcode);
        }

        [HttpPost("createNew")]
        public IActionResult Post(User user)
        {
            if (this.ModelState.IsValid)
            {
                string newBarCode = UserHandler.CreateNewUser(user);
                dynamic json = JsonConvert.SerializeObject(newBarCode);

                return Ok(json);
            }
            else
            {
                return BadRequest(this.ModelState.ValidationState);
            }

        }

        [HttpGet("resentLink")]
        public IActionResult ResentMailToUser(string email)
        {
            UserHandler.resentMailToUser(email);
            return Ok();
        }
    }
}
