﻿using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(VVFGeoFleet.Startup))]

namespace VVFGeoFleet
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR<DatiPosizioneLive>("/PosizioneLive");
        }
    }
}