export class ParametriGeoFleetWS {

    private richiestaAPI: string;
    private attSec:  Number;
    private lat1:    Number;
    private lon1:    Number;
    private lat2:    Number;
    private lon2:    Number;
    private classiMezzo: String[];
    constructor() {
        this.reset();
    }

    private defaultAttSecStandard: Number = 259200; // 3 giorni (3 * 24 * 60 * 60)
    private defaultAttSec: Number = 259200; // 3 giorni (3 * 24 * 60 * 60)
    //private defaultAttSec: Number = 604800; // 1 settimana (7 * 24 * 60 * 60)
    private defaultrichiestaAPI: string = 'posizioneFlotta';

    public reset() {
        this.setRichiestaAPI(this.defaultrichiestaAPI);
        this.setAttSec(this.defaultAttSec);
        this.lat1 = null;
        this.lon1 = null;
        this.lat2 = null;
        this.lon2 = null;
        this.classiMezzo = null;
    }

    public getRichiestaAPI() : string { return this.richiestaAPI; }

    public setRichiestaAPI(richiestaAPI : string) {
        if ( richiestaAPI != null) {this.richiestaAPI = richiestaAPI;} 
        else {this.richiestaAPI = this.defaultrichiestaAPI.valueOf(); }
    }

    public getAttSec() : Number { return this.attSec; }

    public setAttSec(attSec : Number) {
        if ( attSec != null) {this.attSec = attSec;} 
        else {this.attSec = this.defaultAttSec.valueOf(); }
    }

    public getDefaultAttSec() : Number { return this.defaultAttSec; }

    public setDefaultAttSec(attSec : Number) {
        if ( attSec != null) {this.defaultAttSec = attSec;} 
        else {this.defaultAttSec = this.defaultAttSecStandard.valueOf(); }
    }
        
    public getLat1() : Number { return this.lat1; }
    public setLat1(lat1 : Number) { this.lat1 = lat1; }

    public getLon1() : Number { return this.lon1; }
    public setLon1(lon1 : Number) { this.lon1 = lon1; }

    public getLat2() : Number { return this.lat2; }
    public setLat2(lat2 : Number) { this.lat2 = lat2; }

    public getLon2() : Number { return this.lon2; }
    public setLon2(lon2 : Number) { this.lon2 = lon2; }

    public getClassiMezzo() : String[] { return this.classiMezzo; }
    public setClassiMezzo(classiMezzo : String[]) { 
        this.classiMezzo = classiMezzo; }

}
