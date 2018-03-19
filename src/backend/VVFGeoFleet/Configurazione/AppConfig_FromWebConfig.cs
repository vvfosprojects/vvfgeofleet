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
using System;
using System.Configuration;
using Modello.Configurazione;

namespace VVFGeoFleet.Configurazione
{
    public class AppConfig_FromWebConfig : IAppConfig
    {
        public string connectionString = ConfigurationManager.ConnectionStrings["db"].ConnectionString;
        public int orizzonteTemporale_sec = Convert.ToInt32(ConfigurationManager.AppSettings["orizzonteTemporale_sec"]);
        public bool interpolationActive = Convert.ToBoolean(ConfigurationManager.AppSettings["interpolationActive"]);
        public float interpolationThreshold_mt = Convert.ToSingle(ConfigurationManager.AppSettings["interpolationThreshold_mt"]);
        public bool tooHighVelocityLoggingActive = Convert.ToBoolean(ConfigurationManager.AppSettings["tooHighVelocityLoggingActive"]);
        public int velocityThreshold_Kmh = Convert.ToInt32(ConfigurationManager.AppSettings["velocityThreshold_Kmh"]);

        public string ConnectionString { get => this.connectionString; }
        public int OrizzonteTemporale_sec { get => this.orizzonteTemporale_sec; }
        public bool InterpolationActive { get => this.interpolationActive; }
        public float InterpolationThreshold_mt { get => this.interpolationThreshold_mt; }
        public bool TooHighVelocityLoggingActive { get => this.tooHighVelocityLoggingActive; }
        public int VelocityThreshold_Kmh { get => this.velocityThreshold_Kmh; }
    }
}
