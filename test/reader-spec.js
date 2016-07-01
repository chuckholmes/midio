describe('Midio.Reader', function () {

  //var _b64 = "TVRoZAAAAAYAAAABAIBNVHJrAAAAFgCQPFqBAIA8WgCQPlqBAIA+WgD/LwA=";    
  var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";

  var _binary = window.atob(_b64);
  var _buffer;

  beforeEach(function () {
    _buffer = Buffer.utils.byteStringToBuffer(_binary);
  });

  it("It should read Chunk", function () {
    var bufferReader = new Midio.BufferReader(_buffer);
    var midiReader = new Midio.Reader();
    var chunk = midiReader.readChunk(bufferReader);

    expect(chunk.id).toBe('MThd');
    expect(chunk.length).toBe(6);
    expect(chunk.buffer.byteLength).toBe(6);
  });

  it("It should read Header", function () {
    var reader = new Midio.Reader();
    var midi = reader.read(_buffer);

    expect(midi.header.trackCount).toBe(1);
  });

  it("It should read Track", function () {
    var reader = new Midio.Reader();
    var midi = reader.read(_buffer);

    expect(midi.tracks.length).toBe(1);
  });
});