import { Component } from '@angular/core';
import { PosizioneMezzo } from './posizione-mezzo/posizione-mezzo.model';
import { PosizioneFlottaService } from './service-VVFGeoFleet/posizione-flotta.service';
import { PosizioneFlottaServiceFake } from './service-VVFGeoFleet/posizione-flotta.service.fake';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{ provide: PosizioneFlottaService, useClass:PosizioneFlottaService}],
  //providers: [{ provide: PosizioneFlottaService, useClass:PosizioneFlottaServiceFake}],
})

export class AppComponent {
  title = 'VVFGeoFleet Dashboard';

  private elencoPosizioniMezzo : PosizioneMezzo[] = [];


        constructor(private posizioneFlottaService: PosizioneFlottaService) { 
        }
        
        ngOnInit() { this.posizioneFlottaService.getPosizioneFlotta()
          .subscribe( posizioni => {
            console.log("posizioneFlottaService: ", posizioni);
            this.elencoPosizioniMezzo = posizioni.sort( 
              function(a,b) 
              { var bb : Date = new Date(b.istanteAcquisizione);
                var aa : Date  = new Date(a.istanteAcquisizione);
                return aa>bb ? -1 : aa<bb ? 1 : 0;
              }
            );
          });

      
        }   


}
