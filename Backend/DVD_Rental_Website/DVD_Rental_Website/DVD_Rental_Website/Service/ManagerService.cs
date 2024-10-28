using DVD_Rental_Website.Entities;
using DVD_Rental_Website.IRepository;
using DVD_Rental_Website.IService;
using DVD_Rental_Website.Model.RequestModels;
using DVD_Rental_Website.Model.Response_Models;
using DVD_Rental_Website.Repository;

namespace DVD_Rental_Website.Service
{
    public class ManagerService : IManagerService
    {
        private readonly IManagerRepository _managerRepository;

        public ManagerService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }

        public async Task<ManagerResponseModel> AddDVD(ManagerRequestModel managerRequestModel)
        {
            var dvd = new DVD
            {
                Title = managerRequestModel.Title,
                Genre = managerRequestModel.Genre,
                Director = managerRequestModel.Director,
                ReleaseDate = managerRequestModel.ReleaseDate,
                CopiesAvailable = managerRequestModel.CopiesAvailable
            };

            var createdDVD = await _managerRepository.AddDVD(dvd);

            return new ManagerResponseModel
            {
                Id = createdDVD.Id,
                Title = createdDVD.Title,
                Genre = createdDVD.Genre,
                Director = createdDVD.Director,
                ReleaseDate = createdDVD.ReleaseDate,
                CopiesAvailable = createdDVD.CopiesAvailable
            };
        }

        //public async Task<ManagerResponseModel> GetDVDById(Guid Id)
        //{
        //    var dvdData = await _managerRepository.GetDVDById(Id);

        //    return new ManagerResponseModel
        //    {
        //        Id = dvdData.Id,
        //        Title = dvdData.Title,
        //        Genre = dvdData.Genre,
        //        Director = dvdData.Director,
        //        ReleaseDate = dvdData.ReleaseDate,
        //        CopiesAvailable = dvdData.CopiesAvailable
        //    };
        //}

        public async Task<ManagerResponseModel> GetDVDById(Guid id)
        {
            var dvdData = await _managerRepository.GetDVDById(id);

            if (dvdData == null) // Check if dvdData is null
            {
                return null; // Handle this appropriately in the controller
            }

            return new ManagerResponseModel
            {
                Id = dvdData.Id,
                Title = dvdData.Title,
                Genre = dvdData.Genre,
                Director = dvdData.Director,
                ReleaseDate = dvdData.ReleaseDate,
                CopiesAvailable = dvdData.CopiesAvailable
            };
        }


        public async Task<List<ManagerResponseModel>> GetAllDVDs()
        {
            var dvdsList = await _managerRepository.GetAllDVDs();

            var responseList = new List<ManagerResponseModel>();
            foreach (var dvd in dvdsList)
            {
                responseList.Add(new ManagerResponseModel
                {
                    Id= dvd.Id,
                    Title = dvd.Title,
                    Genre = dvd.Genre,
                    Director = dvd.Director,
                    ReleaseDate = dvd.ReleaseDate,
                    CopiesAvailable = dvd.CopiesAvailable
                });
            }

            return responseList;
        }

        public async Task<ManagerResponseModel> UpdateDVD(Guid Id, ManagerRequestModel managerRequestModel)
        {
            var dvd = new DVD
            {
                Id = Id,
                Title = managerRequestModel.Title,
                Genre = managerRequestModel.Genre,
                Director = managerRequestModel.Director,
                ReleaseDate = managerRequestModel.ReleaseDate,
                CopiesAvailable = managerRequestModel.CopiesAvailable
            };

            var updatedDVD = await _managerRepository.UpdateDVD(dvd);

            return new ManagerResponseModel
            {
                Id = Id,
                Title = managerRequestModel.Title,
                Genre = managerRequestModel.Genre,
                Director = managerRequestModel.Director,
                ReleaseDate = managerRequestModel.ReleaseDate,
                CopiesAvailable = managerRequestModel.CopiesAvailable
            };
        }

        public async Task<ManagerResponseModel> Delete(Guid Id)
        {
            var dvdData = await _managerRepository.GetDVDById(Id);
            var deletedDVD = await _managerRepository.DeleteDVD(dvdData);

            return new ManagerResponseModel
            {
                Id = Id,
                Title = deletedDVD.Title,
                Genre = deletedDVD.Genre,
                Director = deletedDVD.Director,
                ReleaseDate = deletedDVD.ReleaseDate,
                CopiesAvailable = deletedDVD.CopiesAvailable
            };
        }

    }
}
