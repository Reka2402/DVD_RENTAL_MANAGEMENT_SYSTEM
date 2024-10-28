namespace DVD_Rental_Website.Model.Response_Models
{
    public class RentalResponseModel
    {
    
        public Guid RentalId { get; set; }
        public Guid CustomerID { get; set; }
        public Guid DVDId { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime? Returndate { get; set; }
        public bool Isoverdue { get; set; } = false;
        public string status { get; set; } = "Pending";
    }
}
