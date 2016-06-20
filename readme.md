
### Midio - Javascript MIDI File I/O Library

```javascript

    var midi = {
        header: { type: 1, timeDivision: 96, trackCount: 1 },
        tracks: [
            [
                // meta messages
                { type: "text", text: "Powered by Midio" },
                { type: "copyright", text: "JSFanatic" },
                { type: "track-name", text: "Love Wrangler" },
                { type: 'sequence-number', value: 1},
                { type: "instrument-name", text: "Keyboard" },
                { type: "marker", text: "Intro" },
                { type: "lyrics", text: "Wrangle on..." },
                { type: "cue-point", text: "Cue Dancers" },

                { type: "set-tempo", tempo: 400000 },   // microseconds per beat
                { type: "time-signature", numerator: 6, denominator: 8, metronome: 24, thirtyseconds: 8 },
                { type: "key-signature", key: 1, scale: 1 },

                // channel messages
                { type: "note-on", note: 60, velocity: 90, channel: 0, delta: 0 },
                { type: "note-off", note: 60, velocity: 90, channel: 0, delta: 128 },
                { type: "control-change", control: 7, value: 128, channel: 0, delta: 0 },
                { type: "key-pressure", note: 62, value: 64, channel: 0, delta: 0 },
                { type: "program-change", value: 36, channel: 0, delta: 0 },
                { type: "channel-pressure", value: 127, channel: 0, delta: 0 },
                { type: "pitch-bend", value: 16383, channel: 0, delta: 0 },
                { type: "channel-prefix", value: 10 },
                { type: "end-of-track" }
            ]
        ]
    };
    
    // create midi writer
    var writer = new Midio.Writer();
    
    // write to buffer
    var buffer = writer.write(midi);

    // create a blob    
    var blob = new Blob([new Uint8Array(buffer)], {type: 'application/octet-binary'});
    
    // create download
    var url = window.URL.createObjectURL(blob); 

```