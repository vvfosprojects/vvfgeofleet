using Modello.Classi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.Persistence
{
    public interface IGetPosizioneFlotta
    {
        IEnumerable<MessaggioPosizione> Get();

        IEnumerable<MessaggioPosizione> Get(string[] classiMezzo);
    }
}
