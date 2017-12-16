//-----------------------------------------------------------------------
// <copyright file="GetMezziSilenti_DB.cs" company="CNVVF">
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
using Modello.Servizi.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using Persistence.MongoDB.DTOs;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace Persistence.MongoDB.Servizi
{
    internal class GetMezziSilenti_DB : IGetMezziSilenti
    {
        private readonly IMongoCollection<MessaggioPosizione_DTO> messaggiPosizione;

        public GetMezziSilenti_DB(IMongoCollection<MessaggioPosizione_DTO> messaggiPosizione)
        {
            this.messaggiPosizione = messaggiPosizione;
        }

        /// <summary>
        ///   Restituisce la posizione dei mezzi per i quali non c'è un messaggio sufficientemente recente
        /// </summary>
        /// <param name="daSecondi">Numero di secondi entro i quali non è presente un messaggio</param>
        /// <returns>Messaggi posizione meno recenti</returns>
        public IEnumerable<MessaggioPosizione> Get(int daSecondi)
        {
            return this.Get(daSecondi, classiMezzo: null);
        }

        /// <summary>
        ///   Restituisce la posizione dei mezzi per i quali non c'è un messaggio sufficientemente recente
        /// </summary>
        /// <param name="daSecondi">Numero di secondi entro i quali non è presente un messaggio</param>
        /// <param name="classiMezzo">Le classi mezzo da filtrare</param>
        /// <returns>Messaggi posizione meno recenti</returns>
        public IEnumerable<MessaggioPosizione> Get(int daSecondi, string[] classiMezzo)
        {
            IAggregateFluent<MessaggioPosizione_DTO> query = this.messaggiPosizione.Aggregate<MessaggioPosizione_DTO>()
                .SortBy(m => m.CodiceMezzo)
                .ThenByDescending(m => m.IstanteAcquisizione);

            if (classiMezzo != null && classiMezzo.Length > 0)
            {
                var filter = Builders<MessaggioPosizione_DTO>
                    .Filter
                    .AnyIn(m => m.ClassiMezzo, classiMezzo);

                query = query
                    .Match(filter);
            }

            var query2 = query
                .Group(BsonDocument.Parse(@"{ _id: '$codiceMezzo', messaggio: { $first: '$$ROOT' } }"))
                .Match(new BsonDocument {
                    {
                        "messaggio.istanteAcquisizione", new BsonDocument {
                        {
                                "$lt", DateTime.Now.AddSeconds(-daSecondi)
                        }
                        }
                    }
                })
                .Project(BsonDocument.Parse(@"{ _id: 0, messaggio: 1 }"));

            var resultSet = query2
                .ToEnumerable()
                .Select(d => BsonSerializer.Deserialize<MessaggioPosizione_DTO>(d["messaggio"].AsBsonDocument))
                .Select(dto => dto.ConvertToDomain());

            return resultSet;
        }
    }
}
