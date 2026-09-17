using System.Reflection;
using System.Text.Json.Serialization;
using Banking.Api.ErrorHandling;
using Banking.Application;
using Banking.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var problemDetails = new ValidationProblemDetails(context.ModelState)
        {
            Type = "https://datatracker.ietf.org/doc/html/rfc9110#name-400-bad-request",
            Title = "Solicitud inválida",
            Status = StatusCodes.Status400BadRequest,
            Detail = "Uno o más datos de la solicitud no son válidos."
        };

        return new BadRequestObjectResult(problemDetails);
    };
});

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Digital Banking Technical Assessment — LAFISE Nicaragua",
        Version = "v1",
        Description = "API de la solución técnica para gestión básica de clientes, cuentas y movimientos bancarios."
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFile));
});

var app = builder.Build();

app.UseExceptionHandler();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Banking API v1");
    options.DocumentTitle = "Digital Banking API";
});

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

public partial class Program;

