using DomainModel.CQRS.Queries.GetMezziInRettangolo;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.Services.Persistence
{
    public interface IGetMezziInRettangolo
    {
        GetMezziInRettangoloQueryResult Get(GetMezziInRettangoloQuery query);
    }
}
