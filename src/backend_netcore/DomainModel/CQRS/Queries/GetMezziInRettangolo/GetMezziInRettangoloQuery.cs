using CQRS.Queries;
using DomainModel.Classes;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetMezziInRettangolo
{
    public class GetMezziInRettangoloQuery : IQuery<GetMezziInRettangoloQueryResult>
    {
        public Rettangolo Rettangolo { get; set; }

        public string[] ClassiMezzo { get; set; }

        public int AttSec { get; set; }
    }
}
