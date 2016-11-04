#!/usr/bin/env node

var colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));

//commands
var command_generate = require('./command_generate');

var getCommands = function (){
	for(i in argv._){
		if(!argv[argv._[i]]){
			argv[argv._[i]] = true;
		}
	}
	return argv;
}

GLOBAL.commands = getCommands();

(function showdoc() {


	var showIntro = function (){
		console.log("");

		console.log("     _____ _             ____          ".green);
		console.log("    |   __| |_ ___ _ _ _|    \\ ___ ___ ".green);
		console.log("    |__   |   | . | | | |  |  | . |  _|".green);
		console.log("    |_____|_|_|___|_____|____/|___|___|".green);
	}


		//valid commands
		if(!commands._.length){
				showIntro();
		} else {
			if(commands.generate){
				command_generate.run();
			} else {
				console.log("Command not exist!".red);
			}
		}

})();
