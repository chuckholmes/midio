window.Midio = window.Midio || {};

window.Midio.BufferReader = function (buffer) {
                                   
    var _view = new DataView(buffer);               
    var _position = 0;
                
    return {        
        buffer: buffer,                
        dataView: _view,        
        getPosition: getPosition,                        
        readInt8: readInt8,
        readUint8: readUint8,
        readInt16: readInt16,
        readUint16: readUint16,
        readInt32: readInt32,
        readUint32: readUint32,
        readFloat32: readFloat32,
        readFloat64: readFloat64,                
        readBuffer: readBuffer,
        readString: readString,
        readVarInt: readVarInt           
    };        
        
    
    function getPosition() {
        return _position;
    }
    
    function readBuffer(length) {
        result = buffer.slice(_position, (_position+length));
        _position += length;
        return result;        
    }
    
    function readString(length) {
        
        var result = '';        
        
        for (var i=_position; i<(_position+length); i++) {
            result += String.fromCharCode(_view.getUint8(i));                       
        }
        
        _position += length;
        return result;
    }
    
    function readInt8() {
        var result = _view.getInt8(_position);
        _position += 1;        
        return result;
    }    
    
    function readUint8() {        
        var result = _view.getUint8(_position);
        _position += 1;
        return result;
    }    
    
    function readInt16(littleEndian) {        
        var result = _view.getInt16(_position, littleEndian || false);
        _position += 2;        
        return result;
    }
        
    function readUint16(littleEndian) {        
        var result = _view.getUint16(_position, littleEndian || false);
        _position += 2;        
        return result;
    }

    function readInt32(littleEndian) {        
        var result = _view.getInt32(_position, littleEndian || false);
        _position += 4;        
        return result;
    }

    function readUint32(littleEndian) {        
        var result = _view.getUint32(_position, littleEndian | false);
        _position += 4;        
        return result;
    }

    function readFloat32(littleEndian) {
        var result = _view.getFloat32(_position, littleEndian | false);
        _position += 4;        
        return result;
    }
        
    function readFloat64(littleEndian) {
        var result = _view.getFloat64(_position, littleEndian | false);
        _position += 8;        
        return result;
    }

    	
	function readVarInt() {

        // read a MIDI-style variable-length integer (big-endian value in groups of 7 bits,
        // with top bit set to signify that another byte follows)       
         
		var result = 0;
        
		while (true) {
			var b = readInt8();
			if (b & 0x80) {
				result += (b & 0x7f);
				result <<= 7;
			} else {
				/* b is the last byte */
				return result + b;
			}
		}
	}        

};
window.Midio = window.Midio || {};

window.Midio.BufferWriter = function (buffer) {
        
    var _buffer = buffer || new ArrayBuffer();
    var _position = 0;
    
    return {        
        writeInt8: writeInt8,
        writeUint8: writeUint8,
        writeInt16: writeInt16,
        writeUint16: writeUint16,
        writeInt32: writeInt32,
        writeUint32: writeUint32,
        writeFloat32: writeFloat32,
        writeFloat64: writeFloat64,        
        writeVarInt: writeVarInt,
        writeString: writeString,
        writeBuffer: writeBuffer,
        getBuffer: getBuffer
    };
    
    function getBuffer () {
        return _buffer;
    }
    
    function writeInt8(value) {
                         
        _buffer = transfer(_buffer, (_buffer.byteLength + 1));        
        new DataView(_buffer).setInt8(_position, value);
        _position += 1;
        
        return this;                      
    }
    
    function writeUint8(value) {
                         
        _buffer = transfer(_buffer, (_buffer.byteLength + 1));
        new DataView(_buffer).setUint8(_position, value);
        _position += 1;
        
        return this;                      
    }
    
    function writeInt16(value, littleEndian) {
        
        var int16Length = 2;
                                
        _buffer = transfer(_buffer, (_buffer.byteLength + int16Length));
        new DataView(_buffer).setInt16(_position, value, littleEndian || false);
        _position += int16Length;
        
        return this;          
    }
        
    function writeUint16(value, littleEndian) {
        
        var uint16Length = 2;
        
        _buffer = transfer(_buffer, (_buffer.byteLength + uint16Length));
        new DataView(_buffer).setUint16(_position, value, littleEndian || false);
        _position += uint16Length;
        
        return this;          
    }    
    
    function writeInt32(value, littleEndian) {
        
        var int32Length = 4;
        
        _buffer = transfer(_buffer, (_buffer.byteLength + int32Length));
        new DataView(_buffer).setInt32(_position, value, littleEndian || false);
        _position += int32Length;

        return this;          
    }

    function writeUint32(value, littleEndian) {

        var uint32Length = 4;

        _buffer = transfer(_buffer, (_buffer.byteLength + uint32Length));
        new DataView(_buffer).setUint32(_position, value, littleEndian);
        _position += uint32Length;

        return this;          
    }

    function writeFloat32(value, littleEndian) {

        var float32Length = 4;

        _buffer = transfer(_buffer, (_buffer.byteLength + float32Length));
        new DataView(_buffer).setFloat32(_position, value, littleEndian);
        _position += float32Length;

        return this;
    }
    
    function writeFloat64(value, littleEndian) {

        var float64Length = 8;
        
        _buffer = transfer(_buffer, (_buffer.byteLength + float64Length));
        new DataView(_buffer).setFloat64(_position, value, littleEndian);
        _position += float64Length;

        return this;
    }

    function writeVarInt(value) {

        // create varInt
        var buffer = value & 0x7F;
        var bytes = [];
        
        while ((value = value >> 7)) {
            buffer <<= 8;
            buffer |= ((value & 0x7F) | 0x80);
        }

        while (true) {
            bytes.push(buffer & 0xff);

            if (buffer & 0x80)
                buffer >>= 8;
            else
                break;
        }

        // write varInt
        var length = bytes.length;
        _buffer = transfer(_buffer, (_buffer.byteLength + length));

        var view = new DataView(_buffer);

        for (var i = 0; i < length; i++) {
            view.setInt8(_position, bytes[i]);
            _position += 1;
        }

        return this;
    }

    function writeString(str) {

        var length = str.length;

        _buffer = transfer(_buffer, (_buffer.byteLength + length));
        var view = new DataView(_buffer);

        for (var i = 0; i < length; i++) {
            view.setUint8(_position, str.charCodeAt(i));
            _position += 1;
        }
        
        return this;
    }

    function writeBuffer(buffer) {

        var length = buffer.byteLength;        
        var byteArray = new Uint8Array(buffer);
        
        _buffer = transfer(_buffer, (_buffer.byteLength + length));
        var view = new DataView(_buffer);
        
        for (var i = 0; i < length; i++) {
            view.setUint8(_position, byteArray[i]);
            _position += 1;
        }

        return this;
    }

    function transfer(buffer, newByteLength) {
        var newBuffer = new ArrayBuffer(newByteLength);
        new Uint8Array(newBuffer).set(new Uint8Array(buffer));
        return newBuffer;                
    }

};
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
window.Midio = window.Midio || {};

window.Midio.Reader = (function (){

    var _builder = new Midio.Builder();
    var _lastStatus = null;

    return {
        read: read,
        readChunk: readChunk,
        readHeader: readHeader,
        readTrack: readTrack
    };

    function read (buffer) {

        var midi = {header: null, tracks:[]};
        var reader = new Midio.BufferReader(buffer);

        // read header
        var headerChunk = readChunk(reader);
               
        if (headerChunk.id !== 'MThd') {
            throw 'Invalid Header';
        }

        midi.header = readHeader(headerChunk.buffer);

        // read tracks
        for (var i = 0; i < midi.header.trackCount; i++) {

            var trackChunk = readChunk(reader); 

            if (trackChunk.id !== 'MTrk') {
                throw 'Invalid Track';
            }

            midi.tracks.push(readTrack(trackChunk.buffer));
        }

        return midi;
    }

    function readChunk (reader) {

        var id = reader.readString(4);
        var length = reader.readInt32();
        var buffer = reader.readBuffer(length);

        return {
            id: id,
            length: length,
            buffer: buffer
        };
    }

    function readHeader (buffer) {

        var reader = new Midio.BufferReader(buffer);

        var type = reader.readInt16();
        var trackCount = reader.readInt16();
        var timeDivision = reader.readInt16();

        return {
            type: type,
            trackCount: trackCount,
            timeDivision: timeDivision
        };
    }

    function readTrack (buffer) {
        
        var messages = [];
        var message, delta, status;

        var reader = new Midio.BufferReader(buffer);

        while (reader.getPosition() < reader.buffer.byteLength) {

            delta = reader.readVarInt();
            status = reader.readUint8();

            if ((status & 0xf0) == 0xf0) {
                message = readMetaMessage(reader);
            }
            else {                               
                message = readChannelMessage(delta, status, reader);
            }

            var detail = _builder.buildDetail(message);
            messages.push(detail);
        }

        return messages;
    }

    function readMetaMessage(reader) {
        
        var data = null;
        var type = reader.readUint8();
        var length = reader.readVarInt();

        if (length > 0) {
            data = reader.readBuffer(length);
        }

        return {
            type: type,
            length: length,
            data: data
        };
    }

    function readChannelMessage(delta, status, reader) {

        var param1 = null;
        var param2 = null;
        
        if ((status & 0x80) === 0) {
            param1 = status;
            status = _lastStatus;
        } else {
            param1 = reader.readUint8();
            _lastStatus = status;
        }

        var channel = status & 0x0f;
        var type = status >> 4;

        if (!param1) param1 = reader.readUint8();

        if (hasTwoParams(type)) {
            param2 = reader.readUint8();
        }

       return {
            delta: delta,
            channel: channel,
            type: type,
            param1: param1,
            param2: param2
        };
    }

    function hasTwoParams(type) {
        // note-off, note-on, note-aftertouch, controller, pitch-bend
        return [0x08, 0x09, 0x0a, 0x0b, 0x0e].includes(type);
    }

});



window.Midio = window.Midio || {};

window.Midio.Writer = (function (){
    
    var _builder = new Midio.Builder();
    
    return {
        write: write,
        writeChunk: writeChunk,
        writeHeader: writeHeader
    };
    
    function write(midi) {
        
        var writer = new Midio.BufferWriter();

        // write header
        var buffer = writeChunk('MThd', writeHeader(midi.header));
        writer.writeBuffer(buffer);
        
        // write tracks
        midi.tracks.forEach(function (track){
           buffer = writeChunk('MTrk', writeTrack(track));
           writer.writeBuffer(buffer);
        });

        return writer.getBuffer();
    }

    function writeChunk(id, buffer) {

        var writer = new Midio.BufferWriter();

        writer.writeString(id);
        writer.writeInt32(buffer.byteLength);
        writer.writeBuffer(buffer);

        return writer.getBuffer();
    }

    function writeHeader (header) {

        var writer = new Midio.BufferWriter();

        writer.writeInt16(header.type);
        writer.writeInt16(header.trackCount);
        writer.writeInt16(header.timeDivision);

        return writer.getBuffer();
    }

    function writeTrack (track) {

        var writer = new Midio.BufferWriter();

        track.forEach(function (detail){

            var message = _builder.buildMessage(detail);

            if (message.channel !== undefined) {
                writeShortMessage(writer, message);
            } else {
                writeMetaMessage(writer, message);
            }
        });

        return writer.getBuffer();
    }

    function writeMetaMessage (writer, message) {

        writer.writeUint8(0x0);
        writer.writeUint8(0xFF);
        writer.writeUint8(message.type);
        writer.writeVarInt(message.length);

        if (message.length > 0) {
            writer.writeBuffer(message.data);
        }
    }

    function writeShortMessage (writer, message) {

        writer.writeVarInt(message.delta);

        var status = parseInt(message.type.toString(16) + message.channel.toString(16), 16);

        writer.writeUint8(status);
        writer.writeUint8(message.param1);

        if (message.param2) {
            writer.writeUint8(message.param2);
        }
    }

});