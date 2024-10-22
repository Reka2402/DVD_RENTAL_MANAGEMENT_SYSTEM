using DVD_Rental_Website.Entities;
using DVD_Rental_Website.IRepository;
using System.Data;
using System.Data.SqlClient;

namespace DVD_Rental_Website.Repository
{
    public class CustomerRepository: ICustomerRepository
    {
        private readonly string _connectionString;

        public CustomerRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public async Task<Customer> AddCustomer(Customer newCustomer)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Do not set the Id before the insert
                newCustomer.Id = Guid.NewGuid();

                var sqlCommand = new SqlCommand(
                    "INSERT INTO Customers (Id, UserName, Mobilenumber, Email, Nic, Password, IsActive) " +
                    "VALUES (@Id, @UserName, @Mobilenumber, @Email, @Nic, @Password, @IsActive);",
                    connection);

                sqlCommand.Parameters.AddWithValue("@Id", newCustomer.Id);
                sqlCommand.Parameters.AddWithValue("@UserName", newCustomer.UserName);
                sqlCommand.Parameters.AddWithValue("@Mobilenumber", newCustomer.Mobilenumber);
                sqlCommand.Parameters.AddWithValue("@Email", newCustomer.Email);
                sqlCommand.Parameters.AddWithValue("@Nic", newCustomer.Nic);
                sqlCommand.Parameters.AddWithValue("@Password", newCustomer.Password);
                sqlCommand.Parameters.AddWithValue("@IsActive", newCustomer.IsActive);


       



                await sqlCommand.ExecuteNonQueryAsync();

                return newCustomer;
            }
        }

        public async Task<Customer> GetCustomerById(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand("SELECT * FROM Customers WHERE Id = @Id", connection);
                sqlCommand.Parameters.AddWithValue("@Id", id);

                using (var reader = await sqlCommand.ExecuteReaderAsync(CommandBehavior.SingleRow))
                {
                    if (await reader.ReadAsync())
                    {
                        return new Customer
                        {
                            Id = reader.GetGuid(reader.GetOrdinal("Id")),
                            UserName = reader.GetString(reader.GetOrdinal("UserName")),
                            Mobilenumber = reader.GetString(reader.GetOrdinal("Mobilenumber")),
                            Email = reader.GetString(reader.GetOrdinal("Email")),
                            Nic = reader.GetInt32(reader.GetOrdinal("Nic")),
                            Password = reader.GetString(reader.GetOrdinal("Password")),
                            IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive"))
                        };
                    }
                }
                return null;
            }
        }

        public async Task<List<Customer>> GetAllCustomers()
        {
            var customerList = new List<Customer>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand("SELECT * FROM Customers", connection);
                using (var reader = await sqlCommand.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        customerList.Add(new Customer
                        {
                            Id = reader.GetGuid(reader.GetOrdinal("Id")),
                            UserName = reader.GetString(reader.GetOrdinal("UserName")),
                            Mobilenumber = reader.GetString(reader.GetOrdinal("Mobilenumber")),
                            Email = reader.GetString(reader.GetOrdinal("Email")),
                            Nic = reader.GetInt32(reader.GetOrdinal("Nic")),
                            Password = reader.GetString(reader.GetOrdinal("Password")),
                            IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive"))
                        });
                    }
                }
            }
            return customerList;
        }

        public async Task<Customer> UpdateCustomer(Customer updatedCustomer)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand(
                    "UPDATE Customers SET UserName = @UserName, Mobilenumber = @Mobilenumber, Email = @Email, " +
                    "Nic = @Nic, Password = @Password, IsActive = @IsActive WHERE Id = @Id", connection);

                sqlCommand.Parameters.AddWithValue("@Id", updatedCustomer.Id);
                sqlCommand.Parameters.AddWithValue("@UserName", updatedCustomer.UserName);
                sqlCommand.Parameters.AddWithValue("@Mobilenumber", updatedCustomer.Mobilenumber);
                sqlCommand.Parameters.AddWithValue("@Email", updatedCustomer.Email);
                sqlCommand.Parameters.AddWithValue("@Nic", updatedCustomer.Nic);
                sqlCommand.Parameters.AddWithValue("@Password", updatedCustomer.Password);
                sqlCommand.Parameters.AddWithValue("@IsActive", updatedCustomer.IsActive);

                await sqlCommand.ExecuteNonQueryAsync();
                return updatedCustomer;
            }
        }

        public async Task<Customer> SoftDeleteCustomer(Customer customerToDelete)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand(
                    "UPDATE Customers SET IsActive = @IsActive WHERE Id = @Id", connection);

                sqlCommand.Parameters.AddWithValue("@Id", customerToDelete.Id);
                sqlCommand.Parameters.AddWithValue("@IsActive", false);

                await sqlCommand.ExecuteNonQueryAsync();
                customerToDelete.IsActive = false;
                return customerToDelete;
            }
        }


    }
}
