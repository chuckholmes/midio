
### Midio Object Types

```javascript

    var midi = Midio.read(buffer);
    var buffer = Midio.write(midi)

    var messages = Midio.readMessages(buffer); 
    
    var event = Midio.buildEvent(msg);
        
    var message = Midio.buildMessage(event);        

    //var eventBuilder = new Midio.EventBuilder();
    // var messageBuilder = new Midio.MessageBuilder();
               

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

    let Midio.Message = {
        bytes: [],        
    }
    
    let Midio.ShortMessage = {
        delta: null,        
        channel: null,
        type: null,        
        param1: null,
        param2: null
    }
    
    let Midio.MetaMessage = {        
        type: null,
        data: [],   
    }
    
    let Midio.Event = {
        tick: null,
        message: null   
    }
    
    
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
                

```