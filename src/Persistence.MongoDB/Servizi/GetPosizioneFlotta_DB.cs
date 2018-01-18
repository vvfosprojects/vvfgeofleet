//-----------------------------------------------------------------------
// <copyright file="GetPosizioneFlotta_DB.cs" company="CNVVF">
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
    internal class GetPosizioneFlotta_DB : IGetPosizioneFlotta
    {
        private readonly IMongoCollection<MessaggioPosizione_DTO> messaggiPosizione;

        public GetPosizioneFlotta_DB(IMongoCollection<MessaggioPosizione_DTO> messaggiPosizione)
        {
            this.messaggiPosizione = messaggiPosizione;
        }

        public IEnumerable<MessaggioPosizione> Get()
        {
            return this.Get(null);
        }

        /// <summary>
        ///   Restituisce la posizione dei mezzi per i quali c'è un messaggio di posizione giunto
        ///   nelle ultime 24 ore.
        /// </summary>
        /// <param name="classiMezzo"></param>
        /// <returns></returns>
        public IEnumerable<MessaggioPosizione> Get(string[] classiMezzo)
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
                .Match(m => m.IstanteAcquisizione > DateTime.Now.AddHours(-24))
                .Group(BsonDocument.Parse(@"{ _id: '$codiceMezzo', messaggio: { $first: '$$ROOT' } }"))
                .ReplaceRoot<MessaggioPosizione_DTO>("$messaggio");

            var resultSet = query2
                .ToEnumerable()
                .Select(dto => dto.ConvertToDomain());

            return resultSet;
        }
    }
}
