using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Configurazione
{
    public interface IAppConfig
    {
        string ConnectionString { get; }
        int OrizzonteTemporale_sec { get; }
    }
}
