/**
 * @author Jörn Kreutel
 *
 * this skript defines the data types used by the application and the model operations for handling instances of the latter
 */

import { EntityManager } from 'vfh-iam-mwf-base';
import { LocalFileSystemReferenceHandler } from './LocalFileSystemReferenceHandler';

const apiBaseUrl = 'http://localhost:7077';


/*************
 * example entity
 *************/

export class MyEntity extends EntityManager.Entity {

    // TODO-REPEATED: declare entity instance attributes

    constructor() {
        super();
    }

}

// TODO-REPEATED: add new entity class declarations here
export class MediaItem extends EntityManager.Entity {
    title;
    remote;
    latlng;
    lfsr;
    src;
    contentType;
    added = Date.now();
    description = '';

    constructor( title, src, contentType ) {
        super();
        this.title = title;
        this.src = src;
        this.contentType = contentType;
    }

    get addedDateString() {
        return ( new Date( this.added ) ).toLocaleDateString();
    }

    get mediaType() {
        if ( !this.contentType ) {
            return 'UNKNOWN';
        }
        const [ type, subtype ] = this.contentType.split( '/' );

        return type || 'UNKNOWN';
    }

    get remoteDisplayValue() {
        return this.remote ? 'Remote' : 'Lokal';
    }

    async getResolvedSrc() {
        if (!this.remote) {
            const lfsReader = await LocalFileSystemReferenceHandler.getInstance();
            return await lfsReader.resolveLocalFileSystemReference(this.lfsr);
        } else {
            return this.src;
        }
    }

    async setLocalFile() {
        if (!this.file) {
            throw new Error('No file selected');
        }
        const lfsReader = await LocalFileSystemReferenceHandler.getInstance();
        this.lfsr = await lfsReader.createLocalFileSystemReference(this.file);

        delete this.file;
    }

    async setRemoteFile() {
        if (!this.file) {
            throw new Error('No file selected');
        }

        const formData = new FormData();
        formData.append('filedata', this.file);

        const response = await fetch(`${apiBaseUrl}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Upload failed'); // TODO: better handling of failed upload

        const result = await response.json();
        this.src = `${apiBaseUrl}/${result.data.filedata}`;

        delete this.file;

    }
}
