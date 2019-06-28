export class Opzioni {

    // opzioni modificabili direttamente dal pannello Opzioni
    public centerOnLast: boolean ;
    public centerOnSelected: boolean ;
    public onlySelected: boolean ;
    public onlyMap: boolean ;
    public ggMaxPos: number ;

    //
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
        this.centerOnLast = true; 
        this.centerOnSelected = false;
        this.onlySelected = false;
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
      this.setCenterOnSelected(obj.getCenterOnSelected());
      this.setGgMaxPos(obj.getGgMaxPos());
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
  

    public getCenterOnSelected() : boolean { return this.centerOnSelected;}
    public setCenterOnSelected(value : boolean): void { 
      this.centerOnSelected = value; 
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
