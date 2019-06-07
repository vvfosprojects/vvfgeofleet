export class Opzioni {
    public centerOnLast: boolean = true;
    public centerOnMezzo: boolean = false;
    public isSeguiMezzo: boolean = true;
    public onlyMap: boolean = false;
    public ggMaxPos: number = 3;
    public startLat: number = 41.889777;
    public startLon: number = 12.490689;
    public startZoom: number = 6;
    public modalita: number = 3;

    constructor() {}    

    public reset(): void { 
        this.centerOnLast = true; 
        this.centerOnMezzo = false; 
        this.isSeguiMezzo = true; 
        this.onlyMap = false; 
        this.ggMaxPos = 3; 
        this.startLat = 41.889777; 
        this.startLon = 12.490689; 
        this.startZoom = 6; 
        this.modalita = 3; 
      }  


      public setCenterOnLast(value : boolean): void { 
        this.centerOnLast = value; 
      }
    
      public setCenterOnMezzo(value : boolean): void { 
        this.centerOnMezzo = value; 
      }
      
      public setIsSeguiMezzo(value : boolean): void { 
        this.isSeguiMezzo = value; 
      }
    
      public setOnlyMap(value : boolean): void { 
        this.onlyMap = value; 
      }
    
      public setGgMaxPos(value : number): void { 
        this.ggMaxPos = value; 
      }
      
      public setStartLat(value : number): void { 
        this.startLat = value; 
      }
    
      public setStartLon(value : number): void { 
        this.startLon = value; 
      }
    
      public setStartZoom(value : number): void { 
        this.startZoom = value; 
      }
    
      public setModalita(value : number): void { 
        this.modalita = value; 
      }
          
}
