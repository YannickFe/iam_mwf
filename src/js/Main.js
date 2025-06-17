/**
 * this imports the application classes that will be dynamically loaded
 * by the framework at runtime and "exports" them to the framework
 * setting the mwf.app.components object
 */
import { mwf } from 'vfh-iam-mwf-base';
import { GenericDialogTemplateViewController } from 'vfh-iam-mwf-base';

/* application libraries: the main application class */
import MyApplication from './MyApplication.js';
/* application libraries: model */
import * as entities from './model/MyEntities.js';
/* application libraries: view controllers */
import MyInitialViewController from './controller/MyInitialViewController.js';
import ListviewViewController from './controller/ListviewViewController';
import ReadviewViewController from './controller/ReadviewViewController';
import EditDialogViewController from './controller/EditDialogViewController';
// TODO-REPEATED: import any further view controllers here

// we export the framework modules required by the application and the application modules required by the framework
mwf.app.components = {
    /* we need to provide the generic view controller as part of the classes that will be dynamically instantiated by the framework */
    GenericDialogTemplateViewController,
    /* application modules */
    MyApplication,
    MyInitialViewController,
    ListviewViewController,
    ReadviewViewController,
    EditDialogViewController,
    // TODO-REPEATED: export any further view controllers here
};

// then start the application
window.onload = () => {
    mwf.onloadApplication();
};


