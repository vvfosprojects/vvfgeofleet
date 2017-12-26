//-----------------------------------------------------------------------
// <copyright file="GetMezziInRettangolo_DB.cs" company="CNVVF">
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
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi;
using Modello.Servizi.Persistence.GeoQuery.InRettangolo;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Persistence.MongoDB.DTOs;

namespace Persistence.MongoDB.Servizi
{
    internal class GetMezziInRettangolo_DB : IGetMezziInRettangolo
    {
        private readonly IMongoCollection<MessaggioPosizione_DTO> messaggiPosizioneCollection;

        public GetMezziInRettangolo_DB(IMongoCollection<MessaggioPosizione_DTO> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public QueryInRettangoloResult Get(Rettangolo rettangolo, string[] classiMezzo)
        {
            var geoWithinFilter = Builders<MessaggioPosizione_DTO>.Filter
                .GeoWithinBox(m => m.Localizzazione,
                    lowerLeftX: rettangolo.TopLeft.Lon,
                    lowerLeftY: rettangolo.BottomRight.Lat,
                    upperRightX: rettangolo.BottomRight.Lon,
                    upperRightY: rettangolo.TopLeft.Lat);

            var recentMessagesFilter = Builders<MessaggioPosizione_DTO>.Filter
                .Gt(m => m.IstanteAcquisizione, DateTime.Now.AddHours(-24));

            FilterDefinition<MessaggioPosizione_DTO> classiMezzoFilter = null;

            if ((classiMezzo != null) && (classiMezzo.Length > 0))
            {
                classiMezzoFilter = Builders<MessaggioPosizione_DTO>.Filter
                    .AnyIn(m => m.ClassiMezzo, classiMezzo);
            }

            var messaggiPosizioneAggregate = this.messaggiPosizioneCollection.Aggregate()
                .SortBy(m => m.CodiceMezzo)
                .ThenByDescending(m => m.IstanteAcquisizione)
                .Match(geoWithinFilter)
                .Match(recentMessagesFilter);

            if (classiMezzoFilter != null)
                messaggiPosizioneAggregate = messaggiPosizioneAggregate
                    .Match(classiMezzoFilter);

            var sw = new Stopwatch();
            sw.Start();

            var messaggiPosizione = messaggiPosizioneAggregate
                .Group(BsonDocument.Parse(@"{ _id: '$codiceMezzo', messaggio: { $first: '$$ROOT' } }"))
                .Project(BsonDocument.Parse(@"{ _id: 0, messaggio: 1 }"))
                .ToEnumerable()
                .Select(d => BsonSerializer.Deserialize<MessaggioPosizione_DTO>(d["messaggio"].AsBsonDocument))
                .Select(dto => dto.ConvertToDomain());

            var arrayMessaggiPosizione = messaggiPosizione.ToArray();
            sw.Stop();

            return new QueryInRettangoloResult()
            {
                IstanteQuery = DateTime.Now.ToUniversalTime(),
                DurataQuery_msec = sw.ElapsedMilliseconds,
                ClassiMezzo = classiMezzo,
                NumeroMezzi = arrayMessaggiPosizione.Length,
                Rettangolo = rettangolo,
                Risultati = arrayMessaggiPosizione
            };
        }
    }
}
