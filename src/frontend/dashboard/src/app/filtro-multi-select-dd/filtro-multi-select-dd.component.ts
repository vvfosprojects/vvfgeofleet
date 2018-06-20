import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//import { UiSwitchModule } from 'angular2-ui-switch';
//import { Filtri } from './filtri.model';
import { VoceFiltro } from "../filtri/voce-filtro.model";

import { MultiSelectModule } from 'primeng/multiselect';
import { SelectItem } from 'primeng/components/common/selectitem';
/*
import  {ButtonModule } from 'primeng/button';
import  { PanelModule} from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';                 //api
*/

@Component({
  selector: 'app-filtro-multi-select-dd',
  templateUrl: './filtro-multi-select-dd.component.html',
  styleUrls: ['./filtro-multi-select-dd.component.css']
})

export class FiltroMultiSelectDdComponent implements OnInit {
  @Input() titolo: string;
  @Input() vociFiltro: VoceFiltro[];
  @Output() nuovaSelezione: EventEmitter<Object[]> = new EventEmitter();
  
  enable: boolean = true;
  
  vociFiltroDD: SelectItem[];
  vociFiltroDDSelezionate: String[];

  constructor() { 

    //this.vociFiltro.forEach(element => { this.vociFiltroDD.add(

  
  }

  ngOnInit() {
    this.vociFiltroDD = this.vociFiltro.map( 
      (item: VoceFiltro) => 
        { return Object.assign({}, {label: item.descrizione, value: item.codice.toString() }) 
      });    
      
      /*
      this.vociFiltroDDSelezionate = this.vociFiltro.map( 
        (item: VoceFiltro) => 
          { return item.codice.toString() } ) ;    
      */
     this.vociFiltroDDSelezionate = this.vociFiltro.filter(v => v.selezionato).map( 
      (item: VoceFiltro) => 
        { return item.codice.toString() } ) ;

    }


  ngOnChanges() {
      this.vociFiltroDD = this.vociFiltro.map( 
        (item: VoceFiltro) => 
          { return Object.assign({}, {label: item.descrizione, value: item.codice.toString() }) 
        });    
        
        /*
        this.vociFiltroDDSelezionate = this.vociFiltro.map( 
          (item: VoceFiltro) => 
            { return item.codice.toString() } ) ;    
        */
       this.vociFiltroDDSelezionate = this.vociFiltro.filter(v => v.selezionato).map( 
        (item: VoceFiltro) => 
          { return item.codice.toString() } ) ;
  
      }
      

  public selezione(event, elenco) {
    //console.log('event: ', event, elenco);

    
    this.vociFiltro.forEach( v => {
        v.selezionato = false;
      }
    );

    elenco.forEach( v => {
        this.vociFiltro.find(vf => vf.codice.toString() === v.toString()).selezionato = true;
      }
    );
    this.nuovaSelezione.emit(
      this.vociFiltro
        .filter(v => v.selezionato)
        .map(v => v.codice)
    );
}

}
