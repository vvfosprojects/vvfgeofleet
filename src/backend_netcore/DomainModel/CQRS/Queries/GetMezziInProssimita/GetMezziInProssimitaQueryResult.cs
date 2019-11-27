using DomainModel.Classes;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetMezziInProssimita
{
    public class GetMezziInProssimitaQueryResult
    {
        public DateTime IstanteQuery { get; set; }

        public Rettangolo Rettangolo { get; set; }

        public string[] ClassiMezzo { get; set; }

        public int NumeroMezzi { get; set; }

        public long DurataQuery_msec { get; set; }

        public MessaggioPosizione[] Risultati { get; set; }
    }
}
