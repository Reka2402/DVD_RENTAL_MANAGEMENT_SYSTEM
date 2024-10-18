using DVD_Rental_Website.Entities;

namespace DVD_Rental_Website.IRepository
{
    public interface IManagerRepository
    {
        Task<DVD> AddDVD(DVD newDVD);
        Task<DVD> GetDVDById(Guid Id);

        Task<List<DVD>> GetAllDVDs();

        Task<DVD> UpdateDVD(DVD updatedDVD);

        Task<DVD> DeleteDVD(DVD DVDToDelete);
    }
}
