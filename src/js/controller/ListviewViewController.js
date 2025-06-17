/**
 * @author Jörn Kreutel
 */
import { mwf } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';
import EditDialogViewController from './EditDialogViewController';

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    // args;
    root;

    addNewMediaItemElement;

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        this.addNewMediaItemElement = this.root.querySelector( '#addNewMediaItem' );
        this.addNewMediaItemElement.onclick = () => {
            this.createNewItem();
        };

        entities.MediaItem.readAll().then( ( items ) => {
            this.initialiseListview( items );
        } );

        this.addListener(new mwf.EventMatcher("crud","created","MediaItem"),((event) => {
            this.addToListview(event.data);
        }));
        this.addListener(new mwf.EventMatcher("crud","updated","MediaItem"),((event) => {
            this.updateInListview(event.data._id,event.data);
        }));
        this.addListener(new mwf.EventMatcher("crud","deleted","MediaItem"),((event) => {
            this.removeFromListview(event.data);
        }));
        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();
        console.log( 'ListviewViewController()' );
    }

    // used in on-click of delete Button
    deleteItem( item ) {
        item.delete();
    }

    editItem( item ) {
        // TODO: check how handleDialogWithController might work
        this.showDialog( 'editDialog', {
            item: item,
        } );
    }

    createNewItem() {
        var newItem = new entities.MediaItem( '', 'https://picsum.photos/100/100' );

        this.showDialog( 'editDialog', {
            item: newItem,
            actionBindings: {
                submitForm: ( ( event ) => {
                    event.original.preventDefault();
                    newItem.create();
                    this.hideDialog();
                } ),
            },
        } );
    }
}
