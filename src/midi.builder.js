window.Midi = window.Midi || {};

window.Midi.Builder = function (){

	var SEQUENCE = 0x00, TEXT = 0x01, COPYRIGHT = 0x02, TRACK_NAME = 0x03, INSTRUMENT = 0x04, LYRICS = 0x05, MARKER = 0x06,
        CUR_POINT = 0x07, NOTE_OFF = 0x8, NOTE_ON = 0x9, NOTE_AFTERTOUCH = 0xA, CONTROLLER = 0xB, PROGRAM = 0xC, CHANNEL_AFTERTOUCH = 0xD,
        PITCH_BEND = 0xE, CHANNEL_PREFIX = 0x20, END_OF_TRACK =  0x2f, TEMPO = 0x51, SMPTE = 0x54, TIME_SIGNATURE = 0x58, KEY_SIGNATURE = 0x59;
                     
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
                if (msg.length != 2) throw "Expected length for sequence-number event is 2, got " + msg.length;
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
                if (msg.length != 1) throw "Expected length for midi-channel-prefix event is 1, got " + msg.length;
                event.channel = reader.readInt8();
                break;                
            case 0x2f:
                event.type = 'end-of-track';
                if (msg.length !== 0) throw "Expected length for end-of-track event is 0, got " + msg.length;
                break;                
            case 0x51:
                event.type = 'set-tempo';
                if (msg.length != 3) throw "Expected length for set-tempo event is 3, got " + msg.length;
                event.microsecondsPerBeat = ((reader.readInt8() << 16) + (reader.readInt8() << 8) + reader.readInt8());
                break;
            case 0x54:
                event.type = 'smpte-offset';
                if (msg.length != 5) throw "Expected length for smpte-offset event is 5, got " + msg.length;
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
                if (msg.length != 4) throw "Expected length for time-signature event is 4, got " + msg.length;
                event.numerator = reader.readInt8();
                event.denominator = Math.pow(2, reader.readInt8());
                event.metronome = reader.readInt8();
                event.thirtyseconds = reader.readInt8();
                break;
            case 0x59:
                event.type = 'key-signature';
                if (msg.length != 2) throw "Expected length for key-signature event is 2, got " + msg.length;
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
        
        var event = {};
                
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
        
    }

};