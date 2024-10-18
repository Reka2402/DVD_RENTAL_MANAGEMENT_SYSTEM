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

                var sqlCommand = new SqlCommand(
                    "INSERT INTO DVDs (Id, Title, Genre, Director, ReleaseDate, CopiesAvailable) " +
                    "VALUES (@Id, @Title, @Genre, @Director, @ReleaseDate, @CopiesAvailable);",
                    connection);

                sqlCommand.Parameters.AddWithValue("@Id", newDVD.Id);
                sqlCommand.Parameters.AddWithValue("Title", newDVD.Title);
                sqlCommand.Parameters.AddWithValue("@Genre", newDVD.Genre);
                sqlCommand.Parameters.AddWithValue("@Director", newDVD.Director);
                sqlCommand.Parameters.AddWithValue("@ReleaseDate", newDVD.ReleaseDate);
                sqlCommand.Parameters.AddWithValue("@CopiesAvailable", newDVD.CopiesAvailable);
                sqlCommand.Parameters.AddWithValue("@ImagePath", newDVD.ImagePath);
                sqlCommand.Parameters.AddWithValue("@IsAvailable", newDVD.IsAvailable);

                await sqlCommand.ExecuteNonQueryAsync();

                return newDVD;
            }
        }

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
                            CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable")),
                             ImagePath = reader.GetString(reader.GetOrdinal("ImagePath")),
                            IsAvailable = reader.GetBoolean(reader.GetOrdinal("IsAvailable")),

                        };
                    }
                }
                return null;
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
                            CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable")),
                            ImagePath = reader.GetString(reader.GetOrdinal("ImagePath")),
                            IsAvailable = reader.GetBoolean(reader.GetOrdinal("IsAvailable")),
                        });
                    }
                }
            }
            return DVDList;
        }

        public async Task<DVD> DeleteDVD(Guid id)
        {
            DVD dvd = null;
            using (var connection = new SqlConnection(_connectionString))
            {

                var selectQuery = "SELECT * FROM DVDs WHERE Id = @Id";
                using (var selectCommand = new SqlCommand(selectQuery, connection))
                {
                    selectCommand.Parameters.AddWithValue("@Id", id);

                    connection.Open();
                    using (var reader = await selectCommand.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            dvd = new DVD
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Genre = reader.GetString(reader.GetOrdinal("Genre")),
                                Director = reader.GetString(reader.GetOrdinal("Director")),
                                ReleaseDate = reader.GetDateTime(reader.GetOrdinal("ReleaseDate")),
                                CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable")),
                                ImagePath = reader.GetString(reader.GetOrdinal("ImagePath")),
                                IsAvailable = reader.GetBoolean(reader.GetOrdinal("IsAvailable")),
                            };
                        }
                        connection.Close();
                    }
                }


                var deleteQuery = "DELETE FROM DVDs WHERE Id = @Id";
                using (var deleteCommand = new SqlCommand(deleteQuery, connection))
                {
                    deleteCommand.Parameters.AddWithValue("@Id", id);

                    connection.Open();
                    await deleteCommand.ExecuteNonQueryAsync();
                    connection.Close();
                }
            }
            return dvd;
        }

        public async Task<DVD> UpdateDVD(DVD dvd)
        {
            DVD existingdvd = null;
            using (var connection = new SqlConnection(_connectionString))
            {

                var selectQuery = "SELECT * FROM DVDs WHERE Id = @Id";
                using (var selectCommand = new SqlCommand(selectQuery, connection))
                {
                    selectCommand.Parameters.AddWithValue("@Id", dvd.Id);

                    connection.Open();
                    using (var reader = await selectCommand.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            existingdvd = new DVD
                            {

                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Genre = reader.GetString(reader.GetOrdinal("Genre")),
                                Director = reader.GetString(reader.GetOrdinal("Director")),
                                ReleaseDate = reader.GetDateTime(reader.GetOrdinal("ReleaseDate")),
                                CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable")),
                                ImagePath = reader.GetString(reader.GetOrdinal("ImagePath")),
                                IsAvailable = reader.GetBoolean(reader.GetOrdinal("IsAvailable")),
                            };
                        }
                        connection.Close();
                    }
                }

                if (existingdvd != null)
                {
                    var updateQuery = "UPDATE DVDs SET Title=@Title,Genre=@Genre,Director=@Director, ReleaseDate = @ReleaseDate,  CopiesAvailable = @CopiesAvailable,Description=@Description,ImagePath = @ImagePath,IsAvailable=@IsAvailable WHERE Id = @Id";
                    using (var Command = new SqlCommand(updateQuery, connection))
                    {

                        Command.Parameters.AddWithValue("@Id", dvd.Id);
                        Command.Parameters.AddWithValue("@Title", dvd.Title);
                        Command.Parameters.AddWithValue("@Genre", dvd.Genre);
                        Command.Parameters.AddWithValue("@Director", dvd.Director);
                        Command.Parameters.AddWithValue("@ReleaseDate", dvd.ReleaseDate);
                        Command.Parameters.AddWithValue("@CopiesAvailable", dvd.CopiesAvailable);
                        Command.Parameters.AddWithValue("@ImagePath", dvd.ImagePath);
                        Command.Parameters.AddWithValue("@IsAvailable", dvd.IsAvailable);

                        connection.Open();
                        await Command.ExecuteNonQueryAsync();
                        connection.Close();
                    }
                }
            }
            return existingdvd;
        }
    }
}
