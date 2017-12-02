//-----------------------------------------------------------------------
// <copyright file="MessaggioPosizione_DTO.cs" company="CNVVF">
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
using AutoMapper;
using Modello.Classi;
using System;

namespace Persistence.MongoDB.DTOs
{
    internal class MessaggioPosizione_DTO
    {
        public string Id { get; internal set; }

        public string CodiceMezzo { get; set; }
        public string[] ClassiMezzo { get; set; }
        public Localizzazione_DTO Localizzazione { get; set; }
        public DateTime IstanteAcquisizione { get; set; }
        public Fonte_DTO Fonte { get; set; }
        public InfoFonte_DTO InfoFonte { get; set; }
        public InfoSO115_DTO InfoSO115 { get; set; }

        public DateTime IstanteArchiviazione { get; set; }

        public static MessaggioPosizione_DTO CreateFromDomain(MessaggioPosizione messaggioPosizione)
        {
            return Mapper.Map<MessaggioPosizione_DTO>(messaggioPosizione);
        }

        public MessaggioPosizione ConvertToDomain()
        {
            return Mapper.Map<MessaggioPosizione>(this);
        }
    }
}
