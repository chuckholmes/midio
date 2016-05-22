
### Midio - Javascript MIDI File IO Library

```javascript

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
                { type: "note-on", note: 60, velocity: 90, channel: 0, time: 0 },
                { type: "note-off", note: 60, velocity: 90, channel: 0, time: 128 },
                { type: "controller", controllerType: 7, value: 128, channel: 0, time: 0 },
                { type: "note-aftertouch", note: 62, amount: 64, channel: 0, time: 0 },
                { type: "program-change", programNumber: 36, channel: 0, time: 0 },
                { type: "channel-aftertouch", amount: 127, channel: 0, time: 0 },
                { type: "pitch-bend", value: 16383, channel: 0, time: 0 },
                { type: "midi-channel-prefix", channelNumber: 10 },
                { type: "end-of-track" }
            ]
        ]
    };
    
    // write to buffer
    var buffer = Midio.write(midi);

    // create a blob
    var btyeArray = new Uint8Array(buffer);
    var blob = new Blob([inputArray], {type: 'application/octet-binary'});
    
    // create download
    var url = window.URL.createObjectURL(blob); 

```