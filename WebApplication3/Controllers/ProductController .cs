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
    [Route("Product")]
    public class ProductController : ControllerBase
    {

        [HttpGet("list")]
        [ResponseType(typeof(IEnumerable<Product>))]
        [SwaggerResponse(HttpStatusCode.OK, "All products", typeof(IEnumerable<Product>))]
        public IEnumerable<Product> GetAll()
        {
            return ProductHandler.Get();
        }

        [HttpGet("listByUserid")]
        [ResponseType(typeof(IEnumerable<Product_User>))]
        [SwaggerResponse(HttpStatusCode.OK, "All products by userid", typeof(IEnumerable<Product_User>))]
        public IEnumerable<Product_User> GetByUserid(int userid)
        {
            return ProductHandler.GetByUserId(userid);
        }


        [HttpPost("overwriteOrder")]
        [ResponseType(typeof(IEnumerable<Product_User>))]
        [SwaggerResponse(HttpStatusCode.OK, "All products by userid", typeof(IEnumerable<Product_User>))]
        public string OverWriteOrder(IEnumerable<Product_User> newOrderList, string barcode)
        {
            ProductHandler.OverwriteOrder(newOrderList, barcode);
            return "done";
        }
    }
}
