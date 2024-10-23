using DVD_Rental_Website.Entities;
using DVD_Rental_Website.IRepository;
using System.Data;
using System.Data.SqlClient;

namespace DVD_Rental_Website.Repository
{
    public class RentalRepository : IRentalRepository
    {
        private readonly string _connectionString;

        public RentalRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        //get rental by id
        public async Task<Rent> GetRentalByID(Guid rentalId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var command = new SqlCommand(
                    "SELECT * FROM Rent WHERE RentalId = @RentalId", connection);
                command.Parameters.AddWithValue("@RentalId", rentalId);

                var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow);
                if (await reader.ReadAsync())
                {
                    return new Rent
                    {
                        RentalId = reader.GetGuid(reader.GetOrdinal("RentalId")),
                        CustomerID = reader.GetGuid(reader.GetOrdinal("CustomerID")),
                        DVDId = reader.GetGuid(reader.GetOrdinal("DVDId")),
                        RentalDate = reader.GetDateTime(reader.GetOrdinal("RentalDate")),
                        Returndate = reader.GetDateTime(reader.GetOrdinal("Returndate")),
                        Isoverdue = reader.GetBoolean(reader.GetOrdinal("Isoverdue")),
                        status = reader.GetString(reader.GetOrdinal("status")),
                    };
                }
                return null;
            }
        }


        //get all rental customers
        public async Task<List<Rent>> GetAllRentalsByCustomerID(Guid CustomerID)
        {
            var rentals = new List<Rent>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var command = new SqlCommand(
                    "SELECT * FROM Rent WHERE CustomerID = @CustomerID", connection);
                command.Parameters.AddWithValue("@CustomerID", CustomerID);

                var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    rentals.Add(new Rent
                    {
                        RentalId = reader.GetGuid(reader.GetOrdinal("RentalId")),
                        CustomerID = reader.GetGuid(reader.GetOrdinal("CustomerID")),
                        DVDId = reader.GetGuid(reader.GetOrdinal("DVDId")),
                        RentalDate = reader.GetDateTime(reader.GetOrdinal("RentalDate")),
                        Returndate = reader.GetDateTime(reader.GetOrdinal("Returndate")),
                        Isoverdue = reader.GetBoolean(reader.GetOrdinal("Isoverdue")),
                        status = reader.GetString(reader.GetOrdinal("status")),

                    });
                }
            }
            return rentals;
        }

        //add a rental
        public async Task<Rent> AddRental(Rent rental)
        {
            rental.RentalId = Guid.NewGuid();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var command = new SqlCommand(
                    "INSERT INTO Rent (RentalId, CustomerID, DVDId,RentalDate,Returndate,Isoverdue, Status) VALUES (@Id, @CustomerID, @DVDId,@RentalDate,@RentalDate,@Isoverdue, @Status); SELECT SCOPE_IDENTITY();", connection);
                command.Parameters.AddWithValue("@Id", rental.RentalId);
                command.Parameters.AddWithValue("@CustomerID", rental.CustomerID);
                command.Parameters.AddWithValue("@DVDId", rental.DVDId);
                command.Parameters.AddWithValue("@RentalDate", DateTime.Now);
                command.Parameters.AddWithValue("@Returndate", DBNull.Value);
                command.Parameters.AddWithValue("@Isoverdue", rental.Isoverdue);
                command.Parameters.AddWithValue("@status", rental.status);

                await command.ExecuteScalarAsync();

                return rental;
            }
        }


        //rental accept status
        public async Task<Rent> RentalAccept(Rent rental)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var command = new SqlCommand(
                    "UPDATE Rent SET Status = @Status WHERE RentalId = @RentalId", connection);
                command.Parameters.AddWithValue("@RentalId", rental.RentalId);
                command.Parameters.AddWithValue("@Status", "Rent");

                await command.ExecuteNonQueryAsync();
                var selectCommand = new SqlCommand(
                    "SELECT * FROM Rent WHERE RentalId = @RentalId", connection);
                selectCommand.Parameters.AddWithValue("@RentalId", rental.RentalId);

                using (var reader = await selectCommand.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        // Map the updated rental data
                        rental.status = reader["Status"].ToString();
                        rental.Returndate = reader.GetDateTime(reader.GetOrdinal("Returndate"));
                        rental.Isoverdue = reader.GetBoolean(reader.GetOrdinal("Isoverdue"));
                        // Map other necessary fields
                    }
                }

                return rental;
            }
        }

        // update rental status to return
        public async Task<Rent> UpdateRentToReturn(Rent rental)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var command = new SqlCommand(
                    "UPDATE Rent SET Status = @Status, Returndate = @Returndate WHERE RentalId = @RentalId", connection);

                command.Parameters.AddWithValue("@RentalId", rental.RentalId);
                command.Parameters.AddWithValue("@Status", "Return");
                command.Parameters.AddWithValue("@Returndate", DateTime.Now);

                await command.ExecuteNonQueryAsync();

                // Fetch updated data from the database
                var selectCommand = new SqlCommand(
                    "SELECT * FROM Rent WHERE RentalId = @RentalId", connection);
                selectCommand.Parameters.AddWithValue("@RentalId", rental.RentalId);

                using (var reader = await selectCommand.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        // Map the updated rental data
                        rental.status = reader["Status"].ToString();
                        rental.Returndate = reader.GetDateTime(reader.GetOrdinal("Returndate"));
                        rental.Isoverdue = reader.GetBoolean(reader.GetOrdinal("Isoverdue"));
                        // Map other necessary fields
                    }
                }

                return rental;
            }
        }

        //get all rentals
        public async Task<List<Rent>> GetAllRentals()
        {
            var rentals = new List<Rent>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var command = new SqlCommand("SELECT * FROM Rent", connection);

                var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    rentals.Add(new Rent
                    {
                        RentalId = reader.GetGuid(reader.GetOrdinal("RentalId")),
                        CustomerID = reader.GetGuid(reader.GetOrdinal("CustomerID")),
                        DVDId = reader.GetGuid(reader.GetOrdinal("DVDId")),
                        RentalDate = reader.GetDateTime(reader.GetOrdinal("RentalDate")),
                        Returndate = reader.GetDateTime(reader.GetOrdinal("Returndate")),
                        Isoverdue = reader.GetBoolean(reader.GetOrdinal("Isoverdue")),
                        status = reader.GetString(reader.GetOrdinal("status"))

                    });
                }
            }
            return rentals;
        }

        //reject rental by id
        public async Task<Rent> RejectRental(Guid RentalId)
        {
            Rent rental = null;
            using (var connection = new SqlConnection(_connectionString))
            {

                var selectQuery = "SELECT * FROM Rent WHERE RentalId = @RentalId";
                using (var selectCommand = new SqlCommand(selectQuery, connection))
                {
                    selectCommand.Parameters.AddWithValue("@RentalId", RentalId);

                    connection.Open();
                    using (var reader = await selectCommand.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            rental = new Rent
                            {
                                RentalId = reader.GetGuid(reader.GetOrdinal("RentalId")),
                                CustomerID = reader.GetGuid(reader.GetOrdinal("CustomerID")),
                                DVDId = reader.GetGuid(reader.GetOrdinal("DVDId")),
                                RentalDate = reader.GetDateTime(reader.GetOrdinal("RentalDate")),
                                Returndate = reader.GetDateTime(reader.GetOrdinal("Returndate")),
                                Isoverdue = reader.GetBoolean(reader.GetOrdinal("Isoverdue")),
                                status = reader.GetString(reader.GetOrdinal("Status"))
                            };
                        }
                        connection.Close();
                    }
                }


                var deleteQuery = "DELETE FROM Rent WHERE RentalId = @RentalId";
                using (var deleteCommand = new SqlCommand(deleteQuery, connection))
                {
                    deleteCommand.Parameters.AddWithValue("@RentalId", RentalId);

                    connection.Open();
                    await deleteCommand.ExecuteNonQueryAsync();
                    connection.Close();
                }
            }
            return rental;
        }

        // check and update overdue rentals
        public async Task<List<Guid>> CheckAndUpdateOverdueRentals()
        {
            var overdueRentalIds = new List<Guid>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var selectCommand = new SqlCommand(
                    "SELECT * FROM Rent WHERE Returndate IS NOT NULL AND Isoverdue = 0", connection);

                using (var reader = await selectCommand.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var returndate = reader.GetDateTime(reader.GetOrdinal("Returndate"));
                        var rentalId = reader.GetGuid(reader.GetOrdinal("RentalId"));

                        if (DateTime.Now > returndate.AddDays(7))
                        {
                            overdueRentalIds.Add(rentalId);
                        }
                    }

                }

                foreach (var rentalId in overdueRentalIds)
                {
                    var updateCommand = new SqlCommand(
                        "UPDATE Rentals SET Isoverdue = 1 WHERE Id = @Id", connection);
                    updateCommand.Parameters.AddWithValue("@Id", rentalId);

                    await updateCommand.ExecuteNonQueryAsync();
                }
            }

            return overdueRentalIds;
        }





    }
}
