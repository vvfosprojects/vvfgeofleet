using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.Services.Configurazione
{
    public interface IAppConfig
    {
        string ConnectionString { get; }

        string DatabaseName { get; }

        bool DoCreateIndex { get; }

        int OrizzonteTemporale_sec { get; }
    }
}
