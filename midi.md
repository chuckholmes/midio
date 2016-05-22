# Channel Events

rw  note-off
rw  note-on
rw  note-aftertouch
rw  control-change
rw  program-change
rw  channel-aftertouch
rw  pitch-bend

# Meta Events

rw  sequence-number	
rw  text	
rw  copyright	
rw  track-name	
rw  instrument	
rw  lyric
rw  marker
rw  cue-point
rw  channel-prefix
rw  end-of-track
rw  set-tempo
--  smtp
rw  time-signature
rw  key-signature
--  sequencer-specific


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