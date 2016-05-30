window.Midio = window.Midio || {};

window.Midio.Builder = function (){

    return {
        buildDetail: buildDetail,
        buildMessage: buildMessage,
        buildMidiDetails: buildMidiDetails,
        buildMidiMessages: buildMidiMessages
    };

    function buildMidiDetails (input) {

        var builder = new Midio.Builder();

        var output = { 
            header: { 
                type: input.header.type, 
                timeDivision: input.header.timeDivision, 
                trackCount: input.header.trackCount 
            }, 
            tracks: [] 
        };

        input.tracks.forEach(function (trkIn) {
            var trkOut = [];
            trkIn.forEach(function (msgIn) {
                var msgOut = builder.buildDetail(msgIn);
                if (msgOut) trkOut.push(msgOut);
            });
            output.tracks.push(trkOut);
        });

        return output;
    }

    function buildMidiMessages (input) {

        var builder = new Midio.Builder();

        var output = { 
            header: { 
                type: input.header.type, 
                timeDivision: input.header.timeDivision, 
                trackCount: input.header.trackCount 
            },
            tracks: [] 
        };

        input.tracks.forEach(function (trkIn) {
            var trkOut = [];
            trkIn.forEach(function (msgIn) {
                var msgOut = builder.buildMessage(msgIn);
                if (msgOut) trkOut.push(msgOut);
            });
            output.tracks.push(trkOut);
        });

        return output;
    }

    function buildDetail (message) {

        var detail = {};
        var reader = (message.data) ? new Midio.BufferReader(message.data) : null;                                

        switch (message.type) {

            // meta messages
            case 0x00:
                detail.type = 'sequence-number';
                detail.number = reader.readInt16();
                break;
            case 0x01:
                detail.type = 'text';
                detail.text = reader.readString(message.length);
                break;
            case 0x02:
                detail.type = 'copyright';
                detail.text = reader.readString(message.length);
                break;
            case 0x03:
                detail.type = 'track-name';
                detail.text = reader.readString(message.length);
                break;
            case 0x04:
                detail.type = 'instrument';
                detail.text = reader.readString(message.length);
                break;
            case 0x05:
                detail.type = 'lyrics';
                detail.text = reader.readString(message.length);
                break;
            case 0x06:
                detail.type = 'marker';
                detail.text = reader.readString(message.length);
                break;
            case 0x07:
                detail.type = 'cue-point';
                detail.text = reader.readString(message.length);
                break;
            case 0x20:
                detail.type = 'channel-prefix';
                detail.channelNumber = reader.readInt8();
                break;
            case 0x2f:
                detail.type = 'end-track';
                break;
            case 0x51:
                detail.type = 'set-tempo';
                detail.microsecondsPerBeat = ((reader.readUint8() << 16) + (reader.readUint8() << 8) + reader.readUint8());
                break;
            case 0x54:
                detail.type = 'smpte-offset';
                var hourByte = reader.readInt8();
                detail.frameRate = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 }[hourByte & 0x60];
                detail.hour = hourByte & 0x1f;
                detail.min = reader.readInt8();
                detail.sec = reader.readInt8();
                detail.frame = reader.readInt8();
                detail.subframe = reader.readInt8();
                break;
            case 0x58:
                detail.type = 'time-signature';
                detail.numerator = reader.readInt8();
                detail.denominator = Math.pow(2, reader.readInt8());
                detail.metronome = reader.readInt8();
                detail.thirtyseconds = reader.readInt8();
                break;
            case 0x59:
                detail.type = 'key-signature';
                detail.key = reader.readInt8();
                detail.scale = reader.readInt8();
                break;
            case 0x7f:
                detail.type = 'sequencer-specific';
                detail.data = reader.read(length);
                break;

            // channel messages
            case 0x08:
                detail.type = 'note-off';
                detail.note = message.param1;
                detail.velocity = message.param2;
                break;
            case 0x09:
                detail.type = (message.param2 === 0) ? 'note-off' : 'note-on';
                detail.note = message.param1;
                detail.velocity = message.param2;
                break;
            case 0x0a:
                detail.type = 'note-aftertouch';
                detail.note = message.param1;
                detail.amount = message.param2;
                break;
            case 0x0b:
                detail.type = 'controller';
                detail.controllerType = message.param1;
                detail.value = message.param2;
                break;
            case 0x0c:
                detail.type = 'program-change';
                detail.programNumber = message.param1;
                break;
            case 0x0d:
                detail.type = 'channel-aftertouch';
                detail.amount = message.param1;
                break;
            case 0x0e:
                detail.type = 'pitch-bend';
                detail.value = message.param1 + (message.param2 << 7);
                break;

            default:
                console.log('Unrecognised Message Type: ' + message.type);          
        }

        if (message.data === undefined) {
            detail.channel = message.channel || 0;
            detail.delta = message.delta || 0;
        }

        return detail;
    }

    function buildMessage (detail) {

        var writer = new Midio.BufferWriter();
        var message = {};

        switch (detail.type) {

            // meta messages
            case 'sequence-number':
                message.type = 0x00;
                message.data = writer.writeInt16(detail.number).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'text':
                message.type = 0x01;
                message.data = writer.writeString(detail.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'copyright':
                message.type = 0x02;
                message.data = writer.writeString(detail.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'track-name':
                message.type = 0x03;
                message.data = writer.writeString(detail.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'instrument':
                message.type = 0x04;
                message.data = writer.writeString(detail.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'lyrics':
                message.type = 0x05;
                message.data = writer.writeString(detail.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'marker':
                message.type = 0x06;
                message.data = writer.writeString(detail.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'cue-point':
                message.type = 0x07;
                message.data = writer.writeString(detail.text).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'channel-prefix':
                message.type = 0x20;
                message.data = writer.writeInt8(detail.channelNumber).getBuffer();
                message.length = message.data.byteLength;
                break;
            case 'end-track':
                message.type = 0x2f;
                message.data = null;
                message.length = 0;
                break;                
            case 'set-tempo':
                message.type = 0x51;
                var hex = detail.microsecondsPerBeat.toString(16);
                writer.writeUint8(parseInt(hex.substring(0, 1), 16));
                writer.writeUint8(parseInt(hex.substring(1, 3), 16));
                writer.writeUint8(parseInt(hex.substring(3, 5), 16));
                message.data = writer.getBuffer();
                message.length = message.data.byteLength;
                break;                                
            case 'time-signature':
                message.type = 0x58;                
                writer.writeUint8(detail.numerator);
                writer.writeUint8(Math.round(Math.sqrt(detail.denominator)));
                writer.writeUint8(detail.metronome);
                writer.writeUint8(detail.thirtyseconds);                                    
                message.data = writer.getBuffer();
                message.length = message.data.byteLength;
                break;
                
            case 'key-signature':
                message.type = 0x59;
                writer.writeInt8(detail.key);
                writer.writeInt8(detail.scale);
                message.data = writer.getBuffer();
                message.length = message.data.byteLength;
                break;                                                                            

            // channel messages
            case 'note-off':
                message.type = 0x08;
                message.param1 = detail.note;
                message.param2 = detail.velocity;
                break;
            case 'note-on':
                message.type = 0x09;
                message.param1 = detail.note;
                message.param2 = detail.velocity;
                break;
            case 'note-aftertouch':
                message.type = 0x0a;
                message.param1 = detail.note;
                message.param2 = detail.amount;
                break;
            case 'controller':
                message.type = 0x0b;
                message.param1 = detail.controllerType;
                message.param2 = detail.value;
                break;
            case 'program-change':
                message.type = 0x0c;
                message.param1 = detail.programNumber;
                message.param2 = null;
                break;
            case 'channel-aftertouch':
                message.type = 0x0d;
                message.param1 = detail.amount;
                message.param2 = null;
                break;
                
            case 'pitch-bend':
                message.type = 0x0e;
                message.param2 = Math.floor(detail.value / 128);
                message.param1 = detail.value % 128;
                break;
                
            default: 
                console.log('Unrecognised Message Type: ' + detail.type);
                message = null;
        }
                
        if (detail.channel !== undefined) message.channel = detail.channel;
        if (detail.delta !== undefined) message.delta = detail.delta;

        return message;
    }

};