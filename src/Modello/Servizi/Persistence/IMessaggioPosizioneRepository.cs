using Modello.Classi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.Persistence
{
    public interface IMessaggioPosizioneRepository
    {
        /// <summary>
        ///   Salva il messaggio di posizione. Inizializza l'attributo id. Imposta la data di salvataggio.
        /// </summary>
        /// <param name="messaggioPosizione">Il messaggio di posizione da salvare</param>
        void Store(MessaggioPosizione messaggioPosizione);

        /// <summary>
        ///   Preleva dall'archivio il messaggio di posizione avente id specificato
        /// </summary>
        /// <param name="id">L'id del messaggio di posizione da recuperare</param>
        /// <returns></returns>
        MessaggioPosizione GetById(string id);
    }
}
