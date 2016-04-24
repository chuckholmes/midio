window.Midi = window.Midi || {};

window.Midi.Builder = function (){
                     
    return {
        buildEvent: buildEvent,
        buildMessage: buildMessage
    };
        
    function buildEvent (msg) {                        
        return (msg.channel !== undefined) ? buildChannelEvent(msg) : buildMetaEvent(msg);        
    }
    
    function buildMetaEvent(msg) {
        
        var reader = (msg.data) ? new BufferReader(msg.data) : null;        
        var event = {};
        
        switch (msg.type) {
            
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
                event.microsecondsPerBeat = ((reader.readInt8() << 16) + (reader.readInt8() << 8) + reader.readInt8());
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
                                
            default:
                event.type = 'meta';
                event.msg = msg;                
        }
        
        return event;        
    }
    
    function buildChannelEvent(msg) {
        
        var event = {channel: msg.channel, delta: msg.tick};
                
        switch (msg.command || msg.type) {
            
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
                throw "Unrecognised MIDI event type: " + eventType;
        }
        
        return event;
        
    }
    
        
    function buildMessage (event) {
        
        return (event.channel !== undefined) ? buildChannelMessage(event) : buildMetaMessage(event);                   		
    }        
        
    function buildMetaMessage (event) {
        
        var writer = new BufferWriter();
        var message = {};
    
        switch (event.type) {

            case 'sequence-number':
                event.type = 0x00;                
                event.number = reader.readInt16();
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
                
            default: 
                return event;                
        }
        
        return message;               
    }
    

    
    function buildChannelMessage (event) {
        return event;
    }
    

    

};


        /*
        var msg = {};
        
        switch (event.type) {

			case 0x01: // text
				bytes = longMsgBytes(eventId, stringToBytes(e.text));
				break;

			case 0x02: // copyright
				bytes = longMsgBytes(eventId, stringToBytes(e.text));
				break;

			case 0x03: // track name
				bytes = longMsgBytes(eventId, stringToBytes(e.text));
				break;

			case 0x04: // instrument
				bytes = longMsgBytes(eventId, stringToBytes(e.text));
				break;

			case 0x05: // lyric
				bytes = longMsgBytes(eventId, stringToBytes(e.text));
				break;

			case 0x06: // marker
				bytes = longMsgBytes(eventId, stringToBytes(e.text));
				break;

			case 0x07: // cue point
				bytes = longMsgBytes(eventId, stringToBytes(e.text));
				break;

                          
			case 0x8: // note off
				bytes = shortMsgBytes(eventId, e.time, e.channel, e.note, e.velocity);
				break;

			case 0x9: // note on
				bytes = shortMsgBytes(eventId, e.time, e.channel, e.note, e.velocity);
				break;

			case 0xA: // note aftertouch
				bytes = shortMsgBytes(eventId, e.time, e.channel, e.note, e.value);
				break;

			case 0xB: // controller
				bytes = shortMsgBytes(eventId, e.time, e.channel, e.controller, e.value);
				break;

			case 0xC: // program change
				bytes = shortMsgBytes(eventId, e.time, e.channel, e.value);
				break;

			case 0xD: // channel aftertouch
				bytes = shortMsgBytes(eventId, e.time, e.channel, e.value);
				break;

			case 0xE: // pitch bend
				break;

			case 0x00: // sequence number
				break;

			case 0x20: // channel prefix
				bytes = longMsgBytes(0x20, [e.channel]);
				break;

			case 0x51: // tempo
				bytes = longMsgBytes(0x51, integerToBytes(e.mcsPerBeat));
				break;

			case 0x54: // smpte
				break;

			case 0x58: // time sig
				bytes = longMsgBytes(0x58, [e.numerator, Math.round(Math.sqrt(e.denominator)), e.metronome, e.thirtyseconds]);
				break;

			case 0x59: // key sig
				break;

			case 0x7F: // sequencer specific
				break;

			case 0x2F: // end of track
				break;
                
            */    