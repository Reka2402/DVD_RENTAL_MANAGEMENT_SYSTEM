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

        [HttpPost("AddDVD")]
        public async Task<IActionResult> AddDVD([FromBody] ManagerRequestModel managerRequestModel)
        {
            if (managerRequestModel == null)
            {
                return BadRequest("Invalid request.");
            }

            try
            {
                var result = await _managerService.AddDVD(managerRequestModel);
                return CreatedAtAction(nameof(AddDVD), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }



        //[HttpGet("GetDVDById")]
        //public async Task<IActionResult> GetDVDById(Guid Id)
        //{
        //    try
        //    {
        //        var result = await _managerService.GetDVDById(Id);
        //        if (result == null)
        //            return NotFound("DVD not found");
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}


        [HttpGet("GetDVDById/{id}")]
        public async Task<IActionResult> GetDVDById(Guid id)
        {
            try
            {
                var result = await _managerService.GetDVDById(id);

                if (result == null) // Check if the result is null
                {
                    return NotFound("DVD not found");
                }

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

        [HttpPut("UpdateDVDById/{Id}")]
        public async Task<IActionResult> UpdateDVDByID(Guid Id, ManagerRequestModel managerRequestDTO)
        {
            try
            {
                var result = await _managerService.UpdateDVD(Id, managerRequestDTO);
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
