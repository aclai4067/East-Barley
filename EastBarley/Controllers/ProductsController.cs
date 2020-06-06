﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EastBarley.DataAccess;
using EastBarley.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EastBarley.Controllers
{
    [Route("api/products)]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        ProductsRepository _repository;

        public ProductsController(ProductsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("whiskey/all")]
        public IActionResult GetAllWhiskey()

        {
            var allWhiskey = _repository.GetAllWhiskey();
            var noWhiskey = !allWhiskey.Any();
            if (noWhiskey)
            {
                return NotFound("There is currently no whiskey to be listed!");
            }
            return Ok(allWhiskey);
        }

        [HttpGet("whiskey/{productId}")]
        public IActionResult GetWhiskeyById(int productId)
        {
            var singleWhiskey = _repository.GetWhiskeyById(productId);
            if (singleWhiskey == null)
            {
                return NotFound("That whiskey doesn't exist");
            }
            return Ok(singleWhiskey);
        }
    }
}