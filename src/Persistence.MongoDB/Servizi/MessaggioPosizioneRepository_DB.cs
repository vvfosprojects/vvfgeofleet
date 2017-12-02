//-----------------------------------------------------------------------
// <copyright file="MessaggioPosizioneRepository_DB.cs" company="CNVVF">
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
using Modello.Servizi.Persistence;
using MongoDB.Driver;
using Persistence.MongoDB.DTOs;
using System;
using System.Linq;

namespace Persistence.MongoDB.Servizi
{
    internal class MessaggioPosizioneRepository_DB : IMessaggioPosizioneRepository
    {
        private readonly IMongoCollection<MessaggioPosizione_DTO> messaggiPosizioneCollection;

        public MessaggioPosizioneRepository_DB(IMongoCollection<MessaggioPosizione_DTO> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public MessaggioPosizione GetById(string id)
        {
            var dto = this.messaggiPosizioneCollection
                .Find(m => m.Id == id)
                .Single();

            return dto.ConvertToDomain();
        }

        public void Store(MessaggioPosizione messaggioPosizione)
        {
            if (!string.IsNullOrWhiteSpace(messaggioPosizione.Id))
                throw new ArgumentException("Non può essere null", nameof(MessaggioPosizione.Id));

            messaggioPosizione.IstanteArchiviazione = DateTime.Now;
            var dto = Mapper.Map<MessaggioPosizione_DTO>(messaggioPosizione);
            this.messaggiPosizioneCollection.InsertOne(dto);
            messaggioPosizione.Id = dto.Id;
        }
    }
}
