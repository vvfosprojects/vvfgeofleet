//-----------------------------------------------------------------------
// <copyright file="IAppConfig.cs" company="CNVVF">
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

namespace Modello.Configurazione
{
    public interface IAppConfig
    {
        string ConnectionString { get; }
        string DatabaseName { get; }
        int OrizzonteTemporale_sec { get; }

        #region Interpolation data

        bool InterpolationActive { get; }
        float InterpolationThreshold_mt { get; }

        #endregion Interpolation data

        #region Too high velocity logging

        bool TooHighVelocityLoggingActive { get; }
        int VelocityThreshold_Kmh { get; }

        #endregion Too high velocity logging

        #region vechicle Locking

        int NumberOfRetries { get; }
        int RetriesInterval_msec { get; }

        #endregion vechicle Locking

        #region ip based authorization

        bool IpAuthEnabled { get; }
        string[] AuthorizedIpSources { get; }

        #endregion ip based authorization
    }
}
