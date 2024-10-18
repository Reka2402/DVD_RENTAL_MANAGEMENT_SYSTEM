using DVD_Rental_Website.Entities;
using DVD_Rental_Website.Model.Response_Models;

namespace DVD_Rental_Website.IService
{
    public interface IRentalService
    {

        Task<RentalResponseModel> GetRentalById(Guid id);
        Task<List<RentalResponseModel>> GetAllRentalsByCustomerId(Guid customerId);
        Task<RentalResponseModel> AddRental(RentalResponseModel rentalRequestDTO);
        Task<RentalResponseModel> RentalAccept(Guid id);
        Task<RentalResponseModel> UpdateRentToReturn(Guid id);
        Task<List<RentalResponseModel>> GetAllRentals();
        Task<bool> RejectRental(Guid rentalid);
        Task<List<Guid>> CheckAndUpdateOverdueRentals();
    }
}
