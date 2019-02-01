# facr

Detects faces in images and returns a focal point. Is used to crop the right part of an image. You should use this in conjunction with the ee-image-worker package which has support for cropping using focal points.


[![npm](https://img.shields.io/npm/dm/facr.svg?style=flat-square)](https://www.npmjs.com/package/facr)
[![Travis](https://img.shields.io/travis/eventEmitter/facr.svg?style=flat-square)](https://travis-ci.org/eventEmitter/facr)
[![node](https://img.shields.io/node/v/facr.svg?style=flat-square)](https://nodejs.org/)

The Python script bin/detect is licenced unter the GPL2 Licence. The file was copied from https://gitlab.com/wavexx/facedetect


## installation

You have first to install native dependecies

##### ubuntu linux

```
apt -y install python python3-opencv libopencv-dev python3-numpy
```

## API


```
const FaceDetection = require('facr');

// create an instance
const detector = new FaceDetection();


// get focal point for an image
const focalPoint = await detector.detect(imageBuffer);

if (focalPoint) console.log('Yeah, we got it! x %s, y %s :)', focalPoint.x, focalPoint.y);
else console.log('sorry, failed to detect any faces in this image ...'');
```
