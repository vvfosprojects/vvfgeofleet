import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { PosizioneMezzo } from '../posizione-mezzo/posizione-mezzo.model';

@Injectable()
export class PosizioneFlottaServiceFake {
    
 
    private elencoPosizioni: PosizioneMezzo[];
    
      constructor() { }
    
      public getPosizioneFlotta(): Observable<PosizioneMezzo[]> {

        var elencoPosizioni : PosizioneMezzo[] = [
            new PosizioneMezzo(
                "2018-01-31 17:11:59", "M#RM:7/A",
                [ "APS" ],
                 { lat: "41.899888", lon: "12.490968"},
                 "2018-01-26 13:19:51 ",
                 { codiceFonte: "RM-73534", classeFonte: "SERCOM/SO115"},
                 {stato: "3",codiceIntervento: "5",dataIntervento: "31-MAG-17"},
                 "2018-01-31 17:11:59",
                "testo tootTip")
        ];
       
        return Observable.of(elencoPosizioni);
    }

    private handleError(error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
      }    
}


    /*
    {"istanteInvio":"2018-01-31 17:11:59 ","codiceMezzo":"M#RM:7/A","classiMezzo": [ "APS" ],"localizzazione": {"lat": 41.899888, "lon": 12.490968},"istanteAcquisizione":"2018-01-26 13:19:51 ","fonte": {"codiceFonte": "RM-73534","classeFonte": "SERCOM/SO115"},"infoSO115": {"stato":"3","codiceIntervento":"5","dataIntervento":"31-MAG-17"}}
    {"id":"5a71eace47d6640b90ce8672","codiceMezzo":"M#RM:7/A","classiMezzo":["APS"],"localizzazione":{"lat":41.899888,"lon":12.490968},"istanteAcquisizione":"2018-01-26T13:19:51","fonte":{"codiceFonte":"RM-73534","classeFonte":"SERCOM/SO115"},"infoFonte":null,"infoSO115":{"stato":"3","codiceIntervento":"5","dataIntervento":"0001-01-01T00:00:00"},"istanteArchiviazione":"2018-01-31T17:11:58.0053671+01:00"}
    {"istanteInvio":"2018-01-31 17:11:59 ","codiceMezzo":"M#RM:9/A","classiMezzo": [ "APS" ],"localizzazione": {"lat": 41.91867, "lon": 12.463905},"istanteAcquisizione":"2018-01-26 12:51:57 ","fonte": {"codiceFonte": "RM-73545","classeFonte": "SERCOM/SO115"},"infoSO115": {"stato":"5","codiceIntervento":"","dataIntervento":""}}
    {"id":"5a71eace47d6640b90ce8673","codiceMezzo":"M#RM:9/A","classiMezzo":["APS"],"localizzazione":{"lat":41.91867,"lon":12.463905},"istanteAcquisizione":"2018-01-26T12:51:57","fonte":{"codiceFonte":"RM-73545","classeFonte":"SERCOM/SO115"},"infoFonte":null,"infoSO115":{"stato":"5","codiceIntervento":"","dataIntervento":"0001-01-01T00:00:00"},"istanteArchiviazione":"2018-01-31T17:11:58.0141562+01:00"}
    {"istanteInvio":"2018-01-31 17:11:59 ","codiceMezzo":"M#RM:AB/11","classiMezzo": [ "ABP" ],"localizzazione": {"lat": 41.817523, "lon": 12.313592},"istanteAcquisizione":"2018-01-26 14:53:43 ","fonte": {"codiceFonte": "RM-73625","classeFonte": "SERCOM/SO115"},"infoSO115": {"stato":"5","codiceIntervento":"","dataIntervento":""}}
    {"id":"5a71eace47d6640b90ce8674","codiceMezzo":"M#RM:AB/11","classiMezzo":["ABP"],"localizzazione":{"lat":41.817523,"lon":12.313592},"istanteAcquisizione":"2018-01-26T14:53:43","fonte":{"codiceFonte":"RM-73625","classeFonte":"SERCOM/SO115"},"infoFonte":null,"infoSO115":{"stato":"5","codiceIntervento":"","dataIntervento":"0001-01-01T00:00:00"},"istanteArchiviazione":"2018-01-31T17:11:58.0170859+01:00"}
    */
       