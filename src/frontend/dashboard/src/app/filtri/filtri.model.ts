export class Filtri {    
    constructor (
        // stato sconosciuto
        public statoMezzo0:boolean, 
        // in viaggio verso un intervento
        public statoMezzo1:boolean,
        // arrivato sul luogo dell'intervento
        public statoMezzo2:boolean,
        // in rientro dal luogo dell'intervento
        public statoMezzo3:boolean,
        // rientro in sede
        public statoMezzo4:boolean,
        // fuori per motivi di istituto
        public statoMezzo5:boolean,
        // posizione inviata da una radio non associata a nessun Mezzo
        public statoMezzo6:boolean
    ) { };

}



