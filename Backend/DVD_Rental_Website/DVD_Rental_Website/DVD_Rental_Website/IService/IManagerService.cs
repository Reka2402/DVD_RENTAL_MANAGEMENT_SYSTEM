using DVD_Rental_Website.Model.RequestModels;
using DVD_Rental_Website.Model.Response_Models;

namespace DVD_Rental_Website.IService
{
    public interface IManagerService
    {
        Task<ManagerResponseModel> AddDVD(ManagerRequestModel managerRequestModel);

        Task<ManagerResponseModel> GetDVDById(Guid Id);

        Task<List<ManagerResponseModel>> GetAllDVDs();

        Task<ManagerResponseModel> UpdateDVD(Guid Id, ManagerRequestModel managerRequestModel);

        Task<ManagerResponseModel> Delete(Guid Id);
    }
}
