#ROOT FOLDERS
    src             : source code
    website         : builded page (do not edit files there)

#SRC FOLDER
    assets    : add assets to website folder
    data      : json files preloaded with preloadjs
    scripts   : app            - angular app
                data           - json files required with webpack
                globals        - global application scripts and helper functions
                utilities      - utilities scripts
                vendor         - libraries (downloaded with bower. Task 'gulp bower')
                main.js        - main app file
    scss      : modules   - scss modules
                _base     - default styling how elements will look like in all occurrences on the page
                _fonts    - page fonts
                _shared   - scss variables shared in all scss files
                assets    - scss styles that will be preloaded with preloadjs (for inline images)
                style     - main style file
    tpls      : html templates

#WEBSITE FOLDER
    assets    : media files (images, sprites, video, audio ...)

#GULP TASKS
    gulp build         : build for development
    gulp watch         : watch for changes and rebuild updated file
    gulp bower         : download and insert js libraries with bower to src/scripts/vendor/
    gulp               : default task runs 'gulp watch'
    gulp build --dist  : build for production
    gulp connect       : create http server for testing production version

#CONFIG FILE config.json
    jsHeader : Order of JavaScript libraries loaded in header (use only file names, no global selectors)
    jsLib    : Order of JavaScript libraries
    jsMain   : Main JavaScript file
    css      : Main SCSS files
    root     : List of RootFiles to copy to website folder
