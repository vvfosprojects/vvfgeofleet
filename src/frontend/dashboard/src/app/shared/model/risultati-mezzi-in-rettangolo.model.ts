import { PosizioneMezzo } from './posizione-mezzo.model';

export class RispostaMezziInRettangolo {
    constructor (
        public istanteQuery:string,
        public rettangolo: {
            topLeft: {
                lat: string,
                lon: string
            },
            bottomRight: {
                lat: string,
                lon: string
            }
        },
        public classiMezzo: string[],
        public numeroMezzi: string,
        public durataQuery_msec: string,
        public risultati: PosizioneMezzo[]
    ) {}
}
