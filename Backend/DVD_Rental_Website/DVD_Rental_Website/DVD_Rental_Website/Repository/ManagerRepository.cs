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

        //ADD NEW DVDS
        public async Task<DVD> AddDVD(DVD newDVD)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var sqlCommand = new SqlCommand(
                    "INSERT INTO DVDs (Id, Title, Genre, Director, ReleaseDate, CopiesAvailable,ImagePath) " +
                    "VALUES (@Id, @Title, @Genre, @Director, @ReleaseDate, @CopiesAvailable,@ImagePath);",
                    connection);

                sqlCommand.Parameters.AddWithValue("@Id", newDVD.Id);
                sqlCommand.Parameters.AddWithValue("Title", newDVD.Title);
                sqlCommand.Parameters.AddWithValue("@Genre", newDVD.Genre);
                sqlCommand.Parameters.AddWithValue("@Director", newDVD.Director);
                sqlCommand.Parameters.AddWithValue("@ReleaseDate", newDVD.ReleaseDate);
                sqlCommand.Parameters.AddWithValue("@CopiesAvailable", newDVD.CopiesAvailable);
                sqlCommand.Parameters.AddWithValue("@ImagePath", newDVD.ImagePath);

                await sqlCommand.ExecuteNonQueryAsync();

                return newDVD;
            }
        }




        //GET DVDS BY ID

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
                            ImagePath = reader.GetString(reader.GetOrdinal("ImagePath"))
                        };
                    }
                }
                return null;
            }
        }


        //GET ALL DVDS

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




        //UPDATE DVDS
        public async Task<DVD> UpdateDVD(DVD dvd)
        {
            DVD existingDVD = null;
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
                            existingDVD = new DVD
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Genre = reader.GetString(reader.GetOrdinal("Genre")),
                                Director = reader.GetString(reader.GetOrdinal("Director")),
                                ReleaseDate = reader.GetDateTime(reader.GetOrdinal("ReleaseDate")),
                                CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable")),
                                ImagePath = reader.GetString(reader.GetOrdinal("ImagePath")),

                            };
                        }
                        connection.Close();
                    }
                }


                if (existingDVD != null)
                {
                    var updateQuery = "UPDATE DVDs SET Title=@Title,Genre=@Genre, Director = @Director,  ReleaseDate = @ReleaseDate,Description=@Description,CopiesAvailable = @CopiesAvailable,ImagePath=@ImagePath WHERE Id = @Id";
                    using (var updateCommand = new SqlCommand(updateQuery, connection))
                    {

                        updateCommand.Parameters.AddWithValue("@Id", dvd.Id);
                        updateCommand.Parameters.AddWithValue("@Title", dvd.Title);
                        updateCommand.Parameters.AddWithValue("@Genre", dvd.Genre);
                        updateCommand.Parameters.AddWithValue("@Director", dvd.Director);
                        updateCommand.Parameters.AddWithValue("@ReleaseDate", dvd.ReleaseDate);
                        updateCommand.Parameters.AddWithValue("@CopiesAvailable", dvd.CopiesAvailable);
                        updateCommand.Parameters.AddWithValue("@ImagePath", dvd.ImagePath);


                        connection.Open();
                        await updateCommand.ExecuteNonQueryAsync();
                        connection.Close();
                    }
                }
            }
            return existingDVD;
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

        ////DELETE DVDS
        //public async Task<DVD> DeleteDVD(Guid id)
        //{
        //    DVD dvd = null;
        //    using (var connection = new SqlConnection(_connectionString))
        //    {

        //        var selectQuery = "SELECT * FROM DVDs WHERE Id = @Id";
        //        using (var selectCommand = new SqlCommand(selectQuery, connection))
        //        {
        //            selectCommand.Parameters.AddWithValue("@Id", id);

        //            connection.Open();
        //            using (var reader = await selectCommand.ExecuteReaderAsync())
        //            {
        //                if (await reader.ReadAsync())
        //                {
        //                    dvd = new DVD
        //                    {
        //                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
        //                        Title = reader.GetString(reader.GetOrdinal("Title")),
        //                        Genre = reader.GetString(reader.GetOrdinal("Genre")),
        //                        Director = reader.GetString(reader.GetOrdinal("Director")),
        //                        ReleaseDate = reader.GetDateTime(reader.GetOrdinal("ReleaseDate")),
        //                        CopiesAvailable = reader.GetInt32(reader.GetOrdinal("CopiesAvailable")),
        //                        ImagePath = reader.GetString(reader.GetOrdinal("ImagePath")),

        //                    };
        //                }
        //                connection.Close();
        //            }
        //        }


        //        var deleteQuery = "DELETE FROM DVDs WHERE Id = @Id";
        //        using (var deleteCommand = new SqlCommand(deleteQuery, connection))
        //        {
        //            deleteCommand.Parameters.AddWithValue("@Id", id);

        //            connection.Open();
        //            await deleteCommand.ExecuteNonQueryAsync();
        //            connection.Close();
        //        }
        //    }
        //    return dvd;
        //}
    }
}
