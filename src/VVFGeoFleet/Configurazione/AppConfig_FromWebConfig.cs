using Modello.Configurazione;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace VVFGeoFleet.Configurazione
{
    public class AppConfig_FromWebConfig : IAppConfig
    {
        public string connectionString = ConfigurationManager.ConnectionStrings["db"].ConnectionString;
        public int orizzonteTemporale_sec = Convert.ToInt32(ConfigurationManager.AppSettings["orizzonteTemporale_sec"]);

        public string ConnectionString { get => this.connectionString; }
        public int OrizzonteTemporale_sec { get => this.orizzonteTemporale_sec; }
    }
}
