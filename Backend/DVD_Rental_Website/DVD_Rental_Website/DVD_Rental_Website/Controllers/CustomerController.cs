using DVD_Rental_Website.IService;
using DVD_Rental_Website.Model.RequestModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DVD_Rental_Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerServies;

        public CustomerController(ICustomerService customerServies)
        {
            _customerServies = customerServies;
        }
        [HttpPost("Add Customer")]
        public async Task<IActionResult> AddCustomer(CustomerRequestModel customerRequestmodal)
        {
            try
            {
                var result = await _customerServies.AddCustomer(customerRequestmodal);
                return Ok(result); ;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: { ex.Message}");
            }
        }
        [HttpGet("GetCustomerById")]
        public async Task<IActionResult> GetCustomerById(Guid id)
        {
            try
            {
                var result = await _customerServies.GetCustomerById(id);
                if (result == null)
                    return NotFound("Customer not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("Get All Customers")]
        public async Task<IActionResult> GetAllCustomer()     
        {
            try
            {
                var result = await _customerServies.GetAllCustomers();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPut("UpdateCustomerById")]
        public async Task<IActionResult> UpdateCustomerByID(Guid id, CustomerRequestModel customerRequestDTO)
        {
            try
            {
                var result = await _customerServies.UpdateCustomer(id, customerRequestDTO);
                if (result == null)
                    return NotFound("Customer not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(Guid id)
        {
            try
            {
                var result = await _customerServies.SoftDelete(id);
                if (result == null)
                    return NotFound("Customer not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




    }
}
