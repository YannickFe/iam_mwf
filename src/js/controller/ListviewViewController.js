/**
 * @author Jörn Kreutel
 */
import { mwf } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';

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


    deleteItem( item ) {
        item.delete();
    }

    updateItem( item ) {
        item.update();
    }

    editItem( item ) {
        this.showDialog( 'mediaItemDialog', {
            item: item,
            actionBindings: {
                submitForm: ( ( event ) => {
                    event.original.preventDefault();
                    this.updateItem( item );
                    this.hideDialog();
                } ),
            },
            deleteItem: ( ( event ) => {
                this.deleteItem( item );
                this.hideDialog();
            } ),
        } );
    }

    createNewItem() {
        var newItem = new entities.MediaItem( '', 'https://picsum.photos/100/100' );

        this.showDialog( 'mediaItemDialog', {
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
