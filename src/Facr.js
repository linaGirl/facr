'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const child = require('child_process');
const log = require('ee-log');




module.exports = class Facr {



    constructor() {
        this.cacheDir = '/tmp';
        this.command = 'bin/detect'
        this.serial = 0;

        // absolute path to our command
        this.commandPath = path.join(__dirname.slice(0, __dirname.lastIndexOf('/')), this.command);
    }






    /**
    * detects faces using an external dependency
    */
    async detect(buffer) {
        const filePath = await this.storeFile(buffer);
        const focalPoint = await this.execute(filePath);

        await this.deleteFile(filePath);

        return focalPoint;
    }
    




    /**
    * executes the external command in order to detect the faces
    *
    * @param {string} filePath the path to the image file
    */
    execute(filePath) {
        return new Promise((resolve, reject) => {
            child.execFile(this.commandPath, [filePath], (err, stdout, stderr) => {
                if (err) reject(err);
                else {
                    var faces = []
                        , x = 0
                        , y = 0;

                    if (stdout.length) {
                        stdout.split('\n').forEach((face) => {
                            var data = /(\d*)\s(\d*)\s(\d*)\s(\d*)/.exec(face);

                            if (data) {
                                faces.push({
                                      x: parseInt(data[1], 10)
                                    , y: parseInt(data[2])
                                    , width: parseInt(data[3])
                                    , height: parseInt(data[4])
                                });
                            }
                        });
                    }

                    // compute focal point
                    if (faces.length) {
                        faces.forEach((face) => {
                            x += Math.round(face.x+face.width/2);
                            y += Math.round(face.y+face.height/2);
                        });

                        resolve({
                              x: Math.round(x/faces.length)
                            , y: Math.round(y/faces.length)
                        });
                    } else resolve();
                }
            });
        }); 
    }







    /**
    * deletes a fîle
    *
    * @param {strin} filePath
    *
    * @returns {Promise}
    */
    deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }






    /**
    * stores a file in the temp dir
    *
    * @param {buffer} data
    *
    * @returns {Promise}
    */
    storeFile(data) {
        return new Promise((resolve, reject) => {
            var filePath = path.join(this.cacheDir, 'facr_'+crypto.createHash('md5').update(''+Date.now()+(this.serial++)).digest('hex'));

            fs.writeFile(filePath, data,(err) => {
                if (err) reject(err);
                else resolve(filePath);
            });
        });
    }
};