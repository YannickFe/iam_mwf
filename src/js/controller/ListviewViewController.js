import { mwf } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';

export default class ListviewViewController extends mwf.ViewController {

    root;

    constructor() {
        super();
        console.log('ListviewViewController()');
    }

    async oncreate() {
        this.addNewMediaItemElement = this.root.querySelector('#addNewMediaItem');
        this.addNewMediaItemElement.onclick = () => this.createEditItem();

        const items = await entities.MediaItem.readAll();

        for (const item of items) {
            item.src = await item.getResolvedSrc();
        }

        this.initialiseListview(items);

        this.addListener(new mwf.EventMatcher("crud", "created", "MediaItem"), async (event) => {
            // resolve the lfsr only if it's used (might be remote, so wir wollen die remote url in src nicht überschreiben)
            event.data.src = await event.data.getResolvedSrc();
            this.addToListview(event.data);
        });
        this.addListener(new mwf.EventMatcher("crud", "updated", "MediaItem"),  async (event) => {
            // resolve the lfsr only if it's used (might be remote, so wir wollen die remote url in src nicht überschreiben)
            event.data.src = await event.data.getResolvedSrc();
            this.updateInListview(event.data._id, event.data);
        });
        this.addListener(new mwf.EventMatcher("crud", "deleted", "MediaItem"), (event) => {
            this.removeFromListview(event.data);
        });

        super.oncreate();
    }

    deleteItem(item) {
        this.showDialog( 'deleteDialog', {
            item: item,
            actionBindings: {
                cancelDelete: () => this.hideDialog(),
                doDelete: () => {
                    item.delete();
                    this.hideDialog();
                },
            },
        })
    }

     createEditItem(item = false) {
        if ( !item ) {
            item = new entities.MediaItem('', '');
        }

        this.showDialog('createEditDialog', {
            item: item,
            actionBindings: {

                //////////////////////////////////////////
                submitForm: async ( event ) => {
                    event.original.preventDefault();

                    if (item.file) {
                        if (!item.remote) {
                            await item.setLocalFile();
                        } else {
                            await item.setRemoteFile();
                        }
                    }

                    if (item.created) {
                        item.update();
                    } else {
                        item.create();
                    }

                    await this.hideDialog();
                },

                //////////////////////////////////////////
                deleteItem: ( event ) => {
                    this.hideDialog();
                    this.deleteItem( item );
                },

                //////////////////////////////////////////
                fileSelected: ( event ) => {
                    const file = event.original.target.files[ 0 ];

                    if ( file ) {
                        item.file = file;
                        item.src = URL.createObjectURL( file );

                        if ( !item.title ) {
                            item.title = file.name.replace( /\.[^/.]+$/, '' );
                        }

                        this.dialog.viewProxy.update( { item: item } );
                    }
                },
            }
        });
    }
}
