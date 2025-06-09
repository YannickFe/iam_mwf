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
        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();
        console.log( 'ListviewViewController()' );
    }


    deleteItem( item ) {
        item.delete(() => {
            this.removeFromListview(item._id);
        });
    }

    editItem( item ) {
        this.showDialog( 'mediaItemDialog', {
            item: item,
            actionBindings: {
                submitForm: ( ( event ) => {
                    event.original.preventDefault();
                    item.update().then( () => {
                        this.updateInListview( item._id, item );
                    } );
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
                    newItem.create().then( () => {
                        this.addToListview( newItem );
                    } );
                    this.hideDialog();
                } ),
            },
        } );
    }

    async onReturnFromNextView(nextviewid,returnValue,returnStatus)
    {
        if (nextviewid === "mediaReadview" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        }
    }
}
