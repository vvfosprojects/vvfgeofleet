export class Opzioni {

    private centerOnLast: boolean ;
    private centerOnMezzo: boolean ;
    private isSeguiMezzo: boolean ;
    private onlyMap: boolean ;
    private ggMaxPos: number ;
    private startLat: number ;
    private startLon: number ;
    private startZoom: number ;
    private modalita: number ;
    private userLat: number ;
    private userLon: number ;

    constructor() {
      this.reset();
    }    

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


    public getCenterOnLast() : boolean { return this.centerOnLast;}
    public setCenterOnLast(value : boolean): void { 
      this.centerOnLast = value; 
    }
  
    public getCenterOnMezzo() : boolean { return this.centerOnMezzo;}
    public setCenterOnMezzo(value : boolean): void { 
      this.centerOnMezzo = value; 
    }
    
    public getIsSeguiMezzo() : boolean { return this.isSeguiMezzo;}
    public setIsSeguiMezzo(value : boolean): void { 
      this.isSeguiMezzo = value; 
    }
  
    public getOnlyMap() : boolean { return this.onlyMap;}
    public setOnlyMap(value : boolean): void { 
      this.onlyMap = value; 
    }
  
    public getGgMaxPos() : number { return this.ggMaxPos;}
    public setGgMaxPos(value : number): void { 
      this.ggMaxPos = value; 
    }
    
    public getStartLat() : number { return this.startLat;}
    public setStartLat(value : number): void { 
      this.startLat = value; 
    }
  
    public getStartLon() : number { return this.startLon;}
    public setStartLon(value : number): void { 
      this.startLon = value; 
    }
  
    public getUserLat() : number { return this.userLat;}
    public setUsertLat(value : number): void { 
      this.userLat = value; 
    }
  
    public getUserLon() : number { return this.userLon;}
    public setUserLon(value : number): void { 
      this.userLon = value; 
    }
  
    public getStartZoom() : number { return this.startZoom;}
    public setStartZoom(value : number): void { 
      this.startZoom = value; 
    }
  
    public getModalita() : number { return this.modalita;}
    public setModalita(value : number): void { 
      this.modalita = value; 
    }
        
}
