//-----------------------------------------------------------------------
// <copyright file="InterpolationData.cs" company="CNVVF">
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

namespace Modello.Classi
{
    public class InterpolationData
    {
        public InterpolationData(int length_sec, int messages, DateTime? lastMsgTime)
        {
            Length_sec = length_sec;
            Messages = messages;
            LastMsgTime = lastMsgTime;
        }

        public int Length_sec { get; set; }
        public int Messages { get; set; }
        public DateTime? LastMsgTime { get; set; }
    }
}
