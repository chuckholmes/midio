#### Supported Events
r = read, w = write

###### Channel Voice Events  
(r/w) note-on   
(r/w) note-off  
(r/w) pitch-bend   
(r/w) key-pressure  
(r/w) channel-pressure  
(r/w) control-change  
(r/w) program-change  
  
###### Meta Events
(r/w) text  
(r/w) copyright  
(r/w) track-name  
(r/w) instrument-name  
(r/w) sequence-number  
(r/w) marker  
(r/w) cue-point  
(r/w) lyrics  
(r/w) set-tempo    
(r/w) time-signature  
(r/w) key-signature  
(r/w) channel-prefix  
(r/w) end-of-track  
----- smtp-offset   
----- sequencer-specific    
----- program-name  
----- device-name   
----- midi-port 

###### Channel Mode Events
----- reset-controllers  
----- local-control  
----- all-sounds-off    
----- all-notes-off       
----- omni-mode-off  
----- omni-mode-on  
----- mono-mode-on  
----- poly-mode-on  

---
#### Namespace

midio.reader
midio.writer
midio.builder

midio.buffer.reader  
midio.buffer.writer  


|   |            |
|---|:-----------|
| x | note-on    |
|   | note-off   |
| x | pitch-bend |





All Sound Off. 
When All Sound Off is received all oscillators will turn off, and their volume envelopes are set to zero as soon 
as possible. c = 120, v = 0: All Sound Off

Reset All Controllers. 
When Reset All Controllers is received, all controller values are reset to their default values. (See specific Recommended Practices for defaults). 
c = 121, v = x: Value must only be zero unless otherwise allowed in a specific Recommended Practice.

Local Control. 
When Local Control is Off, all devices on a given channel will respond only to data received over MIDI. Played data, etc. will be ignored. Local Control On restores the functions of the normal controllers. 
c = 122, v = 0: Local Control Off
c = 122, v = 127: Local Control On

All Notes Off. 
When an All Notes Off is received, all oscillators will turn off. 
c = 123, v = 0: All Notes Off (See text for description of actual mode commands.)

c = 124, v = 0: Omni Mode Off 
c = 125, v = 0: Omni Mode On 
c = 126, v = M: Mono Mode On (Poly Off) where M is the number of channels (Omni Off) or 0 (Omni On) 
c = 127, v = 0: Poly Mode On (Mono Off) (Note: These four messages also cause All Notes Off)




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