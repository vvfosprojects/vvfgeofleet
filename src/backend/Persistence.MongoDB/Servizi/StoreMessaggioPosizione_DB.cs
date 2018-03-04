//-----------------------------------------------------------------------
// <copyright file="StoreMessaggioPosizione_DB.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class StoreMessaggioPosizione_DB : IStoreMessaggioPosizione
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public StoreMessaggioPosizione_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
        }

        public void Store(MessaggioPosizione messaggio)
        {
            if (!string.IsNullOrWhiteSpace(messaggio.Id))
                throw new ArgumentException("Deve essere null", nameof(MessaggioPosizione.Id));

            messaggio.IstanteArchiviazione = DateTime.UtcNow;
            messaggio.Ultimo = true;
            this.messaggiPosizioneCollection.InsertOne(messaggio);

            //Elimina il flag ultimo del vecchio ultimo messaggio per quel mezzo
            var filter = Builders<MessaggioPosizione>.Filter
                .And(
                    Builders<MessaggioPosizione>.Filter.Ne(m => m.Id, messaggio.Id),
                    Builders<MessaggioPosizione>.Filter.Eq(m => m.Ultimo, true),
                    Builders<MessaggioPosizione>.Filter.Eq(m => m.CodiceMezzo, messaggio.CodiceMezzo)
                );

            var update = Builders<MessaggioPosizione>.Update
                .Set(m => m.Ultimo, false);

            this.messaggiPosizioneCollection.UpdateMany(filter, update);
        }
    }
}
