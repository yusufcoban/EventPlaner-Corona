using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

using WebApplication2.AppCode.Handler;

namespace WebApplication2.AppCode.Models
{
    internal class CheckAmountAttribute : ValidationAttribute
    {
        public String AllowCountry { get; set; }
        protected override ValidationResult IsValid(object number, ValidationContext validationContext)
        {
            int produktId = (int)validationContext.ObjectInstance.GetType().GetProperty("produkteid", BindingFlags.Public | BindingFlags.Instance)
                    .GetValue(validationContext.ObjectInstance);
            Product product = ProductHandler.GetById(produktId);
            if ((int)number <= product.maxOrderCount)
            {
                return ValidationResult.Success;

            }
            else
            {
                return new ValidationResult(String.Format("You cannot order more than {0} from {1}", product.maxOrderCount, product.productname));
            }
        }
    }
}