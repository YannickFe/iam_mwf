/**
 * @author Jörn Kreutel
 */
import { mwf } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';
import { GenericCRUDImplLocal } from 'vfh-iam-mwf-base';

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    // args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller

    addNewMediaItemElement;

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement = this.root.querySelector( '#addNewMediaItem' );
        this.addNewMediaItemElement.onclick = () => {
            this.createNewItem()
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


    /*
     * for views with listviews: react to the selection of a listitem
     */
    onListItemSelected( itemobj, listviewid ) {
        // TODO: implement how selection of itemobj shall be handled
        alert( 'Element ' + itemobj.title + itemobj._id + ' wurde ausgewählt!' );
    }

    deleteItem( item ) {
        item.delete().then( () => {
            this.removeFromListview( item._id );
        } );
    }

    editItem( item ) {
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    item.update().then(() => {
                        this.updateInListview(item._id,item);
                    });
                    this.hideDialog();
                })
            },
            deleteItem: ((event) => {
                this.deleteItem(item);
                this.hideDialog();
            })
        });
    }

    createNewItem() {
        var newItem = new entities.MediaItem('','https://picsum.photos/100/100');

        this.showDialog('mediaItemDialog',{
            item: newItem,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    newItem.create().then(() => {
                        this.addToListview(newItem);
                    });
                    this.hideDialog();
                })
            }
        });
    }
}
