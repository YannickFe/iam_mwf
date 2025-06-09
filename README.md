## MWF Framework skeleton application
For educational use only. Also see LICENSE file. See the tutorial.pdf document as an introduction for application development with MWF.

Icons have been downloaded from https://fonts.google.com/ on 2024-02-17
See license conditions for icons: https://github.com/google/material-design-icons/blob/master/LICENSE
See license conditions for ractive: https://github.com/ractivejs/ractive/blob/dev/LICENSE.md

# Prerequisites
Make sure that Node.js and npm are installed; see: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

# Supported versions
The project has been built and run with the following recent versions of node and npm on Mac (x86, Big Sur) and Windows 11:
- node v22.14.0 (LTS)
- node v23.7.0
With node v22 on MacOS there were issues that could be solved by prompting npm to update two packages (see below). On Windows, these or other issues did not occur with any of the two versions.

# Install dependencies
- In the project directory, run: npm install
- If you use node v22 on MacOS, additionally run the following two commands:
  - npm update --save webpack
  - npm update --save webpack-dev-server 
  
The reported vulnerability issues refer to issues of the development tools for building the application, not to the application itself.

# Development Run
In the project directory, run: npm run serve

# Access
By default, the application is served at http://localhost:8080; in case port 8080 is not available, the serve script assigns an alternative port, which will be displayed a few lines underneath of the command. 

# Bundling for Task Submission
To create a bundle for submission, you may run:
```bash
git archive --format=tar.gz -o your-name_iam-mwf.tar.gz HEAD
```

# Images

- mwf-img-backward
- mwf-img-camera
- mwf-img-delete
- mwf-img-destroy
- mwf-img-disk
- mwf-img-hash
- mwf-img-link
- mwf-img-list
- mwf-img-log-in
- mwf-img-log-out
- mwf-img-map
- mwf-img-map-marker
- mwf-img-notes
- mwf-img-ok
- mwf-img-options-vertical
- mwf-img-paste
- mwf-img-pencil
- mwf-img-photo-album
- mwf-img-play
- mwf-img-play-button
- mwf-img-plus
- mwf-img-refresh
- mwf-img-remove
- mwf-img-rightarrow
- mwf-img-sandwich
- mwf-img-settings
- mwf-img-tiles 
