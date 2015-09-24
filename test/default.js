

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
        , fs            = require('fs')
        , path          = require('path')
		, assert 		= require('assert');



	var   Facr = require('../')
        , facr;



	describe('Facr', function(){
		it('should not crash when instantiated', function() {
            facr = new Facr();
		});


        it('should detect faces', function(done) {
            this.timeout(10000);

            var data = fs.readFileSync(path.join(__dirname, 'face.jpg'));

            facr.detect(data).then(function(focalPoint) {
                assert(focalPoint);
                assert(focalPoint.x === 1703);
                assert(focalPoint.y === 1006);
                done();
            }).catch(done);
        }); 

        it('shouldn\'t detect faces if there aren\'t any', function(done) {
            this.timeout(10000);
            
            var data = fs.readFileSync(path.join(__dirname, 'noface.jpg'));

            facr.detect(data).then(function(focalPoint) {
                assert(!focalPoint);
                done();
            }).catch(done);
        });
	});
