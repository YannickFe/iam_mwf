import {GenericDialogTemplateViewController} from "vfh-iam-mwf-base";

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
        var dialog = this.args.dialog;
        this.viewProxy = this.bindElement("mediaItemDialog",{item: mediaItem},this.root).viewProxy;

        // submit is handled by ListviewViewController::editItem / createItem

        this.viewProxy.bindAction("fileSelected",(event) => {
            // check if a file was selected
            if (event.original.target.files[0]) {
                const fileReader = new FileReader();

                console.log("fileSelected: ", event.original.target.files[0]);

                fileReader.readAsDataURL(event.original.target.files[0]);

                fileReader.onload = (event) => {
                    mediaItem.src = event.target.result;

                    this.root.querySelector("#previewImg").src = event.target.result;
                }
            }
        })
    }

    async onresume() {
        console.log( "EditDialogViewController.onresume(): ", this.args, this.root );
        await super.onresume();
    }
}