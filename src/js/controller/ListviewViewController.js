/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    // args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller

    items;
    addNewMediaItemElement;

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = () => {
            this.addToListview(
                new entities.MediaItem("m new", "https://picsum.photos/100/100")
            )
        }


        this.initialiseListview(this.items);

        // call the superclass once creation is done
        super.oncreate();
    }


    constructor() {
        super();
        console.log("ListviewViewController()");

        this.items = [
            new entities.MediaItem("m1","https://picsum.photos/100/100"),
            new entities.MediaItem("m2","https://picsum.photos/200/150"),
            new entities.MediaItem("m3","https://picsum.photos/150/200"),
        ];    }

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    bindListItemView(listviewid, itemview, itemobj) {
        // TODO: implement how attributes of itemobj shall be displayed in itemview
        itemview.root.getElementsByTagName("img")[0].src = itemobj.src;
        itemview.root.getElementsByTagName("h2")[0].textContent = itemobj.title;
        itemview.root.getElementsByTagName("h3")[0].textContent = itemobj.added;
    }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
        alert("Element " + itemobj.title + " wurde ausgewählt!");
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

}
