using System.ComponentModel.DataAnnotations;

namespace DVD_Rental_Website.Entities
{
    public class Customer
    {
        [Key]
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Mobilenumber { get; set; }
        public string Email { get; set; }
        public int Nic { get; set; }
        public string Password { get; set; }
        public ICollection<Rent> Rentals { get; set; }
        public bool IsActive { get; set; } = true;




    }
}
