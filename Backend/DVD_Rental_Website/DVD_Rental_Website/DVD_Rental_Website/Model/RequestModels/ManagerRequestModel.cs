namespace DVD_Rental_Website.Model.RequestModels
{
    public class ManagerRequestModel
    {
        public string Title { get; set; }
        public string Director { get; set; }
        public string Genre { get; set; }
        public DateTime ReleaseDate { get; set; }
        public int CopiesAvailable { get; set; }
        public IFormFile ImageFile { get; set; }
    }
}
