using DVD_Rental_Website.Entities;
using DVD_Rental_Website.IRepository;
using DVD_Rental_Website.IService;
using DVD_Rental_Website.Model.Response_Models;
using DVD_Rental_Website.Repository;

namespace DVD_Rental_Website.Service
{
    public class RentalService : IRentalService
    {
        private readonly IRentalRepository _rentalRepository;

        public RentalService(IRentalRepository rentalRepository)
        {
            _rentalRepository = rentalRepository;
        }
        //get rental by id
        public async Task<RentalResponseModel> GetRentalById(Guid id)
        {
            var data = await _rentalRepository.GetRentalByID(id);
            var rentalresp = new RentalResponseModel
            {
                RentalId = data.RentalId,
                CustomerID = data.CustomerID,
                DVDId = data.DVDId,
                Returndate = data.Returndate,
                status = data.status,
                Isoverdue = data.Isoverdue,
                RentalDate = data.RentalDate,
            };

            return rentalresp;
        }

        //get all rental customers
        public async Task<List<RentalResponseModel>> GetAllRentalsByCustomerId(Guid customerId)
        {
            var rentals = await _rentalRepository.GetAllRentalsByCustomerID(customerId);

            var rentaldata = new List<RentalResponseModel>();

            foreach (var data in rentals)
            {
                var rentalresp = new RentalResponseModel
                {
                    RentalId = data.RentalId,
                    CustomerID = data.CustomerID,
                    DVDId = data.DVDId,
                    Returndate = data.Returndate,
                    status = data.status,
                    Isoverdue = data.Isoverdue,
                    RentalDate = data.RentalDate,
                };

                rentaldata.Add(rentalresp);
            }
            return rentaldata;
        }

        //add a rental
    

        public async Task<RentalResponseModel> AddRental(RentalResponseModel rentalRequestDTO)
        {
            var rental = new Rent
            {
                CustomerID = rentalRequestDTO.CustomerID,
                DVDId = rentalRequestDTO.DVDId,
                Returndate = rentalRequestDTO.Returndate,
                RentalDate = rentalRequestDTO.RentalDate,
            };

            var data = await _rentalRepository.AddRental(rental);

            var rentalresp = new RentalResponseModel
            {
                RentalId = data.RentalId,
                CustomerID = data.CustomerID,
                DVDId = data.DVDId,
                Returndate = data.Returndate,
                status = data.status,
                Isoverdue = data.Isoverdue,
                RentalDate = data.RentalDate,
            };

            return rentalresp;
        }

        //rental accept status

        public async Task<RentalResponseModel> RentalAccept(Guid id)
        {
            var Rentdata = await _rentalRepository.GetRentalByID(id);
            if (Rentdata.status == "Pending")
            {
                var data = await _rentalRepository.RentalAccept(Rentdata);

                var RentalRespon = new RentalResponseModel
                {
                    RentalId = id,
                    RentalDate = data.RentalDate,
                    Returndate = data.Returndate,
                    DVDId = data.DVDId,
                    CustomerID = data.CustomerID,
                    Isoverdue = data.Isoverdue,
                    status = data.status
                };

                return RentalRespon;
            }
            else
            {
                return null;
            }
        }


        // update rental status to return

        public async Task<RentalResponseModel> UpdateRentToReturn(Guid id)
        {
            var Rentdata = await _rentalRepository.GetRentalByID(id);
            if (Rentdata.status == "Rent")
            {
                var data = await _rentalRepository.UpdateRentToReturn(Rentdata);

                var RentalRespon = new RentalResponseModel
                {
                    RentalId = id,
                    RentalDate = data.RentalDate,
                    Returndate = data.Returndate,
                    DVDId = data.DVDId,
                    CustomerID = data.CustomerID,
                    Isoverdue = data.Isoverdue,
                    status = data.status
                };

                return RentalRespon;
            }
            else
            {
                return null;
            }
        }


        //get all rentals

        public async Task<List<RentalResponseModel>> GetAllRentals()
        {
            var customer = await _rentalRepository.GetAllRentals();

            var data = new List<RentalResponseModel>();
            foreach (var item in customer)
            {
                var rentalrespo = new RentalResponseModel
                {
                    RentalId = item.RentalId,
                    DVDId = item.DVDId,
                    CustomerID = item.CustomerID,
                    RentalDate = item.RentalDate,
                    Returndate = item.Returndate,
                    Isoverdue = item.Isoverdue,
                    status = item.status,
                };

                data.Add(rentalrespo);
            }

            return data;
        }

        //reject rental by id

        public async Task<bool> RejectRental(Guid rentalid)
        {
            var rental = await _rentalRepository.GetRentalByID(rentalid);
            if (rental == null) return false;

            await _rentalRepository.RejectRental(rentalid);
            return true;
        }

        // check and update overdue rentals

        public async Task<List<Guid>> CheckAndUpdateOverdueRentals()
        {
            var overdue = await _rentalRepository.CheckAndUpdateOverdueRentals();
            if (overdue == null) return null;
            return overdue;
        }


    }
}
