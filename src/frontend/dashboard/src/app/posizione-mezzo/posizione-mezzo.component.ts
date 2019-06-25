import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { Inject, HostListener } from "@angular/core";
//import { DOCUMENT } from "@angular/platform-browser";
import { MapType } from '@angular/compiler';

import { Observable, Subscription, Subject, of } from "rxjs";

import * as moment from 'moment';

import { PosizioneMezzo } from '../shared/model/posizione-mezzo.model';
import { VoceFiltro } from "../filtri/voce-filtro.model";

import { GestioneFiltriService } from '../service-filter/gestione-filtri.service';

//import { EventEmitter } from 'events';

//selector: '[app-posizione-mezzo]',

@Component({
  selector: 'app-posizione-mezzo',
  templateUrl: './posizione-mezzo.component.html',
  styleUrls: ['./posizione-mezzo.component.css']
})
export class PosizioneMezzoComponent implements OnInit, OnChanges {

  @Input() posizioneMezzo: PosizioneMezzo;
  @Input() isSeguiMezzo: boolean ;

  @Input() istanteUltimoAggiornamento: Date;
  @Input() istanteModificaFiltri: Date;

  @Input() onlySelected: boolean ;
  
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


  subscription = new Subscription();

  constructor(private gestioneFiltriService: GestioneFiltriService    
  )
  { 


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
    /*
        if (this.posizioneMezzo != null )
          { this.aggiornaDatiMezzoCorrente(); }
    */
  }

  ngOnChanges() {
    /*
        if (this.posizioneMezzo != null )
          { this.aggiornaDatiMezzoCorrente(); }
    */
    /*
    if (this.posizioneMezzo.selezionato) 
      { this.seguiMezzo(); }
    */
  }


  badgeStatoMezzo() : any {
    if (this.posizioneMezzo.infoSO115 != null) {
      this.defStatoMezzoCorrente = this.mapAlert.get(this.posizioneMezzo.infoSO115.stato);
    } else 
    {
      //console.log(this.posizioneMezzo);
      this.defStatoMezzoCorrente = this.mapAlert.get('0');
    }

    if (this.defStatoMezzoCorrente == null )
    { console.log('this.defStatoMezzoCorrente == null',this.posizioneMezzo); }

    return this.defStatoMezzoCorrente[1];
  }


  testoStatoMezzo() : any {
    if (this.posizioneMezzo.infoSO115 != null) {
      this.defStatoMezzoCorrente = this.mapAlert.get(this.posizioneMezzo.infoSO115.stato);
    } else 
    {
      //console.log(this.posizioneMezzo);
      this.defStatoMezzoCorrente = this.mapAlert.get('0');
    }

    if (this.defStatoMezzoCorrente == null )
    { console.log('this.defStatoMezzoCorrente == null',this.posizioneMezzo); }

    return this.defStatoMezzoCorrente[0];
  }

  iconaSelezionato() : any {
    return (this.isSeguiMezzo)?'fa-tag':'fa-thumb-tack';
  }

  iconaMezzo() : any {
    return this.mapIconeFonte.get(this.posizioneMezzo.fonte.classeFonte);
  }

  /*
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
    { console.log('this.defStatoMezzoCorrente == null',this.posizioneMezzo); }

    this.badgeStatoMezzoCorrente = this.defStatoMezzoCorrente[1];
    this.testoStatoMezzoCorrente = this.defStatoMezzoCorrente[0];

    this.iconaMezzoCorrente = this.mapIconeFonte.get(this.posizioneMezzo.fonte.classeFonte);

    this.istanteAcquisizionePosizioneMezzo = new Date(this.posizioneMezzo.istanteAcquisizione);
    
    //if (this.posizioneMezzo.fonte.classeFonte == "") {this.iconaMezzoCorrente = "fa-truck";}
    //console.log(this.badgeStatoMezzoCorrente);
  }
  */

  posizioneMezzoSelezionata() : boolean
  { 
    // mostra tutti i Mezzi selezionati e Mezzi filtrati dai criteri, se non è attiva
    // l'opzione 'mostra solo i selezionati'
    var r = this.isSeguiMezzo ||
    (!this.onlySelected && (this.gestioneFiltriService.posizioneMezzoSelezionata(this.posizioneMezzo)));
    return r;
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


  private seguiMezzo() { 
    if (this.isSeguiMezzo) {
      this.mezzoDaSeguire.emit([this.posizioneMezzo, "rimuovi"] );
    }
    else {
      this.mezzoDaSeguire.emit([this.posizioneMezzo, "aggiungi"] );
    }
  }

}
