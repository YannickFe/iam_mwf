import { mwf } from 'vfh-iam-mwf-base';
import * as entities from '../model/MyEntities.js';
import { LocalFileSystemReferenceHandler } from '../model/LocalFileSystemReferenceHandler';

const apiBaseUrl = 'http://localhost:7077';

export default class ListviewViewController extends mwf.ViewController {

    root;

    constructor() {
        super();
        console.log('ListviewViewController()');
    }

    async oncreate() {
        this.addNewMediaItemElement = this.root.querySelector('#addNewMediaItem');
        this.addNewMediaItemElement.onclick = () => this.createEditItem();

        const lfsReader = await LocalFileSystemReferenceHandler.getInstance();
        const items = await entities.MediaItem.readAll();

        for (const item of items) {
            if ( item.lfsr ) {
                item.src = await lfsReader.resolveLocalFileSystemReference(item.lfsr);
            }
        }

        this.initialiseListview(items);

        this.addListener(new mwf.EventMatcher("crud", "created", "MediaItem"), async (event) => {
            event.data.src = await lfsReader.resolveLocalFileSystemReference(event.data.lfsr);
            this.addToListview(event.data);
        });
        this.addListener(new mwf.EventMatcher("crud", "updated", "MediaItem"),  async (event) => {
            event.data.src = await lfsReader.resolveLocalFileSystemReference(event.data.lfsr);
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
                    const lfsReader = await LocalFileSystemReferenceHandler.getInstance();

                    if (item.file) {
                        if (!item.remote) {
                            item.lfsr =  await lfsReader.createLocalFileSystemReference(item.file);
                        } else {
                            const formData = new FormData();
                            formData.append('filedata', item.file);

                            const response = await fetch(`${apiBaseUrl}/api/upload`, {
                                method: 'POST',
                                body: formData,
                            });

                                if (!response.ok) throw new Error('Upload fehlgeschlagen'); // TODO: better handling of failed upload

                            const result = await response.json();
                            item.src = `${apiBaseUrl}/${result.data.filedata}`;
                        }
                        delete item.file;
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
