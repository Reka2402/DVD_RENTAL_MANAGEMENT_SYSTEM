namespace DVD_Rental_Website.Entities
{
    public class Rent
    {
        public Guid RentalId { get; set; }
        public Guid CustomerID { get; set; }
        public Guid DVDId { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime? Returndate { get; set; }
        public bool Isoverdue { get; set; } = false;
        public string status { get; set; } = "Pending";
        public Customer Customer { get; set; }
        public DVD DVD { get; set; }

    }
}
