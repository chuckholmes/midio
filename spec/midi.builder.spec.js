describe('Midi.Builder', function () {

    var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";    
    var _binary = window.atob(_b64);   
    var _buffer = Buffer.utils.byteStringToBuffer(_binary);  

    it('should build Detail', function () {

        var builder = new Midi.Builder();
        var reader = new Midi.Reader();
        var input = reader.read(_buffer);
        var track = input.tracks[0];

        var details = [];

        track.forEach(function (message) {
            var detail = builder.buildDetail(message);
            details.push(detail);
           //console.log(detail); 
        });

        details.forEach(function (detail) {
           var message = builder.buildMessage(detail);
           //console.log(message); 
        });

        expect(typeof builder).toBe('object');
    });

    it('should build Message', function(){ 

        var reader = new Midi.Reader();
        var input = reader.read(_buffer);
        var builder = new Midi.Builder();

        var detail = builder.buildMidiDetails(input);
        //console.log(detail);
        
        expect(detail.tracks.length).toBe(1);

        var messages = builder.buildMidiMessages(detail);
        //console.log(messages);
    });

});