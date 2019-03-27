//-----------------------------------------------------------------------
// <copyright file="PositionMessageStorage.cs" company="CNVVF">
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
using MongoDB.Driver;
using NUnit.Framework;
using Persistence.MongoDB;
using Persistence.MongoDB.Servizi;

namespace VVFGeoFleet.IntegrationTest
{
    [TestFixture]
    public class PositionMessageStorage
    {
        private DbContext dbContext;
        private const string dbName = "VVFGeoFleet_TestDB";

        [OneTimeSetUp]
        public void OneTimeSetup()
        {
            dbContext = new DbContext("mongodb://localhost:27017/" + dbName);
        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            dbContext.MessaggiPosizioneCollection.Database.Client.DropDatabase(dbName);
        }

        [TearDown]
        public void TearDown()
        {
            this.dbContext.MessaggiPosizioneCollection.DeleteMany(m => true);
        }

        [Test]
        [Repeat(5)]
        public void ASingleMessagesIsStored()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);

            var msg1 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow,
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            storeMessaggioPosizione.Store(msg1);

            var storedMsgs = dbContext.MessaggiPosizioneCollection
                .Find(m => m.CodiceMezzo == "Test")
                .ToList();

            Assert.Multiple(() =>
            {
                Assert.That(storedMsgs.Count, Is.EqualTo(1));
                Assert.That(storedMsgs[0].Id, Is.EqualTo(msg1.Id));
                Assert.That(storedMsgs[0].Ultimo, Is.True);
            });
        }

        [Test]
        [Repeat(5)]
        public void TwoConsecutiveMessagesAreStored()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);

            var msg1 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-1),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            var msg2 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow,
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            storeMessaggioPosizione.Store(msg1);
            storeMessaggioPosizione.Store(msg2);

            var storedMsgs = dbContext.MessaggiPosizioneCollection
                .Find(m => m.CodiceMezzo == "Test")
                .ToList();

            Assert.Multiple(() =>
            {
                Assert.That(storedMsgs.Count, Is.EqualTo(2));
                Assert.That(storedMsgs.Single(m => m.Id == msg1.Id).Ultimo, Is.False);
                Assert.That(storedMsgs.Single(m => m.Id == msg2.Id).Ultimo, Is.True);
            });
        }

        [Test]
        [Repeat(5)]
        public void AnOlderReceivedMessageIsNotMarkedAsLast()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);

            var msg1 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow,
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            var msg2 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-1),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            storeMessaggioPosizione.Store(msg1);
            storeMessaggioPosizione.Store(msg2);

            var storedMsgs = dbContext.MessaggiPosizioneCollection
                .Find(m => m.CodiceMezzo == "Test")
                .ToList();

            Assert.Multiple(() =>
            {
                Assert.That(storedMsgs.Count, Is.EqualTo(2));
                Assert.That(storedMsgs.Single(m => m.Id == msg1.Id).Ultimo, Is.True);
                Assert.That(storedMsgs.Single(m => m.Id == msg2.Id).Ultimo, Is.False);
            });
        }

        [Test]
        [Repeat(5)]
        public void StoringMessageFixesAnomalousPresenceOfMoreLastMessages()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);

            var msg1 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-2),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
                Ultimo = true
            };

            var msg2 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-1),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
                Ultimo = true
            };

            dbContext.MessaggiPosizioneCollection.InsertMany(new[] { msg1, msg2 });

            var msg3 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow,
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
                Ultimo = true
            };

            storeMessaggioPosizione.Store(msg3);

            var storedMsgs = dbContext.MessaggiPosizioneCollection
                .Find(m => m.CodiceMezzo == "Test")
                .ToList();

            Assert.Multiple(() =>
            {
                Assert.That(storedMsgs.Count, Is.EqualTo(3));
                Assert.That(storedMsgs.Single(m => m.Id == msg1.Id).Ultimo, Is.False);
                Assert.That(storedMsgs.Single(m => m.Id == msg2.Id).Ultimo, Is.False);
                Assert.That(storedMsgs.Single(m => m.Id == msg3.Id).Ultimo, Is.True);
            });
        }

        [Test]
        [Repeat(5)]
        public void StoringMessageWithNonNullIdRaisesException()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);

            var msg = new MessaggioPosizione()
            {
                Id = "ABCD",
                CodiceMezzo = "Test"
            };

            Assert.Throws<ArgumentException>(() =>
            {
                storeMessaggioPosizione.Store(msg);
            });
        }

        [Test]
        [Repeat(5)]
        public void TheSecondOfThreeCloseMessagesIsInterpolated()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);
            var interpolationDecorator = new StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator(storeMessaggioPosizione, dbContext.MessaggiPosizioneCollection);
            interpolationDecorator.InterpolationThreshold_mt = 100;

            var msg1 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-2),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            var msgTime = DateTime.UtcNow.AddMinutes(-1);
            var msg2 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = msgTime,
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            var msg3 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(0),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            interpolationDecorator.Store(msg1);
            interpolationDecorator.Store(msg2);
            interpolationDecorator.Store(msg3);

            var storedMsgs = dbContext.MessaggiPosizioneCollection
                .Find(m => m.CodiceMezzo == "Test")
                .ToList();

            Assert.Multiple(() =>
            {
                Assert.That(storedMsgs.Count, Is.EqualTo(2));

                Assert.That(storedMsgs.Single(m => m.Id == msg1.Id).InterpolationData, Is.Null);

                Assert.That(storedMsgs.Single(m => m.Id == msg3.Id).InterpolationData.Messages, Is.EqualTo(1));
                Assert.That(storedMsgs.Single(m => m.Id == msg3.Id).InterpolationData.Length_sec, Is.EqualTo(60));
                Assert.That(storedMsgs.Single(m => m.Id == msg3.Id).InterpolationData.LastMsgTime.Value.Subtract(msgTime).TotalMilliseconds, Is.LessThan(10));
            });
        }

        [Test]
        [Repeat(5)]
        public void WhenFirstMessagesIsNotSoCloseMessagesAreNotInterpolated()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);
            var interpolationDecorator = new StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator(storeMessaggioPosizione, dbContext.MessaggiPosizioneCollection);
            interpolationDecorator.InterpolationThreshold_mt = 10;

            var msg1 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-2),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            var msg2 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-1),
                Localizzazione = new Localizzazione { Lat = 1.00015, Lon = 1 },
            };

            var msg3 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(0),
                Localizzazione = new Localizzazione { Lat = 1.00015, Lon = 1 }, //few more than 10 mt
            };

            interpolationDecorator.Store(msg1);
            interpolationDecorator.Store(msg2);
            interpolationDecorator.Store(msg3);

            var storedMsgs = dbContext.MessaggiPosizioneCollection
                .Find(m => m.CodiceMezzo == "Test")
                .ToList();

            Assert.Multiple(() =>
            {
                Assert.That(storedMsgs.Count, Is.EqualTo(3));
                Assert.That(storedMsgs.Single(m => m.Id == msg1.Id).InterpolationData, Is.Null);
                Assert.That(storedMsgs.Single(m => m.Id == msg2.Id).InterpolationData, Is.Null);
                Assert.That(storedMsgs.Single(m => m.Id == msg3.Id).InterpolationData, Is.Null);
            });
        }

        [Test]
        [Repeat(5)]
        public void WhenSecondMessagesIsNotSoCloseMessagesAreNotInterpolated()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);
            var interpolationDecorator = new StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator(storeMessaggioPosizione, dbContext.MessaggiPosizioneCollection);
            interpolationDecorator.InterpolationThreshold_mt = 10;

            var msg1 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-2),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            var msg2 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-1),
                Localizzazione = new Localizzazione { Lat = 1.00015, Lon = 1 },
            };

            var msg3 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(0),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 }, //few more than 10 mt
            };

            interpolationDecorator.Store(msg1);
            interpolationDecorator.Store(msg2);
            interpolationDecorator.Store(msg3);

            var storedMsgs = dbContext.MessaggiPosizioneCollection
                .Find(m => m.CodiceMezzo == "Test")
                .ToList();

            Assert.Multiple(() =>
            {
                Assert.That(storedMsgs.Count, Is.EqualTo(3));
                Assert.That(storedMsgs.Single(m => m.Id == msg1.Id).InterpolationData, Is.Null);
                Assert.That(storedMsgs.Single(m => m.Id == msg2.Id).InterpolationData, Is.Null);
                Assert.That(storedMsgs.Single(m => m.Id == msg3.Id).InterpolationData, Is.Null);
            });
        }

        [Test]
        [Repeat(5)]
        public void WhenThirdMessagesIsNotSoCloseMessagesAreNotInterpolated()
        {
            var storeMessaggioPosizione = new StoreMessaggioPosizione_DB(dbContext.MessaggiPosizioneCollection);
            var interpolationDecorator = new StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator(storeMessaggioPosizione, dbContext.MessaggiPosizioneCollection);
            interpolationDecorator.InterpolationThreshold_mt = 10;

            var msg1 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-2),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            var msg2 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(-1),
                Localizzazione = new Localizzazione { Lat = 1, Lon = 1 },
            };

            var msg3 = new MessaggioPosizione()
            {
                CodiceMezzo = "Test",
                IstanteAcquisizione = DateTime.UtcNow.AddMinutes(0),
                Localizzazione = new Localizzazione { Lat = 1.00015, Lon = 1 }, //few more than 10 mt
            };

            interpolationDecorator.Store(msg1);
            interpolationDecorator.Store(msg2);
            interpolationDecorator.Store(msg3);

            var storedMsgs = dbContext.MessaggiPosizioneCollection
                .Find(m => m.CodiceMezzo == "Test")
                .ToList();

            Assert.Multiple(() =>
            {
                Assert.That(storedMsgs.Count, Is.EqualTo(3));
                Assert.That(storedMsgs.Single(m => m.Id == msg1.Id).InterpolationData, Is.Null);
                Assert.That(storedMsgs.Single(m => m.Id == msg2.Id).InterpolationData, Is.Null);
                Assert.That(storedMsgs.Single(m => m.Id == msg3.Id).InterpolationData, Is.Null);
            });
        }
    }
}
