# facr

Detects faces in images and returns a focal point. Is used to crop the right part of an image. You should use this in conjunction with the ee-image-worker package which has support for cropping using focal points.


[![npm](https://img.shields.io/npm/dm/facr.svg?style=flat-square)](https://www.npmjs.com/package/facr)
[![Travis](https://img.shields.io/travis/eventEmitter/facr.svg?style=flat-square)](https://travis-ci.org/eventEmitter/facr)
[![node](https://img.shields.io/node/v/facr.svg?style=flat-square)](https://nodejs.org/)

The Python script bin/detect is licenced unter the GPL2 Licence. The file was copied from https://github.com/wavexx/facedetect


## installation

You have first to install native dependecies

##### ubuntu linux
    
    sudo apt-get install python python-opencv libopencv-dev

## API
        
    var FaceDetection = require('facr');


    // create an instacne
    var detector =  new FaceDetection();


    // get focal point for an image
    detector.detect(imageBuffer, function(err, focalPoint) {
        if (err) log('#Fail :(');
        else if (focalPoint) log('Yeah, we got it! x %s, y %s :)', focalPoint.x, focalPoint.y);
        else log('sorry, failed to detect any faces in this image ...'');
    });