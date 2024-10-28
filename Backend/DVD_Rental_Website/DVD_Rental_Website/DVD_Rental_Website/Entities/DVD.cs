using System.ComponentModel.DataAnnotations;

namespace DVD_Rental_Website.Entities
{
    public class DVD
    {
       
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Director { get; set; }
        public string Genre { get; set; }
        public DateTime ReleaseDate { get; set; }
        public int CopiesAvailable { get; set; }
    }
}
