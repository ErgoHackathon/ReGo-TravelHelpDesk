// Program.cs

using DataTravelManagement.Context;

using DataTravelManagement.Data;

using Microsoft.EntityFrameworkCore;

using ServicesTravelManagement.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<RollMasterContext>(options =>

    options.UseSqlServer(connectionString));

builder.Services.AddDbContext<LoginMasterContext>(options =>

    options.UseSqlServer(connectionString));

builder.Services.AddDbContext<EmployeeMasterContext>(options =>

    options.UseSqlServer(connectionString));

builder.Services.AddDbContext<TravelMasterContext>(options =>

    options.UseSqlServer(connectionString));

builder.Services.AddDbContext<DocumentMasterContext>(options =>

    options.UseSqlServer(connectionString));

builder.Services.AddDbContext<EmployeeDocumentContext>(options =>

    options.UseSqlServer(connectionString));


builder.Services.AddScoped<RollMasterData>();

builder.Services.AddScoped<LoginMasterData>();

builder.Services.AddScoped<EmployeeMasterData>();

builder.Services.AddScoped<TravelMasterData>();

builder.Services.AddScoped<DocumentMasterData>();

builder.Services.AddScoped<EmployeeDocumentData>();

builder.Services.AddScoped<DashboardData>();


builder.Services.AddScoped<Service>();


// ? FIXED CORS Configuration

builder.Services.AddCors(options =>

{

    options.AddPolicy("AllowFrontend",

        policy => policy

            .WithOrigins(

                "http://localhost:3000",    // React dev server

                "http://localhost:5173",    // Vite dev server (if needed)

                "https://localhost:3000"    // HTTPS version

            )

            .AllowAnyHeader()

            .AllowAnyMethod()

            .AllowCredentials());  // Add this if you're using cookies/credentials

});


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())

{

    app.UseSwagger();

    app.UseSwaggerUI();

}

// ? CORS must be called BEFORE UseHttpsRedirection and UseAuthorization

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
