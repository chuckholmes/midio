describe('Midi.Builder', function () {
     
    var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";    
    var _binary = window.atob(_b64);   
    var _buffer = Buffer.utils.byteStringToBuffer(_binary);  
   
    it('should build Event', function () {        
        
        var reader = new Midi.Reader();
        var input = reader.read(_buffer);
        var track = input.tracks[0];
        
        var builder = new Midi.Builder();
        
        track.forEach(function (msg) {
           console.log(builder.buildEvent(msg)); 
        });

        

        expect(typeof builder).toBe('object');
        
    });
    
});