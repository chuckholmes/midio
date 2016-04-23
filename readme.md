
### Midio Object Types

```javascript

    var midi = Midio.read(buffer);
    var buffer = Midio.write(midi)

    var messages = Midio.readMessages(buffer); 
    
    var event = Midio.buildEvent(msg);
        
    var message = Midio.buildMessage(event);        

    //var eventBuilder = new Midio.EventBuilder();
    // var messageBuilder = new Midio.MessageBuilder();
               

    var NOTE_OFF = 0x08;
    var NOTE_ON = 0x09;
    var NOTE_AFTERTOUCH = 0x0a;
    var CONTROLLER = 0x0b;
    var PROGRAM_CHANGE = 0x0c;
    var CHANNEL_AFTERTOUCH = 0x0d;
    var PITCH_BEND = 0x0e;

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
                

```