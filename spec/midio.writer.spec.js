describe('Midio.Writer', function () {

    //var _b64 = "TVRoZAAAAAYAAAABAIBNVHJrAAAAFgCQPFqBAIA8WgCQPlqBAIA+WgD/LwA=";
    var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";
    var _binary = window.atob(_b64); 
    var _buffer = Buffer.utils.byteStringToBuffer(_binary);

    var writer = new Midio.Writer();
    var reader = new Midio.Reader();
    var builder = new Midio.Builder();
            
    it('should write Chunk', function () {
       
        var id = 'MThd';
        var input = new Uint8Array([1, 2, 3, 4, 5, 6]).buffer;
       
        var buffer = writer.writeChunk(id, input);
                                                
        var chunk = reader.readChunk(new Midio.BufferReader(buffer));
        
        var inputBytes = new Uint8Array(input);
        var outputBytes = new Uint8Array(chunk.buffer);
                
        expect(chunk.id).toBe(id);
        expect(chunk.length).toBe(input.byteLength);
        expect(compareBytes(inputBytes, outputBytes)).toBe(true);
    });
    
    it('should write Header', function(){
       
        var input = { type: 0, trackCount: 1, timeDivision: 714 };
              
        var buffer = writer.writeHeader(input);        
        var output = reader.readHeader(buffer);
        
        expect(output.type).toBe(input.type);
        expect(output.trackCount).toBe(input.trackCount);
        expect(output.timeDivision).toBe(input.timeDivision);                                               
    });
    
    it('should write Track', function () {
        
        var input = reader.read(_buffer);        
        var buffer = writer.write(input);
        
        reader = new Midio.Reader();
        var output = reader.read(buffer);
        
        expect(output.header.type).toBe(input.header.type);                
        expect(compareBytes(_buffer, buffer)).toBe(true);                
    }); 
    
    it('should write File', function () {
        
        var inputBuffer = _buffer;                
        var inputDetails = reader.read(inputBuffer);                        
        //var inputDetails = builder.buildMidiDetails(inputMessages);
                        
        //var outputMessages = builder.buildMidiMessages(inputDetails);
        //var outputDetails = builder.buildMidiDetails(outputMessages);        
        var outputBuffer = writer.write(inputDetails);
        
        
        //var isValid = true;
        //for (var i = 0; i<inputDetails.tracks[0].length; i++ ) {
        //    isValid = (JSON.stringify(inputDetails.tracks[0][i]) == JSON.stringify(outputDetails.tracks[0][i]));
            //console.log(i + ' : ' + isValid);    
       //}
                                
        expect(compareBytes(inputBuffer, outputBuffer)).toBe(true);
        
        // build blob
        var outputArray = new Uint8Array(outputBuffer);
        var outputBlob = new Blob([outputArray], {type: 'application/octet-binary'});
        
        expect(outputBlob.size).toBe(outputBuffer.byteLength);
         
        // load blob
        loadBlob(outputBlob).then(function (outputBuffer) {
            
            //var outputMessages = reader.read(outputBuffer);
            //var outputDetails = builder.buildMidiDetails(outputMessages);            
            //console.log(outputDetails);
            
            // compare bytes
            //expect(compareBytes(inputBuffer, outputBuffer)).toBe(true);                        
        }.bind(this));
                               
        
        //downloadBlob(outputBlob, 'shouldWriteFile.mid');                               
                               
    });


    it('should write Details', function () {

        var midi = {
            header: { type: 1, timeDivision: 240, trackCount: 1 },
            tracks: [
                [
                    // meta messages
                    { type: "text", text: "Powered by Midio" },
                    { type: "copyright", text: "JSFanatic" },
                    { type: "track-name", text: "Love Wrangler" },
                    { type: "instrument", text: "Keyboard" },
                    { type: "lyrics", text: "Ohh baby yeah..." },
                    { type: "marker", text: "Intro" },
                    { type: "cue-point", text: "Dancers" },
                    { type: 'sequence-number', number: 1},
                    { type: "set-tempo", microsecondsPerBeat: 400000 },
                    { type: "time-signature", numerator: 6, denominator: 8, metronome: 24, thirtyseconds: 8 },
                    { type: "key-signature", key: 1, scale: 1 },

                    // channel messages
                    { type: "note-on", note: 60, velocity: 90, channel: 0, delta: 0 },
                    { type: "note-off", note: 60, velocity: 90, channel: 0, delta: 128 },
                    { type: "controller", controllerType: 7, value: 128, channel: 0, delta: 0 },
                    { type: "note-aftertouch", note: 62, amount: 64, channel: 0, delta: 0 },
                    { type: "program-change", programNumber: 36, channel: 0, delta: 0 },
                    { type: "channel-aftertouch", amount: 127, channel: 0, delta: 0 },
                    { type: "pitch-bend", value: 16383, channel: 0, delta: 0 },
                    { type: "channel-prefix", channelNumber: 10 },
                    { type: "end-track" }
                ]
            ]
        };

        // write midi        
        var outputBuffer = writer.write(midi);

        // create blob
        var inputArray = new Uint8Array(outputBuffer);
        var blob = new Blob([inputArray], {type: 'application/octet-binary'});

        expect(blob.size).toBe(outputBuffer.byteLength);

        // download blob
        downloadBlob(blob, 'shouldWriteDetails.mid');

    });


    it('should write Blob', function () {
        
        var midi = reader.read(_buffer);        
        var buffer = writer.write(midi);
        
        // create blob        
        var inputArray = new Uint8Array(buffer);
        var blob = new Blob([inputArray], {type: 'application/octet-binary'}); 
                
        expect(blob.size).toBe(buffer.byteLength);
                
        // load blob
        loadBlob(blob).then(function(outputBuffer) {
            //expect(outputBuffer.byteLength).toBe(buffer.byteLength);
            //expect(compareBytes(outputBuffer, buffer)).toBe(true);  
        });
                        
        // download blob
        //downloadBlob(blob, 'test.mid');                
    });

    function loadBlob(blob) {

        return new Promise(function (resolve, reject) {                        
            var fileReader = new FileReader();                                    
            fileReader.onloadend = function () {            
                resolve(fileReader.result);                              
            };                        
            fileReader.readAsArrayBuffer(blob);                        
        });                
    }

    function downloadBlob(blob, name) {
        
        var url = window.URL.createObjectURL(blob);                                                               

        // download		        
	    var a = document.createElement('a');
	    document.body.appendChild(a);
        a.style = 'display: none';	    
	    a.download = name;	            	   	    
	    a.href = url;	                    
	    a.click();
	    
        // clean up
	    window.URL.revokeObjectURL(url);	    
	    document.body.removeChild(a);	
    }

    function compareBytes(input, output) {
        
        var result = true;        
        var inputBytes = new Uint8Array(input);
        var outputBytes = new Uint8Array(output);
        
        for (var i = 0; i < inputBytes.byteLength; i++ ) {
            if (outputBytes[i] !== inputBytes[i]) {
                result = false;
            }
        }                
        return result;
    }

});