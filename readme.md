
### Midio - Javascript MIDI File I/O Library

```javascript

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

  // write to buffer
  var writer = new Midio.Writer();
  var buffer = writer.write(midi);

  // create a blob
  var blob = new Blob([new Uint8Array(buffer)], {type: 'application/octet-binary'});

  // create download url
  var url = window.URL.createObjectURL(blob); 

```