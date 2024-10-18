using DVD_Rental_Website.Entities;
using DVD_Rental_Website.IRepository;
using DVD_Rental_Website.IService;
using DVD_Rental_Website.Model.RequestModels;
using DVD_Rental_Website.Model.Response_Models;
using Microsoft.AspNetCore.Mvc;

namespace DVD_Rental_Website.Service
{
    public class CustomerServie : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerServie(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }
        public async Task<CustomerResponseModel> AddCustomer(CustomerRequestModel customerRequestModel)
        {
            var customer = new Customer
            {
                UserName = customerRequestModel.UserName,
                Email = customerRequestModel.Email,
                Nic = customerRequestModel.Nic,
                Mobilenumber = customerRequestModel.Mobilenumber,
                Password = customerRequestModel.Password
            };

            var createdCustomer = await _customerRepository.AddCustomer(customer);

            return new CustomerResponseModel
            {
                Id = createdCustomer.Id,
                UserName = createdCustomer.UserName,
                Email = createdCustomer.Email,
                Nic = createdCustomer.Nic,
                Mobilenumber = createdCustomer.Mobilenumber,
                Password = createdCustomer.Password
            };
        }

        public async Task<CustomerResponseModel> GetCustomerById(Guid id)
        {
            var customerData = await _customerRepository.GetCustomerById(id);

            return new CustomerResponseModel
            {
                Id = customerData.Id,
                UserName = customerData.UserName,
                Mobilenumber = customerData.Mobilenumber,
                Email = customerData.Email,
                Nic = customerData.Nic,
                Password = customerData.Password,
                Rentals = customerData.Rentals
            };
        }

        public async Task<List<CustomerResponseModel>> GetAllCustomers()
        {
            var customersList = await _customerRepository.GetAllCustomers();

            var responseList = new List<CustomerResponseModel>();
            foreach (var customer in customersList)
            {
                responseList.Add(new CustomerResponseModel
                {
                    UserName = customer.UserName,
                    Nic = customer.Nic,
                    Id = customer.Id,
                    Mobilenumber = customer.Mobilenumber,
                    Email = customer.Email,
                    Rentals = customer.Rentals,
                    Password = customer.Password
                });
            }

            return responseList;
        }

        public async Task<CustomerResponseModel> UpdateCustomer(Guid id, CustomerRequestModel customerRequestModel)
        {
            var customer = new Customer
            {
                Id = id,
                UserName = customerRequestModel.UserName,
                Mobilenumber = customerRequestModel.Mobilenumber,
                Email = customerRequestModel.Email,
                Password = customerRequestModel.Password,
                Nic = customerRequestModel.Nic
            };

            var updatedCustomer = await _customerRepository.UpdateCustomer(customer);

            return new CustomerResponseModel
            {
                Id = id,
                UserName = updatedCustomer.UserName,
                Mobilenumber = updatedCustomer.Mobilenumber,
                Email = updatedCustomer.Email,
                Nic = updatedCustomer.Nic,
                Password = updatedCustomer.Password,
                Rentals = updatedCustomer.Rentals
            };
        }

        public async Task<CustomerResponseModel> SoftDelete(Guid id)
        {
            var customerData = await _customerRepository.GetCustomerById(id);
            var deletedCustomer = await _customerRepository.SoftDeleteCustomer(customerData);

            return new CustomerResponseModel
            {
                Id = id,
                UserName = deletedCustomer.UserName,
                Mobilenumber = deletedCustomer.Mobilenumber,
                Email = deletedCustomer.Email,
                Nic = deletedCustomer.Nic,
                Password = deletedCustomer.Password,
                Rentals = deletedCustomer.Rentals
            };
        }


    }
 }
