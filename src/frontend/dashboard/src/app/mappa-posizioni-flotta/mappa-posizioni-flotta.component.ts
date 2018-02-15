import { Component, OnInit, Input } from '@angular/core';
import { PosizioneMezzo } from '../posizione-mezzo/posizione-mezzo.model';
import { MouseEvent } from '@agm/core';
import * as moment from 'moment';

@Component({
  selector: 'app-mappa-posizioni-flotta',
  templateUrl: './mappa-posizioni-flotta.component.html',
  styleUrls: ['./mappa-posizioni-flotta.component.css']
})

export class MappaPosizioniFlottaComponent implements OnInit {
  
  @Input() elencoPosizioni : PosizioneMezzo[];
 
  //lat: number = 51.678418;
  //lon: number = 7.809007;
  start_lat: number = 41.889777;
  start_lon: number = 12.490689;
  
  clicked_label: string;

  private iconaStatoMezzoCorrente: any ;
  private iconeStati: any ;
  private mapIcone: any ;
  
  constructor() { }

  ngOnInit() {

       //['6','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png']

    this.iconeStati = [
      ['0','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_black.png'],
      ['1','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_green.png'],
      ['2','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png'],
      ['3','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png'],
      ['4','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png'],
      ['5','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_yellow.png'],
      ['6','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png'],
      ['7','http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png']
    ]    ;    
    this.mapIcone = new Map(this.iconeStati);    

  }

  markerIconUrl(stato: number) {
    this.iconaStatoMezzoCorrente = this.mapIcone.get(stato);
    return this.iconaStatoMezzoCorrente;
  }

  clickedMarker(label: string, index: number) {
    this.clicked_label = this.elencoPosizioni[index].codiceMezzo;
    console.log(`clicked the marker: ${label || index}`)
  }
  
}
