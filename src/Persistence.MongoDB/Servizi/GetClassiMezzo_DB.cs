//-----------------------------------------------------------------------
// <copyright file="GetClassiMezzo_DB.cs" company="CNVVF">
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
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class GetClassiMezzo_DB : IGetClassiMezzo
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetClassiMezzo_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection;
        }

        public IDictionary<string, long> Get(int activeWithinSeconds)
        {
            var classiMezzo = this.messaggiPosizioneCollection.Aggregate()
                .SortBy(m => m.CodiceMezzo)
                .ThenByDescending(m => m.IstanteAcquisizione)
                .Match(m => m.IstanteAcquisizione > DateTime.UtcNow.AddSeconds(-activeWithinSeconds))
                .Group(new BsonDocument { { "_id", "$codiceMezzo" }, { "lastMsg", new BsonDocument { { "$first", "$$ROOT" } } } })
                .Unwind("lastMsg.classiMezzo")
                .SortByCount<string>("$lastMsg.classiMezzo")
                .ToList();

            return classiMezzo.ToDictionary(k => k.Id, v => v.Count);
        }
    }
}
