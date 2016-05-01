describe('Midi.Builder', function () {
     
    var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";    
    var _binary = window.atob(_b64);   
    var _buffer = Buffer.utils.byteStringToBuffer(_binary);  
   
    it('should build Detail', function () {        
        
        var reader = new Midi.Reader();
        var input = reader.read(_buffer);
        var track = input.tracks[0];
        
        var builder = new Midi.Builder();
        
        var details = [];
               
        //console.log ('details ---');
        track.forEach(function (message) {
            var detail = builder.buildDetail(message);
            details.push(detail);
           console.log(detail); 
        });

        //console.log ('Messages ---');
        details.forEach(function (detail) {
           var message = builder.buildMessage(detail);
           //console.log(message); 
        });
        

        expect(typeof builder).toBe('object');
        
    });
    
    xit('should build Message', function(){ });
    
});