/**
 * @author Jörn Kreutel
 */
import { mwf } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';

export default class ViewControllerTemplate extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    viewProxy;

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        var mediaItem = this.args.item;
        this.viewProxy = this.bindElement("mediaReadviewTemplate",{item: mediaItem},this.root).viewProxy;
        this.viewProxy.bindAction("deleteItem",(() => {
            mediaItem.delete().then(() => {
                this.previousView();
            })
        }));

        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();

        console.log( 'ViewControllerTemplate()' );
    }
}
