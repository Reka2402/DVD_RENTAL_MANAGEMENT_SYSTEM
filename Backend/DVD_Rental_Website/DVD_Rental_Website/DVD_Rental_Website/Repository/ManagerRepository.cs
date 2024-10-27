using DVD_Rental_Website.Entities;
using DVD_Rental_Website.IRepository;
using System.Data;
using System.Data.SqlClient;

namespace DVD_Rental_Website.Repository
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly string _connectionString;

        public ManagerRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<DVD> AddDVD(DVD newDVD)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Dynamically generate a new Id for the DVD if not already set
                newDVD.Id = Guid.NewGuid();

                var sqlCommand = new SqlCommand(
                    "INSERT INTO DVDs (Id, Title, Genre, Director, ReleaseDate, CopiesAvailable) " +
                    "VALUES (@Id, @Title, @Genre, @Director, @ReleaseDate, @CopiesAvailable);",
                    connection);

                sqlCommand.Parameters.AddWithValue("@Id", newDVD.Id);
                sqlCommand.Parameters.AddWithValue("@Title", newDVD.Title);
                sqlCommand.Parameters.AddWithValue("@Genre", newDVD.Genre);
                sqlCommand.Parameters.AddWithValue("@Director", newDVD.Director);
                sqlCommand.Parameters.AddWithValue("@ReleaseDate", newDVD.ReleaseDate);
                sqlCommand.Parameters.AddWithValue("@CopiesAvailable", newDVD.CopiesAvailable);

                await sqlCommand.ExecuteNonQueryAsync();
            }

            return newDVD;
        }

        //public async Task<DVD> GetDVDById(Guid id)
        //{
        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        await connection.OpenAsync();

        //        var sqlCommand = new SqlCommand("SELECT * FROM DVDs WHERE Id = @Id", connection);
        //        sqlCommand.Parameters.AddWithValue("@Id", id);

        //        using (var reader = await sqlCommand.ExecuteReaderAsync(CommandBehavior.SingleRow))
        //        {
        //            if (await reader.ReadAsync())
        //            {
        //                return new DVD
        //                {
        //                    Id = reader.GetGuid(reader.GetOrdinal("Id")),
        //                    Title = reader.GetString(reader.GetOrdinal("Title")),
        //                    Genre = reader.GetString(reader.GetOrdinal("Genre")),
        //                    Director = reader.GetString(reader.GetOrdinal("Director")),
        //                    ReleaseDate = reader.GetDateTime(reader.GetOrdinal("ReleaseDate")),
        //                    CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable"))
        //                };
        //            }
        //        }
        //        return null;
        //    }
        //}


        public async Task<DVD> GetDVDById(Guid id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand("SELECT * FROM DVDs WHERE Id = @Id", connection);
                sqlCommand.Parameters.AddWithValue("@Id", id);

                using (var reader = await sqlCommand.ExecuteReaderAsync(CommandBehavior.SingleRow))
                {
                    if (await reader.ReadAsync())
                    {
                        return new DVD
                        {
                            Id = reader.GetGuid(reader.GetOrdinal("Id")),
                            Title = reader.GetString(reader.GetOrdinal("Title")),
                            Genre = reader.GetString(reader.GetOrdinal("Genre")),
                            Director = reader.GetString(reader.GetOrdinal("Director")),
                            ReleaseDate = reader.GetDateTime(reader.GetOrdinal("ReleaseDate")),
                            CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable"))
                        };
                    }
                    else
                    {
                        return null; // No record found
                    }
                }
            }
        }

        public async Task<List<DVD>> GetAllDVDs()
        {
            var DVDList = new List<DVD>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand("SELECT * FROM DVDs", connection);
                using (var reader = await sqlCommand.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        DVDList.Add(new DVD
                        {
                            Id = reader.GetGuid(reader.GetOrdinal("Id")),
                            Title = reader.GetString(reader.GetOrdinal("Title")),
                            Genre = reader.GetString(reader.GetOrdinal("Genre")),
                            Director = reader.GetString(reader.GetOrdinal("Director")),
                            ReleaseDate = reader.GetDateTime(reader.GetOrdinal("ReleaseDate")),
                            CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable"))
                        });
                    }
                }
            }
            return DVDList;
        }

        public async Task<DVD> UpdateDVD(DVD updatedDVD)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand(
                    "UPDATE DVDs SET Title = @Title, Genre = @Genre, Director  = @Director , " +
                    "ReleaseDate = @ReleaseDate, CopiesAvailable = @CopiesAvailable WHERE Id = @Id", connection);

                sqlCommand.Parameters.AddWithValue("@Id", updatedDVD.Id);
                sqlCommand.Parameters.AddWithValue("@Title", updatedDVD.Title);
                sqlCommand.Parameters.AddWithValue("@Genre", updatedDVD.Genre);
                sqlCommand.Parameters.AddWithValue("@Director", updatedDVD.Director);
                sqlCommand.Parameters.AddWithValue("@ReleaseDate", updatedDVD.ReleaseDate);
                sqlCommand.Parameters.AddWithValue("@CopiesAvailable", updatedDVD.CopiesAvailable);


                await sqlCommand.ExecuteNonQueryAsync();
                return updatedDVD;
            }
        }
        
        public async Task<DVD> DeleteDVD(DVD DVDToDelete)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand(
                    "DELETE  FROM DVDs  WHERE Id = @Id", connection);

                sqlCommand.Parameters.AddWithValue("@Id", DVDToDelete.Id);


                await sqlCommand.ExecuteNonQueryAsync();
                return DVDToDelete;
            }
        }
    }
}
