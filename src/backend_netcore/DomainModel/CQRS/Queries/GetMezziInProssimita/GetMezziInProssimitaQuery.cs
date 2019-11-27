using CQRS.Queries;
using DomainModel.Classes;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetMezziInProssimita
{
    public class GetMezziInProssimitaQuery : IQuery<GetMezziInProssimitaQueryResult>
    {
        public Rettangolo Rettangolo { get; set; }

        public string[] ClassiMezzo { get; set; }

        public int AttSec { get; set; }
    }
}
