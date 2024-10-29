using DVD_Rental_Website.Entities;
using DVD_Rental_Website.Model.Response_Models;

namespace DVD_Rental_Website.IRepository
{
    public interface ICustomerRepository
    {
        Task<Customer> AddCustomer(Customer newCustomer);
        Task<Customer> GetCustomerById(Guid id);
        Task<List<Customer>> GetAllCustomers();
        Task<Customer> GetCustomerByNic(int nic);
        Task<Customer> GetCustomerByUserName(string userName);
        Task<Customer> UpdateCustomer(Customer updatedCustomer);
        Task<Customer> SoftDeleteCustomer(Customer customerToDelete);
    }
}
