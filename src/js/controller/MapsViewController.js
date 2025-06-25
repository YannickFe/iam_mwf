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
    // TODO-REPEATED: declare custom instance attributes for this controller

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view

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
        const leafletMapController = L.map('myapp-maproot');
        leafletMapController.setView([51.5, 8.7], 6);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo( leafletMapController );
    }
}
