export class PosizioneMezzo {
    constructor (
        public istanteInvio:string,
        public codiceMezzo:string,
        public classiMezzo:string[],
        public localizzazione:  { 
            lat:string,
            lon:string,
        },
        public istanteAcquisizione: string,
        public fonte: {
            codiceFonte:string,
            classeFonte:string,
        },
        public infoSO115: {
            stato:string,
            codiceIntervento:string,
            dataIntervento: string
        }
    ) {}
    
    }
