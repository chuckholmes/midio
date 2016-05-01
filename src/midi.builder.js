window.Midi = window.Midi || {};

window.Midi.Builder = function (){
                     
    return {
        buildEvent: buildEvent,
        buildMessage: buildMessage
    };
        
    function buildEvent (msg) {                        
        
        var event = {};
        var reader = (msg.data) ? new BufferReader(msg.data) : null;        
                        
        //if (msg.channel !== undefined) event.channel = msg.channel;
        //if (msg.tick !== undefined) event.delta = msg.tick;
        
        switch (msg.command || msg.type) {
                        
            // meta events
            case 0x00:
                event.type = 'sequence-number';                
                event.number = reader.readInt16();
                break;                
            case 0x01:
                event.type = 'text';
                event.text = reader.readString(msg.length);
                break;
            case 0x02:
                event.type = 'copyright';
                event.text = reader.readString(msg.length);
                break;
            case 0x03:
                event.type = 'track-name';
                event.text = reader.readString(msg.length);
                break;
            case 0x04:
                event.type = 'instrument';
                event.text = reader.readString(msg.length);
                break;
            case 0x05:
                event.type = 'lyrics';
                event.text = reader.readString(msg.length);
                break;
            case 0x06:
                event.type = 'marker';
                event.text = reader.readString(msg.length);
                break;
            case 0x07:
                event.type = 'cue-point';
                event.text = reader.readString(msg.length);
                break;                
            case 0x20:
                event.type = 'midi-channel-prefix';                
                event.channel = reader.readInt8();
                break;                
            case 0x2f:
                event.type = 'end-of-track';                
                break;                
            case 0x51:
                event.type = 'set-tempo';                
                event.microsecondsPerBeat = ((reader.readUint8() << 16) + (reader.readUint8() << 8) + reader.readUint8());
                break;
            case 0x54:
                event.type = 'smpte-offset';                
                var hourByte = reader.readInt8();
                event.frameRate = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 }[hourByte & 0x60];
                event.hour = hourByte & 0x1f;
                event.min = reader.readInt8();
                event.sec = reader.readInt8();
                event.frame = reader.readInt8();
                event.subframe = reader.readInt8();
                break;
            case 0x58:
                event.type = 'time-signature';                
                event.numerator = reader.readInt8();
                event.denominator = Math.pow(2, reader.readInt8());
                event.metronome = reader.readInt8();
                event.thirtyseconds = reader.readInt8();
                break;
            case 0x59:
                event.type = 'key-signature';                
                event.key = reader.readInt8();
                event.scale = reader.readInt8();
                break;
            case 0x7f:
                event.type = 'sequencer-specific';
                event.data = reader.read(length);
                break;

            // channel events               
            case 0x08:
                event.type = 'note-off';
                event.note = msg.param1;
                event.velocity = msg.param2;
                break;
            case 0x09:
                event.type = (msg.param2 === 0) ? 'note-off' : 'note-on';
                event.note = msg.param1;
                event.velocity = msg.param2;                					
                break;
            case 0x0a:
                event.type = 'note-aftertouch';
                event.note = msg.param1;
                event.amount = msg.param2;
                break;
            case 0x0b:
                event.type = 'controller';
                event.controllerType = msg.param1;
                event.value = msg.param2;
                break;
            case 0x0c:
                event.type = 'program-change';
                event.programNumber = msg.param1;
                break;
            case 0x0d:
                event.type = 'channel-aftertouch';
                event.amount = msg.param1;
                break;
            case 0x0e:
                event.type = 'pitch-bend';
                event.value = msg.param1 + (msg.param2 << 7);
                break;
                                                
            default:                
                throw 'Unrecognised Message Type: ' + msg.type;           
        }

        if (msg.channel !== undefined) event.channel = msg.channel;
        if (msg.tick !== undefined) event.delta = msg.tick;
        
        return event;        
    }
        
        
    function buildMessage (event) {
                
        var writer = new BufferWriter();
        var message = {};
        
        if (event.channel) message.channel = event.channel;
        if (event.delta) message.delta = event.delta;
    
        switch (event.type) {

            // meta events
            case 'sequence-number':
                message = buildLongMessage(0x00, writer.readInt16(event.number).getBuffer());
                break;  
            case 'text':
                message.type = 0x01;
                message.data = writer.writeString(event.text).getBuffer();
                message.length = message.data.byteLength;
                break;                
            case 'copyright':
                message.type = 0x02;
                message.data = writer.writeString(event.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'track-name':
                message.type = 0x03;
                message.data = writer.writeString(event.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'instrument':
                message.type = 0x04;
                message.data = writer.writeString(event.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'lyrics':
                message.type = 0x05;
                message.data = writer.writeString(event.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'marker':
                message.type = 0x06;
                message.data = writer.writeString(event.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'cue-point':
                message.type = 0x07;
                message.data = writer.writeString(event.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'midi-channel-prefix':
                message.type = 0x20;
                message.data = writer.writeInt8(event.channel).getBuffer();
                message.length = message.data.byteLength;                                                
                break;                
            case 'end-of-track':
                message.type = 0x2f;
                message.data = null;
                message.length = 0;                
                break;                
            case 'set-tempo':
                message.type = 0x51;
                var hex = event.microsecondsPerBeat.toString(16);                
                writer.writeUint8(parseInt(hex.substring(0, 1), 16));                                
                writer.writeUint8(parseInt(hex.substring(1, 3), 16));
                writer.writeUint8(parseInt(hex.substring(3, 5), 16));
                message.data = writer.getBuffer();
                message.length = message.data.byteLength;                                            
                break;
                
                
            // channel events                
            case 'note-off':
                message.command = 0x08;
                message.param1 = event.note;
                message.param2 = event.velocity;                               
                break;
            case 'note-on':
                message.command = 0x09;
                message.param1 = event.note;
                message.param2 = event.velocity;                                                     					
                break;
            case 'note-aftertouch':
                message.command = 0x0a;
                message.param1 = event.note;
                message.param2 = event.amount;                
                break;                
            case 'controller':
                message.command = 0x0b;
                message.param1 = event.controllerType;
                message.param2 = event.value;                                                             
                break;
            case 'program-change':
                message.command = 0x0c;
                message.param1 = event.programNumber;
                message.param2 = null;                           
                break;
            case 'channel-aftertouch':
                message.command = 0x0c;
                message.param1 = event.amount;
                message.param2 = null;                                        
                break;                                               
                
            default: 
                message = {error: 'Unrecognised Event type: ' + event.type};                 
        }
        
        return message;               
    }
           
};