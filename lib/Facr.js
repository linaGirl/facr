(function() {
    'use strict';

    var   Class         = require('ee-class')
        , fs            = require('fs')
        , path          = require('path')
        , crypto        = require('crypto')
        , asyncMethod   = require('async-method')
        , child         = require('child_process')
        , log           = require('ee-log');




    module.exports = new Class({


        // the folder to store the files in
        cacheDir: '/tmp'

        // the file to execute relative to our module root
        , command: 'bin/detect'



        /**
         * class constructor
         */
        , init: function(options) {
            this.serial = 0;

            // absolute path to our command
            this.commandPath = path.join(__dirname.slice(0, __dirname.lastIndexOf('/')), this.command);
        }






        /**
         * detects faces using an external dependency
         */
        , detect: asyncMethod(function(buffer, callback) {
            var file;

            this.storeFile(buffer)
                .then(function(filePath) {
                    file = filePath;
                    return this.execute(filePath);
                }.bind(this))
                .then(function(focalPoint) {
                    callback(null, focalPoint);
                    return this.deleteFile(file);
                }.bind(this))
                .catch(callback);
        })
        




        /*
 *        * executes the external command in order to detect the faces
         *
         * @param {string} filePath the path to the image file
         */
        , execute: function(filePath) {
            return new Promise(function(resolve, reject) {
                child.execFile(this.commandPath, [filePath], function(err, stdout, stderr) {
                    if (err) reject(err);
                    else {
                        var faces = []
                            , x = 0
                            , y = 0;

                        if (stdout.length) {
                            stdout.split('\n').forEach(function(face) {
                                var data = /(\d*)\s(\d*)\s(\d*)\s(\d*)/.exec(face);

                                if (data) {
                                    faces.push({
                                          x: parseInt(data[1], 10)
                                        , y: parseInt(data[2])
                                        , width: parseInt(data[3])
                                        , height: parseInt(data[4])
                                    });
                                }
                            }.bind(this));
                        }

                        // compute focal point
                        if (faces.length) {
                            faces.forEach(function(face) {
                                x += Math.round(face.x+face.width/2);
                                y += Math.round(face.y+face.height/2);
                            }.bind(this));

                            resolve({
                                  x: Math.round(x/faces.length)
                                , y: Math.round(y/faces.length)
                            });
                        }
                        else resolve();
                    }
                }.bind(this));
            }.bind(this)); 
        }




   


        /**
         * deletes a fîle
         *
         * @param {strin} filePath
         *
         * @returns {Promise}
         */
        , deleteFile: function(filePath) {
            return new Promise(function(resolve, reject) {
                fs.unlink(filePath, function(err) {
                    if (err) reject(err);
                    else resolve();
                }.bind(this));
            }.bind(this));
        }





        /**
         * stores a file in the temp dir
         *
         * @param {buffer} data
         *
         * @returns {Promise}
         */
        , storeFile: function(data) {
            return new Promise(function(resolve, reject) {
                var filePath = path.join(this.cacheDir, 'facr_'+crypto.createHash('md5').update(''+Date.now()+(this.serial++)).digest('hex'));

                fs.writeFile(filePath, data, function(err) {
                    if (err) reject(err);
                    else resolve(filePath);
                }.bind(this));
            }.bind(this));
        }
    });
})();
 