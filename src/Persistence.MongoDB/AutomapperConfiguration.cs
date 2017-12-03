//-----------------------------------------------------------------------
// <copyright file="AutomapperConfiguration.cs" company="CNVVF">
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
using Persistence.MongoDB.DTOs;

namespace Persistence.MongoDB
{
    internal static class AutomapperConfiguration
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Modello.Classi.MessaggioPosizione, DTOs.MessaggioPosizione_DTO>()
                    .ForMember(dto => dto.Localizzazione, opt => opt.MapFrom(src => new Localizzazione_DTO(src.Localizzazione)));

                cfg.CreateMap<DTOs.MessaggioPosizione_DTO, Modello.Classi.MessaggioPosizione>()
                    .ForMember(dto => dto.Localizzazione, opt => opt.MapFrom(
                        src => new Localizzazione()
                        {
                            Lon = src.Localizzazione.Coordinates[0],
                            Lat = src.Localizzazione.Coordinates[1]
                        }));
            });

            Mapper.AssertConfigurationIsValid();
        }
    }
}
