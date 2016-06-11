#### Supported Events
r = read, w = write

###### Channel Events
(r/w) note-off  
(r/w) note-on  
(r/w) note-aftertouch  
(r/w) control-change  
(r/w) program-change  
(r/w) channel-aftertouch  
(r/w) pitch-bend

##### Meta Events
(r/w) sequence-number  
(r/w) text  
(r/w) copyright  
(r/w) track-name  
(r/w) instrument  
(r/w) lyric  
(r/w) marker  
(r/w) cue-point  
(r/w) channel-prefix  
(r/w) end-track  
(r/w) set-tempo  
-----  smtp  
(r/w) time-signature  
(r/w) key-signature  
-----  sequencer-specific


#### Namespace

midio.service  
midio.builder
midio.reader
midio.writer

midio.buffer.reader  
midio.buffer.writer  



```javascript

    var midi = midio.read(buffer);      

    var event = {
        delta: 0, channel: 9 
        message: { type: "note-on",  note: 60, velocity: 90 }
    };

    var track = [
        { message:{ type: "note-on",  note: 60, velocity: 90 }, channel:0, delta:0 };
        { message:{ type: "note-off", note: 60, velocity: 90 }, channel:0, delta:120 };
    ];



```




```javascript

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