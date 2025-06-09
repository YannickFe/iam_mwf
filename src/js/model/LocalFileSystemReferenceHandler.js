const fsRoot = 'myapp_data';
const fsPrefix = 'opfs://';

let instance;

export class LocalFileSystemReferenceHandler {

    rootDirectoryHandle;

    constructor( rootDirectoryHandle ) {
        this.rootDirectoryHandle = rootDirectoryHandle;
    }

    // the lfs access must not be done once loading the module
    static async getInstance() {
        if ( instance ) {
            return instance;
        }

        const lfsRoot = await navigator.storage.getDirectory();
        console.log( 'lfsRoot: ', lfsRoot );

        // create a folder for the images in the root if it does not exist so far
        const directoryHandle = await lfsRoot.getDirectoryHandle( fsRoot, {
            create: true,
        } );

        instance = new LocalFileSystemReferenceHandler( directoryHandle );
        return instance;
    }

    // takes filedata and creates a (proprietary) url to it
    async createLocalFileSystemReference( filedata ) {

        // use the name of the file
        const filename = filedata.name.replaceAll( ' ', '_' );
        // get a handle for writing the filedata
        const fileHandle = await this.rootDirectoryHandle.getFileHandle(
            filename,
            { create: true },
        );

        // write the filedata
        const fileContentStream = await fileHandle.createWritable();
        await fileContentStream.write( filedata );
        await fileContentStream.close();

        console.log( 'LocalFileSystemReferenceHandler.stored: ', filename );

        // return a url pointing to the filedata
        return fsPrefix + filename;
    }

    // resolves a proprietary url to an object url
    async resolveLocalFileSystemReference( fileurl ) {
        if ( !fileurl.startsWith( fsPrefix ) ) {
            return fileurl;
        }
        // determine the filename
        const filename = fileurl.substring( fsPrefix.length );

        // try to access the file content
        const retrievedFileContentHandle = await this.rootDirectoryHandle.getFileHandle( filename );
        const retrievedFileData = await retrievedFileContentHandle.getFile();

        console.log( 'retrievedFileData is: ', retrievedFileData );

        const retrievedFileObjectUrl = URL.createObjectURL( retrievedFileData );

        console.log( 'LocalFileSystemReferenceHandler.resolved: ', fileurl, retrievedFileObjectUrl );

        return retrievedFileObjectUrl;
    }

}


