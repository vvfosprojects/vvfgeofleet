//-----------------------------------------------------------------------
// <copyright file="MessaggioPosizione.cs" company="CNVVF">
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

namespace Modello.Classi
{
    public class MessaggioPosizione
    {
        public string Id { get; set; }

        public string CodiceMezzo { get; set; }
        public string[] ClassiMezzo { get; set; }
        public Localizzazione Localizzazione { get; set; }
        public DateTime IstanteAcquisizione { get; set; }
        public Fonte Fonte { get; set; }
        public InfoFonte InfoFonte { get; set; }
        public InfoSO115 InfoSO115 { get; set; }

        public DateTime IstanteArchiviazione { get; set; }
        public bool Ultimo { get; set; }
    }
}
