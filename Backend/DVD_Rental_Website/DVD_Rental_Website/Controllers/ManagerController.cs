using DVD_Rental_Website.IService;
using DVD_Rental_Website.Model.RequestModels;
using DVD_Rental_Website.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DVD_Rental_Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService _managerService;

        public ManagerController(IManagerService managerService)
        {
            _managerService = managerService;
        }

        [HttpPost("Add DVD")]
        public async Task<IActionResult> AddDVD([FromForm] ManagerRequestModel managerRequestmodal)
        {
            try
            {
                var result = await _managerService.AddDVD(managerRequestmodal);
                return Ok(result); ;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("GetDVDById")]
        public async Task<IActionResult> GetDVDById(Guid Id)
        {
            try
            {
                var result = await _managerService.GetDVDById(Id);
                if (result == null)
                    return NotFound("DVD not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("Get All DVDs")]
        public async Task<IActionResult> GetAllDVD()
        {
            try
            {
                var result = await _managerService.GetAllDVDs();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("UpdateDVDById")]
        public async Task<IActionResult> UpdateDVDByID(Guid Id, [FromForm] ManagerRequestModel managerRequestDTO)
        {
            try
            {
                var result = await _managerService.EditDVDAsync(Id, managerRequestDTO);
                if (result == null)
                    return NotFound("DVD not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> SoftDelete(Guid Id)
        {
            try
            {
                var result = await _managerService.Delete(Id);
                if (result == null)
                    return NotFound("DVD not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
