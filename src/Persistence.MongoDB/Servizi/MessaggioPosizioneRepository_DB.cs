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
using System;
using System.Linq;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class MessaggioPosizioneRepository_DB : IMessaggioPosizioneRepository
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public MessaggioPosizioneRepository_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public MessaggioPosizione GetById(string id)
        {
            var dto = this.messaggiPosizioneCollection
                .Find(m => m.Id == id)
                .Single();

            return dto;
        }

        public void Store(MessaggioPosizione messaggioPosizione)
        {
            if (!string.IsNullOrWhiteSpace(messaggioPosizione.Id))
                throw new ArgumentException("Deve essere null", nameof(MessaggioPosizione.Id));

            messaggioPosizione.IstanteArchiviazione = DateTime.Now;
            this.messaggiPosizioneCollection.InsertOne(messaggioPosizione);
        }
    }
}
