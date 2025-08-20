using Asp.Versioning;
using Infrastructure.FindMinPath.Interfaces;
using Infrastructure.FindMinPath.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Versioning API
builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true;

    options.DefaultApiVersion = new ApiVersion(1, 0);

    options.ReportApiVersions = true;

    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
   builder.AllowAnyOrigin()
   .AllowAnyMethod()
   .AllowAnyHeader()
   .WithExposedHeaders("X-Pagination"));
});

builder.Services.AddDbContext<RepositoryContext>(opts =>
                     opts.UseSqlServer(builder.Configuration.GetConnectionString("sqlConnection"))
                        .LogTo(Console.WriteLine));

builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
