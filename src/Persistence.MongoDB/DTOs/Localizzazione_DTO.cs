//-----------------------------------------------------------------------
// <copyright file="Localizzazione_DTO.cs" company="CNVVF">
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
using Modello.Classi;

namespace Persistence.MongoDB.DTOs
{
    internal class Localizzazione_DTO
    {
        public Localizzazione_DTO(Localizzazione localizzazione)
        {
            this.Coordinates = new[] { localizzazione.Lon, localizzazione.Lat };
        }

        public string Type { get { return "Point"; } protected set { } }
        public double[] Coordinates { get; protected set; }
    }
}
