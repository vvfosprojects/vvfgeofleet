//-----------------------------------------------------------------------
// <copyright file="AppConfig_FromWebConfig.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of VVFGeoFleet.
// VVFGeoFleet is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
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
