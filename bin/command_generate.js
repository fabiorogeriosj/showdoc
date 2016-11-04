var colors = require('colors');
var markdown = require( "markdown" ).markdown;

module.exports = {
    run : function (){

      console.log("Generating...".green);
      console.log( markdown.toHTML( "![Logo](https://raw.githubusercontent.com/fabiorogeriosj/mockapp/design/logo_dark.png) Create functional prototypes for mobile applications [![Linux Build][travis-image]][travis-url] [![Windows Build][appveyor-image]][appveyor-url] [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] See [documentation here](https://mockappframework.github.io/). ## Install The Installation is very simple, but first you need to install [Node.js](https://nodejs.org/en/). After, just execute command in your terminal: ``` npm install -g cordova mockapp ```" ) );

    }
}
