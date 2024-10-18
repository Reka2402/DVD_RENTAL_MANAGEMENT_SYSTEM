using DVD_Rental_Website.Entities;

namespace DVD_Rental_Website.IRepository
{
    public interface IRentalRepository
    {

        Task<Rent> GetRentalByID(Guid rentalId);
        Task<List<Rent>> GetAllRentalsByCustomerID(Guid CustomerID);
        Task<Rent> AddRental(Rent rental);
        Task<Rent> RentalAccept(Rent rental);
        Task<Rent> UpdateRentToReturn(Rent rental);
        Task<List<Rent>> GetAllRentals();
        Task<Rent> RejectRental(Guid RentalId);
        Task<List<Guid>> CheckAndUpdateOverdueRentals(); 
    }
}
