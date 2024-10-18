namespace DVD_Rental_Website.Model.Response_Models
{
    public class ManagerResponseModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Genre { get; set; }
        public string Director { get; set; }
        public DateTime ReleaseDate { get; set; }
        public int CopiesAvailable { get; set; }
        public string ImageUrl { get; set; }
        public bool IsAvailable { get; set; } = true;
    }
}
