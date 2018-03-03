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
using System.Diagnostics;
using System.Linq;
using Modello.Classi;
using Modello.Servizi.Persistence.GeoQuery.InRettangolo;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class GetMezziInRettangolo_DB : IGetMezziInRettangolo
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetMezziInRettangolo_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public QueryInRettangoloResult Get(Rettangolo rettangolo, string[] classiMezzo, int attSec)
        {
            var geoWithinFilter = Builders<MessaggioPosizione>.Filter
                .GeoWithinBox(m => m.Localizzazione,
                    lowerLeftX: rettangolo.TopLeft.Lon,
                    lowerLeftY: rettangolo.BottomRight.Lat,
                    upperRightX: rettangolo.BottomRight.Lon,
                    upperRightY: rettangolo.TopLeft.Lat);

            var recentMessagesFilter = Builders<MessaggioPosizione>.Filter
                .Gt(m => m.IstanteAcquisizione, DateTime.UtcNow.AddSeconds(-attSec));

            FilterDefinition<MessaggioPosizione> classiMezzoFilter = null;

            if ((classiMezzo != null) && (classiMezzo.Length > 0))
            {
                classiMezzoFilter = Builders<MessaggioPosizione>.Filter
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
                .ReplaceRoot<MessaggioPosizione>("$messaggio")
                .ToEnumerable();

            var arrayMessaggiPosizione = messaggiPosizione.ToArray();
            sw.Stop();

            return new QueryInRettangoloResult()
            {
                IstanteQuery = DateTime.UtcNow,
                DurataQuery_msec = sw.ElapsedMilliseconds,
                ClassiMezzo = classiMezzo,
                NumeroMezzi = arrayMessaggiPosizione.Length,
                Rettangolo = rettangolo,
                Risultati = arrayMessaggiPosizione
            };
        }
    }
}
