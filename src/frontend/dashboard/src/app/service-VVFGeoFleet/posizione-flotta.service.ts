
import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject, of } from "rxjs";

import { catchError, retry, map, filter } from 'rxjs/operators';

import * as moment from 'moment';

import { Http, Response, RequestOptions, Headers, RequestMethod  } from '@angular/http';

//import { HttpClient, HttpHeaders, HttpClientModule, HttpResponse } from '@angular/common/http';

import { ParametriGeoFleetWS } from '../shared/model/parametri-geofleet-ws.model';
import { Opzioni } from '../shared/model/opzioni.model';

import { GestioneParametriService } from '../service-parametri/gestione-parametri.service';
import { GestioneOpzioniService } from '../service-opzioni/gestione-opzioni.service';

import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { RispostaMezziInRettangolo } from '../shared/model/risultati-mezzi-in-rettangolo.model';

import { environment } from "../../environments/environment";

const API_URL = environment.apiUrl;

let headers = new Headers();
headers.append( 'Access-Control-Allow-Origin', '*' ); 
//headers.append( 'Access-Control-Allow-Origin', '*' ); 
//let options = new RequestOptions( { headers:  headers },  method: RequestMethod.Get);
let options = new RequestOptions( { headers:  headers , method: RequestMethod.Get });



@Injectable()
export class PosizioneFlottaService {

  private timer;
  private timerSubcribe: PushSubscription;
  
  private istanteUltimoAggiornamento: Date;
  private istanteAggiornamentoPrecedente: Date = null;

  private maxIstanteAcquisizione: Date;
  private maxIstanteAcquisizionePrecedente: Date = null;

  private trimSec: Number = 0;
  private trimSecDefault: Number = 50;


  private defaultAttSec: Number = 259200; // 3 giorni (3 * 24 * 60 * 60)
  private defaultrichiestaAPI: string = 'posizioneFlotta';

  private parametriGeoFleetWS : ParametriGeoFleetWS;
  private parametriGeoFleetWSprecedenti: ParametriGeoFleetWS;
  private opzioni : Opzioni;

  private elencoPosizioni: PosizioneMezzo[] = [];
  private obsPosizioniMezzo$ : Observable<PosizioneMezzo[]> ;
  private subjectPosizioniMezzo$ = new Subject<PosizioneMezzo[]>() ;

  private rispostaURL : Observable<Response> ;
  private subjectIstanteUltimoAggiornamento$ = new Subject<Date>();

  private subjectReset$ = new Subject<Boolean>();
  private subjectResetTimer$ = new Subject<Boolean>();

  subscription = new Subscription();
  
    constructor(private http: Http,
      private gestioneParametriService: GestioneParametriService,
      private gestioneOpzioniService: GestioneOpzioniService
    ) { 


      this.parametriGeoFleetWS = new ParametriGeoFleetWS();
      this.parametriGeoFleetWS.reset();

      this.parametriGeoFleetWSprecedenti = new ParametriGeoFleetWS();
      this.parametriGeoFleetWSprecedenti.reset();

      this.opzioni = new Opzioni();

      this.subscription.add(
        this.gestioneParametriService.getParametriGeoFleetWS()
        .subscribe( parm => { 
          // se è  stato modificato il tipo di estrazione dal ws o le coordinate del riquadro
          // allora resetta l'istante di acquisizione precedente
          // in quanto deve effettuare una nuova estrazione senza limite temporale.


          //console.log('PosizioneFlottaService.getParametriGeoFleetWS()', parm);
          if  (parm.getRichiestaAPI() != this.parametriGeoFleetWS.getRichiestaAPI()
              || parm.getClassiMezzo() != this.parametriGeoFleetWS.getClassiMezzo()
              || 
                (this.opzioni.getOnlyMap() && 
                  ( parm.getLat1() != this.parametriGeoFleetWS.getLat1()
                    || parm.getLon1() != this.parametriGeoFleetWS.getLon1()
                    || parm.getLat2() != this.parametriGeoFleetWS.getLat2()
                    || parm.getLon2() != this.parametriGeoFleetWS.getLon2()
                  )
                )
              )
          { 
            //console.log('PosizioneFlottaService.getParametriGeoFleetWS() - reset');
            this.maxIstanteAcquisizionePrecedente = null; 
            this.subjectReset$.next(true);
            // Resetta il timer per eseguire immediatamente 
            // la richiesta al ws prima di attendere il nuovo clock del timer
            this.subjectResetTimer$.next(true);

          }
          this.parametriGeoFleetWSprecedenti.set(this.parametriGeoFleetWS);
          this.parametriGeoFleetWS.set(parm);
        })
      );   

      this.subscription.add(
        this.gestioneOpzioniService.getOpzioni()
        .subscribe( opt => { this.opzioni = opt; })
      );   
  
      
    }

    public getResetTimer(): Observable<Boolean> {
      return this.subjectResetTimer$.asObservable();
    }
    
    public getURL(): Observable<PosizioneMezzo[]> {

      this.setIstanteUltimoAggiornamento();
      this.setAttSec();

      // onde evitare eventuali problemi di sincronizzazione con il servizio 
      // per la gestione dei parametri del WS, salvo i parametri in una var locale
      var parm : ParametriGeoFleetWS = new ParametriGeoFleetWS();
      parm.set(this.parametriGeoFleetWS);

      //console.log("PosizioneFlottaService.getURL() - istanteUltimoAggiornamento, parm", this.istanteUltimoAggiornamento, parm);
      
      var parametri : string = '';
      var richiestaWS : string = '';
      if (parm.getAttSec() != null) { parametri = parametri+ 
        (parametri == '' ? '?': '&') + 'attSec='+ String(parm.getAttSec()); }

      // se viene inviata la richiesta 'inRettangolo' aggiunge i relativi parametri
      if ( parm.getRichiestaAPI() == 'inRettangolo') {          
        if (parm.getLat1() != null) { parametri = parametri+
          (parametri == '' ? '?': '&') + 'lat1='+ String(parm.getLat1()); }
        if (parm.getLon1() != null) { parametri = parametri+
          (parametri == '' ? '?': '&') + 'lon1='+ String(parm.getLon1()); }
        if (parm.getLat2() != null) { parametri = parametri+
          (parametri == '' ? '?': '&') + 'lat2='+ String(parm.getLat2()); }
        if (parm.getLon2() != null) { parametri = parametri+
          (parametri == '' ? '?': '&') + 'lon2='+ String(parm.getLon2()); }
      }

      if (parametri != '' ) 
        { richiestaWS = parm.getRichiestaAPI() + parametri; }
      else 
        { richiestaWS = parm.getRichiestaAPI(); }

      //console.log("PosizioneFlottaService.getURL() - richiestaWS",API_URL + richiestaWS);
          
      var observable: Observable<Response> = this.http.get(API_URL + richiestaWS);

      if ( parm.getRichiestaAPI() == 'posizioneFlotta')
      {        
          this.obsPosizioniMezzo$ = observable.
          map((r : Response) => 
          {  
          return r.json().
          map((e : PosizioneMezzo) => 
            { if (e.infoSO115 == null) 
              { 
                e.infoSO115 = Object.create( {stato: String}); 
                e.infoSO115.stato = "0";
              }
              if (e.infoSO115.stato == null || e.infoSO115.stato == "" )
              {
                e.infoSO115.stato = "0";              
              }
              //e.tooltipText = Object.create(String.prototype);
              e.sedeMezzo = this.sedeMezzo(e);
              e.destinazioneUso = this.destinazioneUso(e);
              e.selezionato = false;
              e.toolTipText = this.toolTipText(e);
              e.classiMezzoDepurata = this.classiMezzoDepurata(e);
              e.descrizionePosizione = e.classiMezzoDepurata.toString() + " " + e.codiceMezzo + " (" + e.sedeMezzo + ")";            
              e.visibile = false;
              let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
              Object.assign(posizioneMezzo, e);
              return posizioneMezzo;
            }
          )           
          }),
          catchError(this.handleError)
        ;  
      }

      if ( parm.getRichiestaAPI() == 'inRettangolo')
      {

        this.obsPosizioniMezzo$ = observable.
        map((r : Response) => 
          {
            return r.json().risultati.map( 
            (e : PosizioneMezzo) => 

              { if (e.infoSO115 == null) { 
                  e.infoSO115 = Object.create( {stato: String}); 
                  e.infoSO115.stato = "0";
                }
                if (e.infoSO115.stato == null || e.infoSO115.stato == "" )
                {
                  e.infoSO115.stato = "0";              
                }
                e.sedeMezzo = this.sedeMezzo(e);
                e.destinazioneUso = this.destinazioneUso(e);
                e.selezionato = false;
                e.toolTipText = this.toolTipText(e);
                e.classiMezzoDepurata = this.classiMezzoDepurata(e);
                e.descrizionePosizione = e.classiMezzoDepurata.toString() + " " + e.codiceMezzo + " (" + e.sedeMezzo + ")";
                e.visibile = false;
                let posizioneMezzo = Object.create(PosizioneMezzo.prototype);
                return Object.assign(posizioneMezzo, e);

              });
          }),
        catchError(this.handleError);      

      };

      return this.obsPosizioniMezzo$;
    }
    
    public getReset(): Observable<Boolean> {      
      return this.subjectReset$.asObservable();
    }

    public getPosizioneFlotta(): Observable<PosizioneMezzo[]> {

        // schedula con un timer che si attiva ogni 9 secondi
        this.timer = Observable.timer(0,9000).timeout(120000);
        // subscribe al timer per l'aggiornamento periodico della Situazione flotta
        this.timerSubcribe = this.timer.subscribe(t => 
          {
            this.getURL().subscribe( (r : PosizioneMezzo[]) => {
              //console.log('PosizioneFlottaService.getPosizioneFlotta() - r',r);
              this.elencoPosizioni=this.setElencoPosizioni(r);
              this.subjectPosizioniMezzo$.next(this.elencoPosizioni); 
              });

          }
        );

        this.subscription.add( this.getResetTimer().subscribe(
          (value : Boolean) => {if (value)
          {            
            console.log("Destroy timer");
            this.timerSubcribe.unsubscribe();
            // schedula con un timer che si attiva ogni 9 secondi
            this.timer = Observable.timer(0,9000).timeout(120000);
            
            // subscribe al timer per l'aggiornamento periodico della Situazione flotta
            this.timerSubcribe = this.timer.subscribe(t => 
              {
                this.getURL().subscribe( (r : PosizioneMezzo[]) => {
                  //console.log('PosizioneFlottaService.getPosizioneFlotta() - r',r);
                  this.elencoPosizioni=this.setElencoPosizioni(r);
                  this.subjectPosizioniMezzo$.next(this.elencoPosizioni); 
                  });

              }
            );
            
          }}))



        //console.log('PosizioneFlottaService.getPosizioneFlotta() - subjectPosizioniMezzo$',this.subjectPosizioniMezzo$);
        return this.subjectPosizioniMezzo$.asObservable();
      };
  
    private handleError(error: Response | any) {
      if (error != null)
      { console.error('ApiService::handleError', error);
        return Observable.throw(error);
      }
    }

    private setAttSec()
    {      
      var attSec : number;

      //
      // 'AttSec' deve essere calcolato in relazione all'istante di acquisizione precedente 
      // più alto.
      //
      // Aggiungere sempre X secondi (trimSec) per essere sicuri di perdersi
      // meno posizioni possibili, a causa della distanza di tempo tra
      // l'invio della richiesta dal client e la sua ricezione dal ws.
      //
      // Per essere certi, è necessaria un API che restituisca i messaggi
      // 'acquisiti' successivamente ad un certo istante
      //
            
      if (this.maxIstanteAcquisizionePrecedente != null) 
      {
        attSec = moment(this.istanteUltimoAggiornamento).
          diff(this.maxIstanteAcquisizionePrecedente, 'seconds').valueOf() + 
          this.trimSec.valueOf() ; 
        // aggiorno l'intervallo temporale estratto nel servizio
        // per la gestione dei parametri del WS
        this.gestioneParametriService.setAttSec(attSec);
      } 

      //console.log("setAttSec() - attSec", attSec);

    }
    
    private setElencoPosizioni(elencoPosizioniWS: PosizioneMezzo[]) :PosizioneMezzo[]
    {
      if (elencoPosizioniWS.length > 0) {

        //(elencoPosizioniWS.length > 0)?console.log(moment().toDate(),"PosizioneFlottaService.setElencoPosizioni() - elencoPosizioniWS", elencoPosizioniWS):null;

        // filtra le posizioni con l'istante acquisizione  precedente all'istanteUltimoAggiornamento, per escludere 
        // eventuali messaggi "futuri", che potrebbero essere ricevuti dagli adapter SO115
        // a causa di errata impostazione della data di sistema sui server dei Comandi Provinciali
        var elencoPosizioniMezzoDepurate : PosizioneMezzo[];
        elencoPosizioniMezzoDepurate = elencoPosizioniWS.filter(
          i => (new Date(i.istanteAcquisizione) < new Date(this.istanteUltimoAggiornamento) )
        );

        var elencoPosizioniDaElaborare : PosizioneMezzo[];
        /*
        // filtra le posizioni da elaborare estraendo da quelle depurate, 
        // le successive (o uguali) all'istante di acquisizione più recente della 
        // precedente elaborazione
        elencoPosizioniDaElaborare = elencoPosizioniMezzoDepurate.filter(
          i => (new Date(i.istanteAcquisizione) >= new Date(this.maxIstanteAcquisizionePrecedente) )
          );
        */

        // non effettua nessun filtro sull'istante di acquisizione,
        // per evitare che le posizioni archiviate successivamente
        // all'ultimo istante acquisizione vengano scartate
        elencoPosizioniDaElaborare = elencoPosizioniMezzoDepurate;

        //console.log("elencoPosizioniDaElaborare", elencoPosizioniDaElaborare);


        if (elencoPosizioniDaElaborare.length > 0) {

          // imposta maxIstanteAcquisizione 
          this.maxIstanteAcquisizione = new Date(elencoPosizioniDaElaborare.
            reduce( function (a,b) 
            { var bb : Date = new Date(b.istanteAcquisizione);
              var aa : Date  = new Date(a.istanteAcquisizione);
              return aa>bb ? a : b ;
            }).istanteAcquisizione);

          // 
          // Imposta trimSec che verrà utilizzato nella successiva richiesta al ws.
          // Ottenuto calcolando la differenza di tempo tra l'
          // istanteUltimoAggiornamento e l'istanteAcquisizione più alto tra 
          // le posizioni ricevute, purchè succesive a istanteUltimoAggiornamento.
          //
          //          
          this.trimSec = 0;
          /*
          this.trimSec = moment(
            new Date(elencoPosizioniDaElaborare.
                reduce( function (a,b) 
                { var bb : Date = new Date(b.istanteAcquisizione);
                  var aa : Date  = new Date(a.istanteAcquisizione);
                  return aa>bb ? a : b ;
                }).istanteAcquisizione)).diff(this.istanteUltimoAggiornamento, 'seconds');
          */
         this.trimSec = moment(this.maxIstanteAcquisizione).
            diff(this.istanteUltimoAggiornamento, 'seconds');

          //console.log("setElencoPosizioni() - trimSec", this.trimSec);
          this.trimSec = (this.trimSec.valueOf() > 0 ) ? this.trimSec.valueOf() + this.trimSecDefault.valueOf(): this.trimSecDefault.valueOf();
          //console.log("setElencoPosizioni() - trimSec adj", this.trimSec);
                
          /*
          console.log("this.istanteUltimoAggiornamento, this.maxIstanteAcquisizione, this.maxIstanteAcquisizionePrecedente",
            this.istanteUltimoAggiornamento, this.maxIstanteAcquisizione, this.maxIstanteAcquisizionePrecedente);
          */

          this.maxIstanteAcquisizionePrecedente = this.maxIstanteAcquisizione;



        }

              
                 
      }      
    
      return elencoPosizioniDaElaborare;
    }
    
    private setIstanteUltimoAggiornamento()
    {       

        // memorizza l'istante di inizio di questa operazione di aggiornamento
        this.istanteUltimoAggiornamento = moment().toDate();      

        // restituisce l'istante di inizio di questa operazione di aggiornamento
        this.subjectIstanteUltimoAggiornamento$.next(this.istanteUltimoAggiornamento);
    }
        
    public getIstanteUltimoAggiornamento(): Observable<Date> {
      return this.subjectIstanteUltimoAggiornamento$.asObservable();                
    }  
  
    sedeMezzo(p : PosizioneMezzo) {
      //return p.classiMezzo.find( i =>  i.substr(0,5) == "PROV:".substr(5,2));
      
      var r : string;
      if (p.classiMezzo != null) {
        r = p.classiMezzo.find( i =>  (i.substr(0,5) == "PROV:"));
        r = (r != null) ?  r.substr(5,2) : ".."; } 
      return ( r != null ? r: "..");    
    }
    

    destinazioneUso(p : PosizioneMezzo) {
      //return p.classiMezzo.find( i =>  i.substr(0,5) == "PROV:".substr(5,2));
      
      var r : string;
      if (p.classiMezzo != null) {
        r = p.classiMezzo.find( i =>  (i.substr(0,5) == "USO:"));
        //r = (r != null) ?  r.substr(5,2) : ".."; } 
        r = (r != null) ?  r.substr(5,2) : "CORP"; } 
      return ( r != null ? r: "..");
    }
    
  
    classiMezzoDepurata(p : PosizioneMezzo) {
      return p.classiMezzo.
        filter( i =>  (i.substr(0,5) != "PROV:") ).
        filter( i =>  (i.substr(0,5) != "USO:") )
    }
      
    toolTipText(item : PosizioneMezzo) {
      var testo : string;
      var opzioniDataOra = {};
      //" (" + this.sedeMezzo(item) + ") del " + 
      testo = this.classiMezzoDepurata(item) + " " + item.codiceMezzo +
      " (" + item.sedeMezzo + ") del " + 
      new Date(item.istanteAcquisizione).toLocaleString() + 
      " (da " + item.fonte.classeFonte + ":" + item.fonte.codiceFonte + ")";

      if (item.infoSO115 != null && 
        item.infoSO115.codiceIntervento != null &&
          new Number(item.infoSO115.codiceIntervento) != 0) {
        testo = testo + " - Intervento " + item.infoSO115.codiceIntervento + " del " +
        new Date(item.infoSO115.dataIntervento).toLocaleDateString() ;
      }
      return testo;
    }  


  }