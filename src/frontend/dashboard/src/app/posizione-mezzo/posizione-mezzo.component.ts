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
  @Output() mezzoSelezionato = new EventEmitter<PosizioneMezzo>();
  private currentItem: PosizioneMezzo;
    
  private badgeStatoMezzoCorrente: any ;
  private testoStatoMezzoCorrente: any ;
  private defStatoMezzoCorrente: any ;
  private defStatiMezzo: any ;
  private mapAlert: any ;

  private sedeMezzoCorrente: string ;


  constructor() { }

  ngOnInit() {

    //['4',['rientrato','badge-info']],
    //['5',['istituto','badge-warning']],
    //['6',['radio','badge-secondary']],

    this.defStatiMezzo = [
      ['0',['sconosciuto','badge-light']],
      ['1',['in viaggio','badge-danger']],
      ['2',['sul posto','badge-primary']],
      ['3',['in rientro','badge-success']],
      ['4',['rientrato','badge-secondary']],
      ['5',['istituto','badge-istituto']],
      ['6',['radio','badge-radio']],
      ['7',['ultima','badge-fuori-servizio']],      
    ]    ;    

    this.mapAlert = new Map(this.defStatiMezzo);        

    this.defStatoMezzoCorrente = this.mapAlert.get(this.posizioneMezzo.infoSO115.stato);
    /*    
    if (this.posizioneMezzo.infoSO115 != null) {
      this.defStatoMezzoCorrente = this.mapAlert.get(this.posizioneMezzo.infoSO115.stato);
    } else 
    {
      this.defStatoMezzoCorrente = this.mapAlert.get('0');
    }
    */
    
    this.badgeStatoMezzoCorrente = this.defStatoMezzoCorrente[1];
    this.testoStatoMezzoCorrente = this.defStatoMezzoCorrente[0];
    //console.log(this.badgeStatoMezzoCorrente);
    
  }

  ngOnChanges() {
    //console.log('posizioneMezzoSelezionata ' ,this.filtriStatiMezzo);
  }

  sedeMezzo() {
    this.sedeMezzoCorrente = this.posizioneMezzo.classiMezzo.
      find( i =>  i.substr(0,5) == "PROV:");

    this.sedeMezzoCorrente = this.sedeMezzoCorrente.substr(5,2) ;

    return this.sedeMezzoCorrente;
  }

  posizioneMezzoSelezionata() { 
      return this.filtriStatiMezzo.
      some(filtro => filtro === this.posizioneMezzo.infoSO115.stato);    
  }

  private mouseIn() {
    this.currentItem = this.posizioneMezzo;
    //console.log('mouseIn', this.currentItem, this.posizioneMezzo);
  }

  private mouseOut() {
    this.currentItem = null;    
    //console.log('mouseOut', this.currentItem, this.posizioneMezzo);
  }

  private centerOnMap() {
    this.mezzoSelezionato.emit(this.posizioneMezzo );
    //console.log('mouseOut', this.currentItem, this.posizioneMezzo);
  }

}
