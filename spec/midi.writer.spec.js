describe('Midi.Writer', function () {

    //var _b64 = "TVRoZAAAAAYAAAABAIBNVHJrAAAAFgCQPFqBAIA8WgCQPlqBAIA+WgD/LwA=";
    var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";
    var _binary = window.atob(_b64); 
    var _buffer = Buffer.utils.byteStringToBuffer(_binary);


    var writer = new Midi.Writer();
    var reader = new Midi.Reader();
            
    it('should write Chunk', function () {
       
        var id = 'MThd';
        var input = new Uint8Array([1, 2, 3, 4, 5, 6]).buffer;
       
        var buffer = writer.writeChunk(id, input);
                                                
        var chunk = reader.readChunk(new BufferReader(buffer));
        
        var inputBytes = new Uint8Array(input);
        var outputBytes = new Uint8Array(chunk.buffer);
                
        expect(chunk.id).toBe(id);
        expect(chunk.length).toBe(input.byteLength);
        
        for (var i; i < inputBytes.byteLength; i++ ) {
            expect(outputBytes[i]).toBe(inputBytes[i]);    
        }        
                                                                 
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
        
        reader = new Midi.Reader();
        var output = reader.read(buffer);
        
        expect(output.header.type).toBe(input.header.type);
                
        expect(compareBytes(_buffer, buffer)).toBe(true);                
    }); 
    
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