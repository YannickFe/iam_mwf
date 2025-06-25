/**
 * @author Jörn Kreutel
 */
import { mwf } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';

export default class ReadviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    viewProxy;

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        var mediaItem = this.args.item;
        mediaItem.src = await mediaItem.getResolvedSrc();
        this.viewProxy = this.bindElement("readViewTemplate",{item: mediaItem},this.root).viewProxy;
        this.viewProxy.bindAction("deleteItem",(() => {
            this.showDialog( 'deleteDialog', {
                item: mediaItem,
                actionBindings: {
                    cancelDelete: ( ( event ) => {
                        this.hideDialog();
                    } ),
                    doDelete: ( ( event ) => {
                        this.hideDialog();
                        mediaItem.delete().then(() => {
                            this.previousView();
                        })
                    })
                },
            });
        }));

        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();

        console.log( 'ReadviewViewController()' );
    }
}
