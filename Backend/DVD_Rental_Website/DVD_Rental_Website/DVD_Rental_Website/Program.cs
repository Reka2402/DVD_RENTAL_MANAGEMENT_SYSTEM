
using DVD_Rental_Website.IRepository;
using DVD_Rental_Website.IService;
using DVD_Rental_Website.Repository;
using DVD_Rental_Website.Service;

namespace DVD_Rental_Website
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.WebHost.UseWebRoot("wwwroot");
            builder.Services.AddControllers();
            
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();




            var connectionString = builder.Configuration.GetConnectionString("DBconnection");

            builder.Services.AddScoped<ICustomerRepository>(provider => new CustomerRepository(connectionString));
            builder.Services.AddScoped<ICustomerService, CustomerServie>();

            builder.Services.AddScoped<IManagerRepository>(provider => new ManagerRepository(connectionString));
            builder.Services.AddScoped<IManagerService, ManagerService>();

            builder.Services.AddScoped<IRentalRepository>(provider => new RentalRepository(connectionString));
            builder.Services.AddScoped<IRentalService, RentalService>();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });









            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors();

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
