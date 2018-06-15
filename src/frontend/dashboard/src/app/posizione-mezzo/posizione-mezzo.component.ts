import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { PosizioneMezzo } from './posizione-mezzo.model';
//import { EventEmitter } from 'events';

//selector: '[app-posizione-mezzo]',

@Component({
  selector: 'app-posizione-mezzo',
  templateUrl: './posizione-mezzo.component.html',
  styleUrls: ['./posizione-mezzo.component.css']
})
export class PosizioneMezzoComponent implements OnInit {

  @Input() posizioneMezzo: PosizioneMezzo;
  @Input() istanteUltimoAggiornamento: Date;
  @Input() filtriStatiMezzo: string[] = [];
  @Input() filtriSedi: string[] = [];
  //@Output() mezzoSelezionato = new EventEmitter<PosizioneMezzo>();
  @Output() mezzoSelezionato = new EventEmitter<Object[]>();
  private currentItem: PosizioneMezzo;
    
  private iconaMezzoCorrente: string;
  private badgeStatoMezzoCorrente: any ;
  private testoStatoMezzoCorrente: any ;
  private defIconeFonte: any;
  private defStatoMezzoCorrente: any ;
  private defStatiMezzo: any ;
  private mapAlert: any ;
  private mapIconeFonte: any;

  private istanteAcquisizionePosizioneMezzo: Date;


  constructor() { 
    //['4',['rientrato','badge-info']],
    //['5',['istituto','badge-warning']],
    //['6',['radio','badge-secondary']],

    this.defStatiMezzo = [
      ['0',['sconosciuto','badge-dark']],
      ['1',['in viaggio','badge-danger']],
      ['2',['sul posto','badge-primary']],
      ['3',['in rientro','badge-success']],
      ['4',['rientrato','badge-secondary']],
      ['5',['istituto','badge-istituto']],
      ['6',['radio','badge-radio']],
      ['7',['ultima','badge-fuori-servizio']],      
    ]    ;    

    this.mapAlert = new Map(this.defStatiMezzo);        

    this.defIconeFonte = [
      [ 'SERCOM/SO115/MEZZI', 'fa-truck'],
      [ 'SERCOM/SO115/GAC', 'fa-truck'],
      [ 'TTK', 'fa-truck'],
      [ 'SERCOM/SO115/MEZZIFITTIZI', 'fa-bus'],
      [ 'SERCOM/SO115/RADIO', 'fa-tty']
    ] ;

    this.mapIconeFonte = new Map(this.defIconeFonte);        
    
  }

  ngOnInit() {

    if (this.posizioneMezzo != null )
      { this.aggiornaDatiMezzoCorrente(); }

  }

  ngOnChanges() {
    //console.log('posizioneMezzoSelezionata ' ,this.filtriStatiMezzo);
    if (this.posizioneMezzo != null )
      { this.aggiornaDatiMezzoCorrente(); }
  }

  aggiornaDatiMezzoCorrente() {
    //this.defStatoMezzoCorrente = this.mapAlert.get(this.posizioneMezzo.infoSO115.stato);
    if (this.posizioneMezzo.infoSO115 != null) {
      this.defStatoMezzoCorrente = this.mapAlert.get(this.posizioneMezzo.infoSO115.stato);
    } else 
    {
      console.log(this.posizioneMezzo);
      this.defStatoMezzoCorrente = this.mapAlert.get('0');
    }
    
    if (this.defStatoMezzoCorrente == null )
    { console.log(this.posizioneMezzo); }

    this.badgeStatoMezzoCorrente = this.defStatoMezzoCorrente[1];
    this.testoStatoMezzoCorrente = this.defStatoMezzoCorrente[0];

    this.iconaMezzoCorrente = this.mapIconeFonte.get(this.posizioneMezzo.fonte.classeFonte);

    this.istanteAcquisizionePosizioneMezzo = new Date(this.posizioneMezzo.istanteAcquisizione);
    //if (this.posizioneMezzo.fonte.classeFonte == "") {this.iconaMezzoCorrente = "fa-truck";}
    //console.log(this.badgeStatoMezzoCorrente);
  }

  /*
  sedeMezzo() {
   return (this.posizioneMezzo.classiMezzo.
     find( i =>  i.substr(0,5) == "PROV:")).substr(5,2);
  }
  */

  classiMezzoDepurata() {
    return this.posizioneMezzo.classiMezzo.
      filter( i =>  (i.substr(0,5) != "PROV:") )
  }

  posizioneMezzoSelezionata() { 
    return this.filtriStatiMezzo.
      some(filtro => filtro === this.posizioneMezzo.infoSO115.stato)
      && this.filtriSedi.
      some(filtro => filtro === this.posizioneMezzo.sedeMezzo);    
  }

  private mouseIn() {
    this.currentItem = this.posizioneMezzo;
    this.mezzoSelezionato.emit([this.posizioneMezzo, "mouseover"] );
    //console.log('mouseIn', $event);    
    //console.log('mouseIn', this.currentItem, this.posizioneMezzo);
  }

  private mouseOut() {
    this.currentItem = null;    
    //console.log('mouseOut', this.currentItem, this.posizioneMezzo);
  }

  private centerOnMap() {
    this.mezzoSelezionato.emit([this.posizioneMezzo, "click"] );
    //console.log('centerOnMap', $event);
  }

  private toolTipText() {
    var testo : String;
    testo = this.classiMezzoDepurata() + " " + this.posizioneMezzo.codiceMezzo +
    " (" + this.posizioneMezzo.sedeMezzo + ") del " + 
    new Date(this.posizioneMezzo.istanteAcquisizione).toLocaleString()  + 
    " (da " + this.posizioneMezzo.fonte.classeFonte + ":" + this.posizioneMezzo.fonte.codiceFonte + ")";

    if (this.posizioneMezzo.infoSO115 != null && 
        this.posizioneMezzo.infoSO115.codiceIntervento != null &&
        new Number(this.posizioneMezzo.infoSO115.codiceIntervento) != 0) {
      testo = testo + " - Intervento " + this.posizioneMezzo.infoSO115.codiceIntervento + " del " +
      new Date(this.posizioneMezzo.infoSO115.dataIntervento).toLocaleDateString() ;
    }
    return testo;
  }
}
