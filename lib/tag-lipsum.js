"use strict"
/**
 * Created by anab.tn@gmail.com on 26/03/2015.
 */
var fs = require('fs');
var chalk = require('chalk');
var lorem = require('./lorem.js');
var walker = require('./walker.js');

var config = {
    folder: './',
    extension: ['html', 'twig'],
    lorem: {
        tag: /((<ipsum>|<ipsum )([A-Za-z0-9>< ="'-]*)(<\/ipsum>))/gi,
        option: /(data-options=")([A-Za-z0-9>< ="'-]*)(")/gi
    }

};


var isset = function (input) {
    input = (typeof input !== 'undefined') ? ( (input !== null && input.length !== 0) ? true : false ) : false;
    return input;
}

var getExtension = function (file) {
    return (/[.]/.exec(file)) ? ((/[^.]+$/.exec(file))[0]).toLowerCase() : undefined;
}

/*
 var i = 0;
 for(i; i < process.argv.length; i++){
 console.log(process.argv[i]);
 }
 -*/

/*
 *
 * 2p = 2 paragraphs
 * 5s = 5 sentences
 * 6w = 6 words
 * 1-6w = between 1 and 6 words
 *
 */

var convertIpsum = function (file) {
    if (fs.existsSync(file)) {
        var content = fs.readFileSync(file, 'utf8');
        content = content.replace(config.lorem.tag, function (e) {
            var _lorem = new lorem(),
                options;
            if((options = config.lorem.option.exec(e) ) !== null )
                _lorem.query = options[2];

            return _lorem.createLorem();
        });
        fs.writeFileSync(file, content);
    } else {
        console.log("File does not exist - " + file);
    }
}


/**
 @param {string} folder
 @param {Array} extention
 @public
 @return {void}
 */
var lipsum = function (folder, extension) {



    /*
     *
     * Script:
     *     if (parameter folder passed) : affect folder parameter
     *     else : affect default config.folder

     * Test:
     * describe("Parameter Folder", function() {
     *     it("not passed", function() {
     *        expect(folder).toBe(config.folder);
     *     });
     * });
     * describe("Parameter Folder", function() {
     *     it("passed", function() {
     *        expect(folder).toBe(folder);
     *     });
     * });
     *
     */

    folder = (isset(folder)) ? folder : config.folder;


    /*
     *
     * Script:
     *     if (folder not exist) : esc
     *     else : continue

     * Test:
     * describe("Folder", function() {
     *     it("not exist", function() {
     *        expect(fs.existsSync(folder)).toBe(false);
     *     });
     * });
     * describe("Folder", function() {
     *     it("exist", function() {
     *        expect(fs.existsSync(folder)).toBe(true);
     *     });
     * });
     *
     */

    if (!fs.existsSync(folder)) {
        console.log(chalk.red("Folder not exist\n"), folder);
        return false;
    }


    /*
     *
     * Script:
     *     if (parameter extension passed) : affect extension parameter
     *     else : affect default config.extension

     * Test:
     * describe("Parameter Extension", function() {
     *     it("not passed", function() {
     *        expect(extension).toBe(config.extension);
     *     });
     * });
     * describe("Parameter Extension", function() {
     *     it("passed", function() {
     *        expect(extension).toBe(extension);
     *     });
     * });
     *
     */

    extension = (isset(extension)) ? extension : config.extension;

    /*
     *
     * Script:
     *     if (parameter extension passed) : affect extension parameter
     *     else : affect default config.extension

     * Test:
     * describe("Parameter Extension", function() {
     *     it("not passed", function() {
     *        expect(extension).toBe(config.extension);
     *     });
     * });
     * describe("Parameter Extension", function() {
     *     it("passed", function() {
     *        expect(extension).toBe(extension);
     *     });
     * });
     *
     */
    walker.map(folder, function (item) {
        if (extension.indexOf(getExtension(item)) != -1)
            convertIpsum(item);
        return item;
    }).then(function (items) {
        console.log(chalk.green(items.length + " Files convert"))
        console.log(chalk.green("Results from map:\n"), items);
        return
    });
}

// lipsum('./testFile'); // Update all file ['html', 'twig'] in /testFile
// lipsum('./testFile', ['txt']); // Update just text file

exports.lipsum = lipsum;