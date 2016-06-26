window.Midio = window.Midio || {};

window.Midio.Builder = function (){

    return {
        buildMetaMessage: buildMetaMessage,
        buildChannelMessage: buildChannelMessage,
        buildLongMessage: buildLongMessage,
        buildShortMessage: buildShortMessage
    };

    function buildMetaMessage (input) {

        var output = {};
        var reader = (input.data) ? new Midio.BufferReader(input.data) : null;                                

        switch (input.type) {
            
            case 0x00:
                output.type = 'sequence-number';
                output.value = reader.readInt16();
                break;
            case 0x01:
                output.type = 'text';
                output.text = reader.readString(input.length);
                break;
            case 0x02:
                output.type = 'copyright';
                output.text = reader.readString(input.length);
                break;
            case 0x03:
                output.type = 'track-name';
                output.text = reader.readString(input.length);
                break;
            case 0x04:
                output.type = 'instrument-name';
                output.text = reader.readString(input.length);
                break;
            case 0x05:
                output.type = 'lyrics';
                output.text = reader.readString(input.length);
                break;
            case 0x06:
                output.type = 'marker';
                output.text = reader.readString(input.length);
                break;
            case 0x07:
                output.type = 'cue-point';
                output.text = reader.readString(input.length);
                break;
            case 0x08:
                output.type = 'program-name';
                output.text = reader.readString(input.length);
                break;
            case 0x09:
                output.type = 'device-name';
                output.text = reader.readString(input.length);
                break;                
            case 0x20:
                output.type = 'channel-prefix';
                output.channel = reader.readInt8();
                break;
            case 0x21:
                output.type = 'midi-port';
                output.port = reader.readInt8();
                break;                
            case 0x2f:
                output.type = 'end-of-track';
                break;
            case 0x51:
                output.type = 'set-tempo';
                output.tempo = ((reader.readUint8() << 16) + (reader.readUint8() << 8) + reader.readUint8());
                break;
            case 0x54:
                output.type = 'smpte-offset';
                var hourByte = reader.readInt8();
                output.frameRate = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 }[hourByte & 0x60];
                output.hour = hourByte & 0x1f;
                output.min = reader.readInt8();
                output.sec = reader.readInt8();
                output.frame = reader.readInt8();
                output.subframe = reader.readInt8();
                break;
            case 0x58:
                output.type = 'time-signature';
                output.numerator = reader.readInt8();
                output.denominator = Math.pow(2, reader.readInt8());
                output.metronome = reader.readInt8();
                output.thirtyseconds = reader.readInt8();
                break;
            case 0x59:
                output.type = 'key-signature';
                output.key = reader.readInt8();
                output.scale = reader.readInt8();
                break;
            case 0x7f:
                output.type = 'sequencer-specific';
                output.data = reader.read(length);
                break;            
            default:
                console.log('Unrecognised Message Type: ' + input.type);          
        }
        
        return output;
    }

    function buildChannelMessage (input) {

        var output = {};                                        

        switch (input.type) {                        
            case 0x08:
                output.type = 'note-off';
                output.note = input.param1;
                output.velocity = input.param2;
                break;
            case 0x09:
                output.type = (input.param2 === 0) ? 'note-off' : 'note-on';
                output.note = input.param1;
                output.velocity = input.param2;
                break;
            case 0x0a:
                output.type = 'key-pressure';
                output.note = input.param1;
                output.pressure = input.param2;
                break;
            case 0x0b:
                output.type = 'control-change';
                output.control = input.param1;
                output.value = input.param2;
                break;
            case 0x0c:
                output.type = 'program-change';
                output.program = input.param1;
                break;
            case 0x0d:
                output.type = 'channel-pressure';
                output.pressure = input.param1;
                break;
            case 0x0e:
                output.type = 'pitch-bend';
                output.value = input.param1 + (input.param2 << 7);
                break;
            default:
                console.log('Unrecognised Message Type: ' + input.type);          
        }
        
        output.channel = input.channel || 0;
        output.delta = input.delta || 0;    

        return output;
    }

    function buildLongMessage (input) {

        var writer = new Midio.BufferWriter();
        var output = {};

        switch (input.type) {            
            case 'sequence-number':
                output.type = 0x00;
                output.data = writer.writeInt16(input.value).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'text':
                output.type = 0x01;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'copyright':
                output.type = 0x02;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'track-name':
                output.type = 0x03;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'instrument-name':
                output.type = 0x04;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'lyrics':
                output.type = 0x05;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'marker':
                output.type = 0x06;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'cue-point':
                output.type = 0x07;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'program-name':
                output.type = 0x08;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'device-name':
                output.type = 0x09;
                output.data = writer.writeString(input.text).getBuffer();
                output.length = output.data.byteLength;
                break;                
            case 'channel-prefix':
                output.type = 0x20;
                output.data = writer.writeInt8(input.channel).getBuffer();
                output.length = output.data.byteLength;
                break;
            case 'midi-port':
                output.type = 0x21;
                output.data = writer.writeInt8(input.port).getBuffer();
                output.length = output.data.byteLength;
                break;                
            case 'end-of-track':
                output.type = 0x2f;
                output.data = null;
                output.length = 0;
                break;                
            case 'set-tempo':
                output.type = 0x51;
                var hex = input.tempo.toString(16);
                writer.writeUint8(parseInt(hex.substring(0, 1), 16));
                writer.writeUint8(parseInt(hex.substring(1, 3), 16));
                writer.writeUint8(parseInt(hex.substring(3, 5), 16));
                output.data = writer.getBuffer();
                output.length = output.data.byteLength;
                break;                                
            case 'time-signature':
                output.type = 0x58;                
                writer.writeUint8(input.numerator);
                writer.writeUint8(Math.round(Math.sqrt(input.denominator)));
                writer.writeUint8(input.metronome);
                writer.writeUint8(input.thirtyseconds);                                    
                output.data = writer.getBuffer();
                output.length = output.data.byteLength;
                break;                
            case 'key-signature':
                output.type = 0x59;
                writer.writeInt8(input.key);
                writer.writeInt8(input.scale);
                output.data = writer.getBuffer();
                output.length = output.data.byteLength;
                break;
            default:
                output = null;
        }

        return output;                                               
    }

    function buildShortMessage (input) {

        var writer = new Midio.BufferWriter();
        var output = {};

        switch (input.type) {                      
            case 'note-off':
                output.type = 0x08;
                output.param1 = input.note;
                output.param2 = input.velocity;
                break;
            case 'note-on':
                output.type = 0x09;
                output.param1 = input.note;
                output.param2 = input.velocity;
                break;
            case 'key-pressure':
                output.type = 0x0a;
                output.param1 = input.note;
                output.param2 = input.pressure;
                break;
            case 'control-change':
                output.type = 0x0b;
                output.param1 = input.control;
                output.param2 = input.value;
                break;
            case 'program-change':
                output.type = 0x0c;
                output.param1 = input.program;
                output.param2 = null;
                break;
            case 'channel-pressure':
                output.type = 0x0d;
                output.param1 = input.pressure;
                output.param2 = null;
                break;                
            case 'pitch-bend':
                output.type = 0x0e;
                output.param2 = Math.floor(input.value / 128);
                output.param1 = input.value % 128;
                break;                
            default:                 
                output = null;
        }

        if (output) {
            output.channel = (input.channel !== undefined) ? input.channel : undefined;
            output.delta = (input.delta !== undefined) ? input.delta : undefined;
        }
        
        return output;
    }
    
};