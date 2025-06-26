/**
 * @author Jörn Kreutel
 */
import { mwf } from 'vfh-iam-mwf-base';
import { mwfUtils } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';

export default class MapsViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    leafletMapController;
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

        console.log( 'MapsViewController()' );
    }

    async onresume() {
        await super.onresume();

        // create leafletMapController and set view to frame Germany
        this.leafletMapController = L.map('myapp-maproot');
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo( this.leafletMapController );
        // this.leafletMapController.setView( [51.5, 8.7], 6);


        const items = await entities.MediaItem.readAll();

        // genereate random latlng coords in germany for each item to test: //TODO: remove
        for (const item of items) {
            item.latlng = {
                lat: 51.5 + Math.random(),
                lng: 8.7 + Math.random(),
            };
        }

        for( const item of items ) {
            await this.addMarker( item );
        }
        // pass all latlng of all items as array to fitBounds to frame the cords in the view
        const bounds = items.map(item => [item.latlng.lat, item.latlng.lng]);
        if (bounds.length > 0) { // only fit bounds if there are any - fixes error when no items exist
            this.leafletMapController.fitBounds(bounds);
        }
    }

    async removeMarker( item ) {
        this.leafletMapController.removeMarker( item.latlng );
    }

    async updateMarker( item ) {
        this.removeMarker( item ).then( () => this.addMarker( item ))
    }

    async addMarker( item ) {
        const marker = L.marker( item.latlng );
        marker.addTo( this.leafletMapController );

        this.getMarkerPopup( item ).then((markerPopup) => {
            marker.bindPopup( markerPopup );
        })
    }

    async getMarkerPopup(item) {
        const markerPopup = document.createElement('div');

        const popupTitle = document.createElement('h3');
        popupTitle.textContent = item.title;

        const popupImage = document.createElement('img');
        popupImage.src = await item.getResolvedSrc();
        popupImage.classList.add('popup-image');

        markerPopup.appendChild( popupTitle );
        markerPopup.appendChild( popupImage );

        markerPopup.onclick = () => {
            this.nextView( 'readView', { item: item } );
        }

        return markerPopup;
    }
}
