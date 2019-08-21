//-----------------------------------------------------------------------
// <copyright file="StoreMessaggioPosizione_VehicleLock_Decorator.cs" company="CNVVF">
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
using System.Threading;
using log4net;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;
using Persistence.MongoDB.Classes;

namespace Persistence.MongoDB.Servizi
{
    /// <summary>
    ///   Performs a pessimistic lock on vehicleCode on position message insertion. This prevents
    ///   race conditions on simultaneous insertion of position messages for the same vehicle (which
    ///   is unlike but possible).
    /// </summary>
    internal class StoreMessaggioPosizione_VehicleLock_Decorator : IStoreMessaggioPosizione
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private static readonly Random rnd = new Random();

        private readonly IStoreMessaggioPosizione decorated;
        private readonly IMongoCollection<VehicleLock> vehicleLocksCollection;

        public StoreMessaggioPosizione_VehicleLock_Decorator(
            IStoreMessaggioPosizione decorated,
            IMongoCollection<VehicleLock> vehicleLocksCollection)
        {
            this.decorated = decorated ?? throw new ArgumentNullException(nameof(decorated));
            this.vehicleLocksCollection = vehicleLocksCollection ?? throw new ArgumentNullException(nameof(vehicleLocksCollection));
        }

        /// <summary>
        ///   Number of attempts to acquire the lock, after which the insertion gives up.
        /// </summary>
        public int NumberOfRetries { get; set; }

        /// <summary>
        ///   Interval between attempts to acquire lock
        /// </summary>
        public int RetriesInterval_msec { get; set; }

        public void Store(MessaggioPosizione newMessage)
        {
            var vehicleCode = newMessage.CodiceMezzo;

            acquireLock(vehicleCode);

            try
            {
                // inserts the positione message
                this.decorated.Store(newMessage);
            }
            finally
            {
                releaseLock(vehicleCode);
            }
        }

        private void releaseLock(string vehicleCode)
        {
            this.vehicleLocksCollection.DeleteOne(doc => doc.VehicleCode == vehicleCode);
        }

        private void acquireLock(string vehicleCode)
        {
            var lockDoc = new VehicleLock(vehicleCode);

            var lockAcquired = false;
            var attempts = 0;

            while (!lockAcquired && attempts < this.NumberOfRetries)
            {
                try
                {
                    this.vehicleLocksCollection.InsertOne(lockDoc);
                    lockAcquired = true;
                }
                catch
                {
                    attempts++;

                    // compute some jitter in order to prevent thread synchronization
                    int retryInterval = computeRetryIntervalWithJitter(this.RetriesInterval_msec);

                    if (attempts < this.NumberOfRetries)
                    {
                        log.Info($"Cannot acquire lock for vehicle { vehicleCode }. Attempt #{ attempts } of { this.NumberOfRetries }. Waiting for { retryInterval } before retry.");
                    }
                    else
                    {
                        log.Error($"Cannot acquire lock for vehicle { vehicleCode }. Giving up on insertion after { this.NumberOfRetries } attempts.");
                        throw;
                    }

                    Thread.Sleep(retryInterval);
                }
            }
        }

        /// <summary>
        ///   Computes retry interval adding a random jitter in order to prevent thread synchronization.
        /// </summary>
        /// <param name="retriesInterval_msec">The deterministic interval</param>
        /// <returns>The interval with added jitter</returns>
        private int computeRetryIntervalWithJitter(int retriesInterval_msec)
        {
            int oneTenth = retriesInterval_msec / 10;
            oneTenth = oneTenth > 0 ? oneTenth : 1;
            var retryJitter = rnd.Next(2 * oneTenth);
            return retriesInterval_msec - oneTenth + retryJitter;
        }
    }
}
