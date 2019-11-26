using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleInjector;
using Logging;

namespace RockApi
{
    public class Startup
    {
        private Container container = new Container();

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Latest);

            services.AddLogging();
            services.AddLocalization(options => options.ResourcesPath = "Resources");

            IntegrateSimpleInjector(services);
        }

        private void IntegrateSimpleInjector(IServiceCollection services)
        {
            services.AddSimpleInjector(container, options =>
            {
                options.AddAspNetCore()
                    .AddControllerActivation()
                    .AddViewComponentActivation()
                    .AddPageModelActivation()
                    .AddTagHelperActivation();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            LogConfigurator.Configure();

            app.UseSimpleInjector(container, options =>
            {
#warning Add custom Simple Injector-created middleware to the ASP.NET pipeline.
                //options.UseMiddleware<CustomMiddleware1>(app);
                //options.UseMiddleware<CustomMiddleware2>(app);
            });

            InitializeContainer();

            // Always verify the container
            container.Verify();

            // Add custom middleware
            //app.UseMiddleware<CustomMiddleware1>(container);
            //app.UseMiddleware<CustomMiddleware2>(container);

            container.Verify();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();
        }

        private void InitializeContainer()
        {
            CompositionRoot.RootBindings.Bind(container);
        }
    }
}