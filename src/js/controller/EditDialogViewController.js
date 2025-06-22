import { GenericDialogTemplateViewController } from 'vfh-iam-mwf-base';
import { LocalFileSystemReferenceHandler } from '../model/LocalFileSystemReferenceHandler';

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

            // create custom lfs url from file blob
            if ( mediaItem.file ) {
                const lfsUrl = await lfsReader.createLocalFileSystemReference( mediaItem.file );
                // instantly resolve it again so the item will be displayed correctly uppon returning to ListView
                mediaItem.src = await lfsReader.resolveLocalFileSystemReference( lfsUrl );
                delete mediaItem.file;
            }

            // validate input
            if ( !mediaItem.title || !mediaItem.src ) {
                this.viewProxy.update({ error: ": Eingabe erfoderlich!"});
                return;
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
            mediaItem.delete();
            this.hideDialog();
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
                    // TODO: figure out weird bug - mediaItem title is only being set to the file name the first time when aborting after by clicking outside the dialog
                    mediaItem.title = file.name.replace(/\.[^/.]+$/, "");
                }

                // update the mediaItem in the view
                this.viewProxy.update({ item: mediaItem});
            }
        })
    }
}