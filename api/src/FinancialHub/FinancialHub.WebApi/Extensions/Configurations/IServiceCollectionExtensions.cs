﻿using FinancialHub.Domain.Interfaces.Repositories;
using FinancialHub.Domain.Interfaces.Services;
using FinancialHub.Services.Services;
using FinancialHub.Infra.Data.Repositories;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using FinancialHub.Domain.Interfaces.Mappers;
using FinancialHub.Services.Mappers;
using FinancialHub.Domain.Mappers;

namespace FinancialHub.WebApi.Extensions.Configurations
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddApiConfigurations(this IServiceCollection services)
        {
            services.AddControllers();
            services.AddApiVersioning(config =>
            {
                config.DefaultApiVersion = new ApiVersion(1, 0);
                config.AssumeDefaultVersionWhenUnspecified = true;
                config.ReportApiVersions = true;
            });
            return services;
        }
        //TODO: find a better method organization
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IAccountsRepository, AccountsRepository>();
            services.AddScoped<ICategoriesRepository, CategoriesRepository>();
            services.AddScoped<ITransactionsRepository, TransactionsRepository>();
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(FinancialHubAutoMapperProfile));
            services.AddScoped<IMapperWrapper, FinancialHubMapperWrapper>();

            services.AddScoped<IAccountsService, AccountsService>();
            services.AddScoped<ICategoriesService, CategoriesService>();
            services.AddScoped<ITransactionsService, TransactionsService>();
            return services;
        }
    }
}
