using DVD_Rental_Website.Model.RequestModels;
using DVD_Rental_Website.Model.Response_Models;

namespace DVD_Rental_Website.IService
{
    public interface ICustomerService
    {
        Task<CustomerResponseModel> AddCustomer(CustomerRequestModel customerRequestModel);
        Task<CustomerResponseModel> GetCustomerById(Guid id);
        Task<List<CustomerResponseModel>> GetAllCustomers();
        Task<CustomerResponseModel> UpdateCustomer(Guid id, CustomerRequestModel customerRequestModel);
        Task<CustomerResponseModel> SoftDelete(Guid id);
    }
}
