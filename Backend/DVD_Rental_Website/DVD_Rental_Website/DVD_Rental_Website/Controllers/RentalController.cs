using DVD_Rental_Website.Entities;
using DVD_Rental_Website.IService;
using DVD_Rental_Website.Model.Response_Models;
using DVD_Rental_Website.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DVD_Rental_Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentalController : ControllerBase
    {
      
        private readonly IRentalService _rentalServies;

        public RentalController(IRentalService rentalServies)
        {
            _rentalServies = rentalServies;
        }

        
        [HttpGet("GetRentalbyId")]
        public async Task<IActionResult> GetRentalById(Guid id)
        {
            try
            {
                var result = await _rentalServies.GetRentalById(id);
                if (result == null)
                    return NotFound("Rental not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

  

        [HttpGet("GetAllRentalCustomers")]
        public async Task<IActionResult> GetAllRentalByCustomerId(Guid customerId)
        {
            try
            {
                var result = await _rentalServies.GetAllRentalsByCustomerId(customerId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        [HttpPost("Add Rental")]
        public async Task<IActionResult> AddRental(RentalResponseModel rentalRequestDTO)
        {
            try
            {
                var result = await _rentalServies.AddRental(rentalRequestDTO);
                return CreatedAtAction(nameof(GetRentalById), new { id = result.RentalId }, result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        [HttpPut("Accept RentalById")]
        public async Task<IActionResult> RentalAccept(Guid id)
        {
            try
            {
                var result = await _rentalServies.RentalAccept(id);
                if (result == null)
                    return NotFound("Rental not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
     

    

        [HttpPut("returnDVDById/{id}")]
        public async Task<IActionResult> UpdateRentToReturn(Guid id)
        {
            try
            {
                var result = await _rentalServies.UpdateRentToReturn(id);
                if (result == null)
                    return NotFound("Rental not found or already returned");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




   
        [HttpGet("GetAllRentals")]
        public async Task<IActionResult> GetAllRentals()
        {
            try
            {
                var result = await _rentalServies.GetAllRentals();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpDelete("RejectRentalById")]
        public async Task<IActionResult> RejectRenatal(Guid rentalid)
        {
            var isDeleted = await _rentalServies.RejectRental(rentalid);
            if (!isDeleted) return NotFound();

            return Ok("sccessfully deleted");
        }


        // check and update overdue rentals

 
        [HttpGet("CheckAndUpdateOverdueRentals")]

        public async Task<IActionResult> CheckAndUpdateOverdueRentals()
        {
            var overdue = await _rentalServies.CheckAndUpdateOverdueRentals();
            if (overdue == null) return NotFound();
            return Ok(overdue);
        }
    }
}