
### Midio Object Types

```javascript

var midi = Midio.read(buffer);
var buffer = Midio.write(midi)

var track = [
    
    // meta messages    
    { type: "text", text: "Powered by Midio" }
    { type: "copyright", text: "JSFanatic" }
    { type: "track-name", text: "Love Wrangler" }
    { type: "instrument", text: "Keyboard" }
    { type: "lyrics", text: "Ohh baby yeah..." }
    { type: "marker", text: "Intro" }
    { type: "cue-point", text: "Dancers" }
    { type: "set-tempo", microsecondsPerBeat: 400000 }
    { type: "time-signature", numerator: 6, denominator: 8, metronome: 24, thirtyseconds: 8 }

    // channel messages
    { type: "note-on", note: 60, velocity: 90, channel: 0, time: 0 }
    { type: "note-off", note: 60, velocity: 90, channel: 0, time: 128}
    { type: "controller", controllerType: 7, value: 128, channel: 0, time: 0 }
    { type: "note-aftertouch", note: 62, amount: 64, channel: 0, time: 0 }
    { type: "program-change", programNumber: 36, channel: 0, time: 0 }
    { type: "channel-aftertouch", amount: 127, channel: 0, time: 0 }
    { type: "midi-channel-prefix", channel: 10 }
    { type: "end-of-track" }
]


    
// midi message
var shortMsg = Midio.noteOn(channel, note, velocity);        

// midi event 
var event = { tick:100, message: { channel: 0, command: 9, param1: 60, param2: 90 }    

// create event with message helper    
var event = { tick: 120, message: Midio.noteOn(channel, note, velocity) }

// add to track
sequence.tracks[0].push(event);


switch (msg.command) {        
    case events.value['note-on']:
        break;
}


var SEQUENCE = 0x00, 
    TEXT = 0x01, 
    COPYRIGHT = 0x02, 
    TRACK_NAME = 0x03, 
    INSTRUMENT = 0x04, 
    LYRICS = 0x05, 
    MARKER = 0x06,
    CUR_POINT = 0x07, 
    NOTE_OFF = 0x8, 
    NOTE_ON = 0x9, 
    NOTE_AFTERTOUCH = 0xA, 
    CONTROLLER = 0xB, 
    PROGRAM = 0xC, 
    CHANNEL_AFTERTOUCH = 0xD,
    PITCH_BEND = 0xE, 
    CHANNEL_PREFIX = 0x20, 
    END_OF_TRACK =  0x2f, 
    TEMPO = 0x51, SMPTE = 0x54, 
    TIME_SIGNATURE = 0x58, 
    KEY_SIGNATURE = 0x59;                

```