/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";
import {GenericCRUDImplLocal} from "vfh-iam-mwf-base";

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
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = () => {
            this.crudops.create(
                new entities.MediaItem("m", "https://picsum.photos/100/100")
            ).then((createdM) => {
                this.addToListview(createdM)
            })
        }


        this.crudops.readAll().then((items) => {
            this.initialiseListview(items);
        });
        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();
        console.log("ListviewViewController()");

        this.crudops = GenericCRUDImplLocal.newInstance("MediaItem");
    }


    /*
     * for views with listviews: react to the selection of a listitem
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
        alert("Element " + itemobj.title + itemobj._id + " wurde ausgewählt!");
    }
}
