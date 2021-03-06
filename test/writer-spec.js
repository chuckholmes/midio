describe('Midio.Writer', function () {

  //var _b64 = "TVRoZAAAAAYAAAABAIBNVHJrAAAAFgCQPFqBAIA8WgCQPlqBAIA+WgD/LwA=";
  //var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";

  var _b64 = "TVRoZAAAAAYAAQABAGBNVHJrAAAAzwD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8GBUludHJvAP8HCkZsYXNoIFBvdHMA/wUTR290dGEgd3JhbmdsZSBvbi4uLgD/UQMGGoAA/1gEBgMYCAD/WQIBAQD/AAIAAQD/IAEKAP8JC0RldmljZSBOYW1lAP8IDFByb2dyYW0gTmFtZQD/IQEKAJA8WoEAgDxaAOB/fwCgPkAA0H8AsAeAAMAkAP8vAA==";

  var _binary = window.atob(_b64);
  var _buffer = Buffer.utils.byteStringToBuffer(_binary);

  var writer = new Midio.Writer();
  var reader = new Midio.Reader();
  var builder = new Midio.Builder();

  it('It should write Chunk', function () {
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

  it('It should write Header', function () {
    var input = { type: 0, trackCount: 1, division: 714 };
    var buffer = writer.writeHeader(input);
    var output = reader.readHeader(buffer);

    expect(output.type).toBe(input.type);
    expect(output.trackCount).toBe(input.trackCount);
    expect(output.division).toBe(input.division);
  });

  it('It should write Track', function () {
    var input = reader.read(_buffer);
    var buffer = writer.write(input);

    reader = new Midio.Reader();
    var output = reader.read(buffer);

    expect(output.header.type).toBe(input.header.type);
    expect(compareBytes(_buffer, buffer)).toBe(true);
  });

  it('It should write File', function () {

    var inputBuffer = _buffer;
    var inputMessages = reader.read(inputBuffer);
    var outputBuffer = writer.write(inputMessages);

    expect(compareBytes(inputBuffer, outputBuffer)).toBe(true);

    // build blob
    var outputArray = new Uint8Array(outputBuffer);
    var outputBlob = new Blob([outputArray], { type: 'application/octet-binary' });

    expect(outputBlob.size).toBe(outputBuffer.byteLength);

    // load blob
    loadBlob(outputBlob).then(function (buffer) {
      var outputMessages = reader.read(buffer);
      //console.log(outputMessages);                                                            
    }.bind(this));

    //downloadBlob(outputBlob, 'shouldWriteFile.mid');         

  });

  it('It should write Messages', function () {

    var midi = {
      header: { type: 1, division: 96, trackCount: 1 },
      tracks: [
        [
          // meta messages
          { type: "text", text: "Powered by Midio" },
          { type: "copyright", text: "JSFanatic" },
          { type: "track-name", text: "Love Wrangler" },
          { type: "instrument-name", text: "Keyboard" },
          { type: "marker", text: "Intro" },
          { type: "cue-point", text: "Flash Pots" },
          { type: "lyrics", text: "Gotta wrangle on..." },
          { type: "set-tempo", tempo: 400000 },
          { type: "time-signature", numerator: 6, denominator: 8, metronome: 24, thirtyseconds: 8 },
          { type: "key-signature", key: 1, scale: 1 },
          { type: 'sequence-number', value: 1 },
          { type: "channel-prefix", channel: 10 },
          { type: "device-name", text: "Device Name" },
          { type: "program-name", text: "Program Name" },
          { type: "midi-port", port: 10 },

          // channel messages
          { type: "note-on", note: 60, velocity: 90, channel: 0, delta: 0 },
          { type: "note-off", note: 60, velocity: 90, channel: 0, delta: 128 },
          { type: "pitch-bend", value: 16383, channel: 0, delta: 0 },
          { type: "key-pressure", note: 62, pressure: 64, channel: 0, delta: 0 },
          { type: "channel-pressure", channel: 0, pressure: 127, delta: 0 },
          { type: "control-change", control: 7, value: 128, channel: 0, delta: 0 },
          { type: "program-change", program: 36, channel: 0, delta: 0 },

          // the end
          { type: "end-of-track" }
        ]
      ]
    };

    // write midi
    var buffer = writer.write(midi);

    // create blob
    var blob = new Blob([new Uint8Array(buffer)], { type: 'application/octet-binary' });

    expect(blob.size).toBe(buffer.byteLength);

    // download blob
    //downloadBlob(blob, 'shouldWriteDetails.mid');

    // log base64
    //console.log(btoa(Buffer.utils.bufferToByteString(buffer)));
  });

  it('It should write Blob', function () {
    var midi = reader.read(_buffer);
    var buffer = writer.write(midi);

    expect(compareBytes(buffer, _buffer)).toBe(true);

    // create blob        
    var inputArray = new Uint8Array(buffer);
    var blob = new Blob([inputArray], { type: 'application/octet-binary' });

    expect(blob.size).toBe(buffer.byteLength);

    // load blob
    loadBlob(blob).then(function (outputBuffer) {
      //console.log((outputBuffer.byteLength == buffer.byteLength));
      //console.log(compareBytes(outputBuffer, buffer));            
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
    
    // download
    var url = window.URL.createObjectURL(blob);
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

    for (var i = 0; i < inputBytes.byteLength; i++) {
      if (outputBytes[i] !== inputBytes[i]) {
        result = false;
      }
    }
    return result;
  }

});