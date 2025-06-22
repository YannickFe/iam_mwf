import { GenericDialogTemplateViewController } from 'vfh-iam-mwf-base';

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

        // handing the edit form submission
        this.viewProxy.bindAction("submitForm", (event) => {
            event.original.preventDefault();

            // create or update depending on status created
            if (mediaItem.created ) {
                mediaItem.update();
            } else {
                mediaItem.create();
            }

            // hide the dialog when form is submitted
            this.hideDialog();
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
                const fileReader = new FileReader();

                fileReader.readAsDataURL(file);

                fileReader.onload = (event) => {
                    mediaItem.src = event.target.result;

                    // set the mediaItem title to the file name if not set
                    if ( !mediaItem.title ) {
                        // TODO: figure out weird bug - mediaItem title is only being set to the file name the first time when aborting after by clicking outside the dialog
                        mediaItem.title = file.name.replace(/\.[^/.]+$/, "");
                        this.root.querySelector('input[name="title"]').value = mediaItem.title
                    }

                    this.root.querySelector("#previewImg").src = event.target.result;
                }
            }
        })
    }
}