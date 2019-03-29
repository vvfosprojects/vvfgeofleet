import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';

import { Inject, HostListener } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { MapType } from '@angular/compiler';

import * as moment from 'moment';

//import { EventEmitter } from 'events';

//selector: '[app-posizione-mezzo]',

@Component({
  selector: 'app-posizione-mezzo',
  templateUrl: './posizione-mezzo.component.html',
  styleUrls: ['./posizione-mezzo.component.css']
})
export class PosizioneMezzoComponent implements OnInit {

  
  //private filtriSediObj : Object;
  //private filtriGeneriMezzoObj : Object ;

  @Input() posizioneMezzo: PosizioneMezzo;
  //@Input() istanteUltimoAggiornamento: Date;
  public  istanteUltimoAggiornamento: Date;
  /*
  @Input() filtriStatiMezzo: string[] = [];
  @Input() filtriSedi: string[] = [];
  @Input() filtriGeneriMezzo: string[] = [];
  @Input() filtriDestinazioneUso: string[] = [];
  */
 
  @Input() filtriStatiMezzoObj: Object;
  @Input() filtriSediObj: Object;
  @Input() filtriGeneriMezzoObj : Object ;
  @Input() filtriDestinazioneUsoObj: Object;
  
  @Input() filtriStatiMezzoCardinalita: number ;
  @Input() filtriSediCardinalita: number ;
  @Input() filtriGeneriMezzoCardinalita: number ;
  @Input() filtriDestinazioneUsoCardinalita: number;

  @Input() isSeguiMezzo: boolean ;

  
  //@Output() mezzoSelezionato = new EventEmitter<PosizioneMezzo>();
  @Output() mezzoSelezionato = new EventEmitter<Object[]>();
  @Output() mezzoDaSeguire = new EventEmitter<Object[]>();
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

    /*
    var arr = [{a:{b:1}},{c:{d:2}}] 
    var newObj = arr.reduce((a, b) => Object.assign(a, b), {})

    console.log(newObj)
    */    

    /*
    const filtriGeneriMezzo = [ "aa", "bb" ];
    const filtriGeneriMezzoObj = { key: String, value: String};

    filtriGeneriMezzo.forEach( item => filtriGeneriMezzoObj[item] = item );
    console.log(filtriGeneriMezzoObj["aa"]);
    */

    /*
    const filtriGeneriMezzo = [ "aa", "bb" ];
    this.filtriGeneriMezzoObj = Object.setPrototypeOf(this.filtriGeneriMezzo, this.filtriGeneriMezzoObj);
    console.log(filtriGeneriMezzoObj[0]);
    */

    //this.filtriGeneriMezzoObj = Object.setPrototypeOf(this.filtriGeneriMezzo, this.filtriGeneriMezzoObj);



    //constructor(@Inject(DOCUMENT) private doc: Document) {
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
  /*
  @HostListener("window:resize", [])
  onWindowZoom() {
      console.log("zoom");
  }
  */
  ngOnInit() {

    if (this.posizioneMezzo != null )
      { this.aggiornaDatiMezzoCorrente(); }

  }

  ngOnChanges() {
    this.istanteUltimoAggiornamento = moment().toDate();
/*
    this.filtriSediObj = undefined;  
    this.filtriGeneriMezzoObj = undefined;

    this.filtriSediObj = new Object();  
    this.filtriGeneriMezzoObj = new Object( );

    this.filtriSedi.forEach( item => 
      {
       this.filtriSediObj[item] = item; 
      }
      );      
    
    this.filtriGeneriMezzo.forEach( item => 
      {       
         this.filtriGeneriMezzoObj[item]=item; 
      }
      );
*/    
    //console.log('posizioneMezzoSelezionata ' ,this.filtriStatiMezzo);
    if (this.posizioneMezzo != null )
      { this.aggiornaDatiMezzoCorrente(); }
    if (this.posizioneMezzo.selezionato) 
      { this.seguiMezzo(); }
  }

  aggiornaDatiMezzoCorrente() {
    //this.defStatoMezzoCorrente = this.mapAlert.get(this.posizioneMezzo.infoSO115.stato);
    if (this.posizioneMezzo.infoSO115 != null) {
      this.defStatoMezzoCorrente = this.mapAlert.get(this.posizioneMezzo.infoSO115.stato);
    } else 
    {
      //console.log(this.posizioneMezzo);
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
    return ( this.isSeguiMezzo ||
      /*
      (this.filtriStatiMezzo.
          some(filtro => filtro === this.posizioneMezzo.infoSO115.stato)
      &&       
      this.filtriSedi.
          some(filtro => filtro === this.posizioneMezzo.sedeMezzo)
      &&
      this.filtriGeneriMezzo.
          some(filtro => this.posizioneMezzo.classiMezzo.
            some( gm => gm === filtro))  
      && this.filtriDestinazioneUso.
          some(filtro =>filtro === this.posizioneMezzo.destinazioneUso )              
      */
      ( (this.filtriStatiMezzoObj[this.posizioneMezzo.infoSO115.stato] == this.posizioneMezzo.infoSO115.stato)
        && 
        (this.filtriSediObj[this.posizioneMezzo.sedeMezzo] == this.posizioneMezzo.sedeMezzo)
        && 
        this.posizioneMezzo.classiMezzoDepurata.
          some( gm => this.filtriGeneriMezzoObj[gm] == gm )
        && 
        this.filtriDestinazioneUsoObj[this.posizioneMezzo.destinazioneUso] == this.posizioneMezzo.destinazioneUso)       
      );
  }



  /*
  posizioneMezzoSelezionata() { 
    return (
      (this.filtriStatiMezzo.length === this.filtriStatiMezzoCardinalita||
        this.filtriStatiMezzo.
          some(filtro => filtro === this.posizioneMezzo.infoSO115.stato))
      && 
      (this.filtriSedi.length === this.filtriSediCardinalita||
        this.filtriSedi.
          some(filtro => filtro === this.posizioneMezzo.sedeMezzo))
      && 
      (this.filtriGeneriMezzo.length === this.filtriGeneriMezzoCardinalita||
        this.filtriGeneriMezzo.
          some(filtro => this.posizioneMezzo.classiMezzo[1] === filtro))
      );

  }
  */
  
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


  private seguiMezzo() { 
    this.mezzoDaSeguire.emit([this.posizioneMezzo, "dblclick"] );
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
