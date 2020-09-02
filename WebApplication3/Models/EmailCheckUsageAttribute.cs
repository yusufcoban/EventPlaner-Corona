using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

using WebApplication2.AppCode.Handler;

namespace WebApplication2.AppCode.Models
{
    internal class EmailCheckUsageAttribute : ValidationAttribute
    {
        public String AllowCountry { get; set; }
        protected override ValidationResult IsValid(object email, ValidationContext validationContext)
        {
            if (UserHandler.mailNotUsed(email.ToString()))
            {
                return ValidationResult.Success;

            }
            else
            {
                return new ValidationResult("Email already used!");
            }
        }
    }
}