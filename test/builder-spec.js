describe('Midio.Builder', function () {

  var _b64 = "TVRoZAAAAAYAAQABAPBNVHJrAAAAlQD/ARBQb3dlcmVkIGJ5IE1pZGlvAP8CCUpTRmFuYXRpYwD/Aw1Mb3ZlIFdyYW5nbGVyAP8ECEtleWJvYXJkAP8FEE9oaCBiYWJ5IHllYWguLi4A/wYFSW50cm8A/wcHRGFuY2VycwD/UQMGGoAA/1gEBgMYCACQPFqBAIA8WgCwB4AAoD5AAMAkANB/AP8gAQoA/y8A";
  
  var _buffer = Buffer.utils.byteStringToBuffer(window.atob(_b64));
  var _builder = new Midio.Builder();
  var _reader = new Midio.Reader();

  it('It should build Message', function () {
    var input = _reader.read(_buffer);
    var track = input.tracks[0];

    track.forEach(function (m) {
      var message = _builder.buildShortMessage(m) || _builder.buildLongMessage(m) || 'Message not found: ' + m.type;
      //console.log(message);
    });

    expect(typeof _builder).toBe('object');
  });

  it('It should build Pitch Bend', function () {

    // http://www.midikits.net/midi_analyser/pitch_bend.htm

    var minValue = 0;
    var maxValue = 16383;
    var midValue = 8192;

    var result = _builder.buildShortMessage({ type: 'pitch-bend', value: maxValue });
    expect(result.param1).toBe(127);
    expect(result.param2).toBe(127);

    var param1In = 127;
    var param2In = 127;

    var maxResult = param1In + (param2In << 7);
    expect(maxResult).toBe(16383);

    param2Out = Math.floor(maxResult / 128);
    param1Out = maxResult % 128;

    expect(param1Out).toBe(param1In);
    expect(param2Out).toBe(param2In);
  });

  function findMessage(messages, type) {
    return messages.filter(function (msg) {
      return msg.type === type;
    });
  }
});
