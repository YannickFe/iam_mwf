import { GenericDialogTemplateViewController } from 'vfh-iam-mwf-base';
import { LocalFileSystemReferenceHandler } from '../model/LocalFileSystemReferenceHandler';

const apiBaseUrl = 'http://localhost:7077'

export default class EditDialogViewController extends GenericDialogTemplateViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    viewProxy;

    constructor() {
        super();
    }

    async oncreate() {
        console.log( "EditDialogViewController.oncreate(): ", this.args, this.root );
        await super.oncreate();

        // get mediaItem and set the viewProxy
        var mediaItem = this.args.item;
        this.viewProxy = this.bindElement("editDialog",{item: mediaItem},this.root).viewProxy;

        const lfsReader = await LocalFileSystemReferenceHandler.getInstance();

        // handing the edit form submission
        this.viewProxy.bindAction("submitForm", async (event) => {
            event.original.preventDefault();

            if ( mediaItem.file ) {
                if ( !mediaItem.remote ) {

                    // create custom lfs url from file blob
                    const lfsUrl = await lfsReader.createLocalFileSystemReference( mediaItem.file );
                    // instantly resolve it again so the item will be displayed correctly uppon returning to ListView
                    mediaItem.src = await lfsReader.resolveLocalFileSystemReference( lfsUrl );
                    delete mediaItem.file;
                } else {
                    // remote saving
                    try {
                        const formData = new FormData();
                        formData.append( 'filedata', mediaItem.file );

                        const response = await fetch( `${ apiBaseUrl }/api/upload`, {
                            method: 'POST',
                            body: formData
                        } );

                        if ( !response.ok ) {
                            throw new Error( 'Upload fehlgeschlagen' );
                        }

                        const result = await response.json();
                        console.log( 'Upload erfolgreich:', result );
                        // https://github.com/dieschnittstelle/org.dieschnittstelle.iam.mwf.api
                        // since we put the file to 'filedata' the path is returned at result.data.filedata
                        // here is an actual result object as reference:
                        //     {
                        //         "data": {
                        //             "contentType": "image/jpeg",
                        //             "filedata": "content/img/1750629149187_300_100.jpeg"
                        //          }
                        //     }
                        mediaItem.src = `${ apiBaseUrl }/${ result.data.filedata }`;
                        delete mediaItem.file;
                    } catch ( error ) {
                        console.error( 'Upload Fehler:', error );
                        this.viewProxy.update( { error: ": Upload fehlgeschlagen!" } );
                        return;
                    }
                }
            }

            // create or update depending on status created
            if (mediaItem.created ) {
                mediaItem.update();
            } else {
                mediaItem.create();
            }

            // hide the dialog when form is submitted
            await this.hideDialog();
        });

        // handle the forms delete button
        this.viewProxy.bindAction("deleteItem", (event) => {
            this.hideDialog();

            // TODO: figure out weird bug - delete only works the first time
            this.showDialog( 'deleteDialog', {
                item: mediaItem,
                actionBindings: {
                    cancelDelete: ( ( event ) => {
                        this.hideDialog();
                    } ),
                    doDelete: ( ( event ) => {
                        mediaItem.delete();
                        this.hideDialog();
                    })
                },
            });
        });

        // handling the file input
        this.viewProxy.bindAction("fileSelected",(event) => {
            const file = event.original.target.files[0];

            // check if a file was selected
            if (file) {
                mediaItem.file = file;
                mediaItem.src = URL.createObjectURL(file);

                // set the mediaItem title to the file name if not set
                if ( !mediaItem.title ) {
                    // TODO: figure out weird bug - mediaItem title is only being set to the file name the first time
                    mediaItem.title = file.name.replace(/\.[^/.]+$/, "");
                }

                // update the mediaItem in the view
                this.viewProxy.update({ item: mediaItem});
            }
        })

        // handling remote
        this.viewProxy.bindAction("toggleRemote",(event) => {
            event.original.preventDefault();

            mediaItem.remote = !mediaItem.remote;
            this.viewProxy.update({ item: mediaItem});
        });
    }
}