export class Opzioni {

    private onlySelected: boolean ;
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

    constructor()
    constructor(obj?: Opzioni)
     {
      if (obj) {
        this.set(obj);
      }
      else
        {this.reset();}
    }    

    
    public reset(): void { 
        this.onlySelected = false;
        this.centerOnLast = true; 
        this.centerOnMezzo = false; 
        this.isSeguiMezzo = false; 
        this.onlyMap = false; 
        this.ggMaxPos = 3; 
        this.startLat = 41.889777; 
        this.startLon = 12.490689; 
        this.startZoom = 6; 
        this.modalita = 3; 
      }  

    public set(obj: Opzioni): void {       
      this.setOnlySelected(obj.getOnlySelected());
      this.setCenterOnLast(obj.getCenterOnLast());
      this.setCenterOnMezzo(obj.getCenterOnMezzo());
      this.setGgMaxPos(obj.getGgMaxPos());
      this.setIsSeguiMezzo(obj.getIsSeguiMezzo());
      this.setModalita(obj.getModalita());
      this.setOnlyMap(obj.getOnlyMap());
      this.setStartLat(obj.getStartLat());
      this.setStartLon(obj.getStartLon());
      this.setStartZoom(obj.getStartZoom());
      this.setUserLat(obj.getUserLat());
      this.setUserLon(obj.getUserLon());
    }


    public getOnlySelected() : boolean { return this.onlySelected;}
    public setOnlySelected(value : boolean): void { 
      this.onlySelected = value; 
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
    public setUserLat(value : number): void { 
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
