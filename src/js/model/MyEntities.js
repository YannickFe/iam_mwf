/**
 * @author Jörn Kreutel
 *
 * this skript defines the data types used by the application and the model operations for handling instances of the latter
 */

import { EntityManager } from 'vfh-iam-mwf-base';
import { LocalFileSystemReferenceHandler } from './LocalFileSystemReferenceHandler';
import exifr from 'exifr'; // in contrast to exifreader this library supports easy GPS data extraction

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

    get latlngDisplayValue() {
        if ( !this.latlng ) {
            return 'Standort unbekannt';
        }
        return `Lat: ${this.latlng.latitude}, Lng: ${this.latlng.longitude}`;
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

        this.setLocationFromFile();

        const lfsReader = await LocalFileSystemReferenceHandler.getInstance();
        this.lfsr = await lfsReader.createLocalFileSystemReference(this.file);

        delete this.file;
    }

    async setRemoteFile() {
        if (!this.file) {
            throw new Error('No file selected');
        }

        this.setLocationFromFile();

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

    setLocationFromFile() {
        if (!this.file) {
            throw new Error('No file selected');
        }

        exifr.gps(this.file).then((coords) => {
            // handle default gps data if no GPS data is available
            if (!coords) {
                // use default location if no GPS data is available as required by the task
                coords = { latitude: 52.512764, longitude: 13.453245 }; // (Berlin coordinates)
            }

            // validate coordinates
            if (!this.constructor._isLatlngValid(coords)) {
                throw new Error('Invalid coordinates');
            }

            this.latlng = coords;
        });

    }
    isLatlngValid() {
        return this.constructor._isLatlngValid(this.latlng);
    }
    static _isLatlngValid( latlng ) {
        return latlng &&
                 typeof latlng.latitude === 'number' &&
                 typeof latlng.longitude === 'number';
    }
}
