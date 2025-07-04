/**
 * @author Jörn Kreutel
 */
import { mwf } from 'vfh-iam-mwf-base';
import { mwfUtils } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';

let leafletMapController;

export default class MapsViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    leafletMapController;
    markerMap; // map structure to hold markers by item id for later access
    // TODO-REPEATED: declare custom instance attributes for this controller

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view

        this.addListener(new mwf.EventMatcher("crud", "created", "MediaItem"), async (event) => {
            this.addMarker( event.data );
        });
        this.addListener(new mwf.EventMatcher("crud", "updated", "MediaItem"),  async (event) => {
            this.updateMarker( event.data );
        });
        this.addListener(new mwf.EventMatcher("crud", "deleted", "MediaItem"), (event) => {
            this.removeMarker( event.data );
        });

        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();

        // map structure to hold markers by item id for later access like removal
        this.markerMap = new Map();

        console.log( 'MapsViewController()' );
    }

    async onresume() {
        await super.onresume();

        // create leafletMapController and set view to frame Germany
        // singleton for leafletMapController to avoid multiple initialisations
        if ( !leafletMapController ) {
            leafletMapController = L.map('myapp-maproot');
        }

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo( leafletMapController );
        leafletMapController.setView( [51.5, 8.7], 6);


        let items = await entities.MediaItem.readAll();

        // filter out all items that do not have a valid latlng
        items = items.filter(item => {
            return item.isLatlngValid();
        });

        for( const item of items ) {
            await this.addMarker( item );
        }
        // pass all latlng of all items as array to fitBounds to frame the cords in the view
        const bounds = items.map(item => [item.latlng.latitude, item.latlng.longitude]);
        if (bounds.length > 0) { // only fit bounds if there are any - fixes error when no items exist
            leafletMapController.fitBounds(bounds);
        }
    }

    removeMarker( item ) {
        const marker = this.markerMap.get(item.id);
        if (marker) {
            marker.remove();
            this.markers.delete(item.id);
        }
    }

    updateMarker( item ) {
        this.removeMarker( item );
        this.addMarker( item );
    }

    addMarker( item ) {

        // validate item structure
        if (!item.isLatlngValid()) {
            throw new Error('Invalid coordinates');
        }

        const marker = L.marker( L.latLng(item.latlng.latitude, item.latlng.longitude));
        marker.addTo( leafletMapController );
        this.markerMap.set( item._id, marker );

        let markerPopup = this.getMarkerPopup( item );
        marker.bindPopup( markerPopup );
    }

    getMarkerPopup(item) {
        const markerPopup = document.createElement('div');

        const popupTitle = document.createElement('h3');
        popupTitle.textContent = item.title;

        const popupImage = document.createElement('img');
        item.getResolvedSrc().then( (src) => {
            popupImage.src = src;
        } );
        popupImage.classList.add('popup-image');

        markerPopup.appendChild( popupTitle );
        markerPopup.appendChild( popupImage );

        markerPopup.onclick = () => {
            this.nextView( 'readView', { item: item } );
        }

        return markerPopup;
    }
}
