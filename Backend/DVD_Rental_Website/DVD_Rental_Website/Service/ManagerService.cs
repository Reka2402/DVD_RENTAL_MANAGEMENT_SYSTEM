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
                CopiesAvailable = managerRequestModel.CopiesAvailable,
                ImagePath = managerRequestModel.ImagePath,
                IsAvailable = managerRequestModel.IsAvailale
            };

            if (managerRequestModel.ImageFile != null && managerRequestModel.ImageFile.Length > 0)
            {
                if (string.IsNullOrEmpty(_webHostEnvironment.WebRootPath))
                {
                    throw new ArgumentNullException(nameof(__webHostEnvironment.WebRootPath)),"WebRootPath is not set.")
                }
                var dvdImagePath = Path.Combine(_webHostEnvironment.WebRootPath, "dvdimages");


            if (!Directory.Exists(dvdImagePath))
                {
                    Directory.CreateDirectory(dvdImagePath);
                }
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(managerRequestModel.ImageFile.FileName);
                var imagePath = Path.Combine(dvdImagePath, fileName);

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await managerRequestModel.ImageFile.CopyToAsync(stream);
                }
                dvd.ImagePath = "/dvdimages/" + fileName;
            }
                var createdDVD = await _managerRepository.AddDVD(dvd);
                return new ManagerResponseModel
            {
                Id = createdDVD.Id,
                Title = createdDVD.Title,
                Genre = createdDVD.Genre,
                Director = createdDVD.Director,
                ReleaseDate = createdDVD.ReleaseDate,
                CopiesAvailable = createdDVD.CopiesAvailable,
                ImagePath = createdDVD.ImagePath,
                IsAvailable = createdDVD.IsAvailable,
                };
        }

        public async Task<ManagerResponseModel> GetDVDById(Guid Id)
        {
            var dvdData = await _managerRepository.GetDVDById(Id);

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
                    Title = dvd.Title,
                    Genre = dvd.Genre,
                    Director = dvd.Director,
                    ReleaseDate = dvd.ReleaseDate,
                    CopiesAvailable = dvd.CopiesAvailable,
                    ImagePath = dvd.ImagePath,
                    IsAvailable = dvd.IsAvailable

                });
            }

            return responseList;
        }

          public async Task<ManagerResponseModel> EditDVDAsync(Guid dvdId, ManagerRequestModel dvdRequest)
            {
                // Get the dvd by ID
                var dvd = await _managerRepository.GetDVDById(dvdId);
                if (dvd == null) return null;

                // Update the dvd's basic information
                dvd.Title = dvdRequest.Title;
                dvd.Genre = dvdRequest.Genre;
                dvd.Director = dvdRequest.Director;
                dvd.ReleaseDate = dvdRequest.ReleaseDate;
                dvd.CopiesAvailable = dvdRequest.CopiesAvailable;
               

                // Handle the image upload if a new image is provided
                if (dvdRequest.ImageFile != null && dvdRequest.ImageFile.Length > 0)
                {
                    // Delete the old image if it exists
                    if (!string.IsNullOrEmpty(dvd.ImagePath))
                    {
                        var oldImagePath = Path.Combine(_webHostEnvironment.WebRootPath, dvd.ImagePath.TrimStart('/'));
                        if (File.Exists(oldImagePath))
                        {
                            File.Delete(oldImagePath);
                        }
                    }

                    // Save the new image
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dvdRequest.ImageFile.FileName);
                    var newImagePath = Path.Combine(_webHostEnvironment.WebRootPath, "dvdimages", fileName);

                    using (var stream = new FileStream(newImagePath, FileMode.Create))
                    {
                        await dvdRequest.ImageFile.CopyToAsync(stream);
                    }

                    // Update the image path
                    dvd.ImagePath = "/dvdimages/" + fileName;
                }

                // Update the dvd in the database
                await _managerRepository.UpdateDVD(dvd);

                // Return the updated dvd as a response Modal
                return new ManagerResponseModel
                {
                    Id = dvd.Id,
                    Title = dvd.Title,                 
                    Director = dvd.Director,
                    Genre = dvd.Genre,
                    ReleaseDate = dvd.ReleaseDate,
                    CopiesAvailable = dvd.CopiesAvailable,
                    IsAvailable = dvd.IsAvailable,
                    ImagePath = dvd.ImagePath,
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
                CopiesAvailable = deletedDVD.CopiesAvailable,
                ImagePath = deletedDVD.ImagePath,
                IsAvailable = deletedDVD.IsAvailable,


            };
        }

    }
}
