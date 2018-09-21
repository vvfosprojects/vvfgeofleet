import { Directive, Output, EventEmitter, AfterViewInit, ContentChildren, QueryList } from '@angular/core';
import { GoogleMapsAPIWrapper, MarkerManager, AgmMarker } from '@agm/core';
import { AgmJsMarkerClustererModule, ClusterManager } from '@agm/js-marker-clusterer';

@Directive({
  selector: 'agm-get-map-objects',
})  

export class AgmGetMapObjectsDirective implements AfterViewInit {

  /**
   * Get native map object
   */
  private _map: any = null;
  @Output('map') mapChanged: EventEmitter<any> = new EventEmitter<any>();
  set map(val){
    this._map = val;
    this.mapChanged.emit(val);
  }
  get map(){
    return this._map;
  }

  /**
   * Get marker manager
   */
  private _markerManager: any = null;
  @Output('markerManager') markerManagerChanged: EventEmitter<MarkerManager> = new EventEmitter<MarkerManager>();
  set markerManager(val){
    this._markerManager = val;
    this.markerManagerChanged.emit(val);
  }
  get markerManager(){
    return this._markerManager;
  }

  /**
   * Get agm markers
   */
  private _markers: any = null;
  @Output('markers') markersChanged: EventEmitter<AgmMarker[]> = new EventEmitter<AgmMarker[]>();
  set markers(val){
    this._markers = val;
    this.markersChanged.emit(val);
  }
  get markers(){
    return this._markers;
  }
  
  /**
   * Get cluster manager
   */
  private _clusterManager: any = null;
  @Output('clusterManager') clusterManagerChanged: EventEmitter<ClusterManager> = new EventEmitter<ClusterManager>();
  set clusterManager(val){
    this._clusterManager = val;
    this.clusterManagerChanged.emit(val);
  }
  get clusterManager(){
    return this._clusterManager;
  }

  @ContentChildren(AgmMarker) markerChildren: QueryList<AgmMarker>;

  constructor(
    private googleMapsWrapper: GoogleMapsAPIWrapper,
    private googleMarkerManager: MarkerManager,
    private googleClusterManager: ClusterManager,
  ) { }

  ngAfterViewInit() {
    // get native map
    this.googleMapsWrapper.getNativeMap().then(map => {
      this.map = map;
    }, error => {
      throw error;
    })

    // get marker manager
    this.markerManager = this.googleMarkerManager;
    //console.log("ngAfterViewInit: ", this.markerManager);
    
    // get markers
    this.markerChildren.changes.subscribe(markers => {
      this.markers = markers._results;
    })

    // get cluster manager
    this.clusterManager = this.googleClusterManager
    //console.log("ngAfterViewInit: ", this.markerManager);
    
  }
}
