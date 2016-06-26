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
        var division = reader.readInt16();

        return {
            type: type,
            trackCount: trackCount,
            division: division
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
                message = _builder.buildMetaMessage(readLongMessage(reader));
            }
            else {
                message = _builder.buildChannelMessage(readShortMessage(delta, status, reader));
            }
            
            messages.push(message);
        }

        return messages;
    }

    function readLongMessage(reader) {
        
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

    function readShortMessage(delta, status, reader) {

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
        // note-off, note-on, key-pressure, control-change, pitch-bend
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
        writer.writeInt16(header.division);

        return writer.getBuffer();
    }

    function writeTrack (track) {

        var writer = new Midio.BufferWriter();

        track.forEach(function (message){
            writeMessage(writer, message);
        });

        return writer.getBuffer();
    }

    function writeMessage (writer, message) {

        var shortMessage = _builder.buildShortMessage(message);
        if (shortMessage) {
            writeShortMessage(writer, shortMessage);
            return;
        }

        var longMessage = _builder.buildLongMessage(message);
        if (longMessage) {
            writeLongMessage(writer, longMessage);
            return;
        }

        throw 'Unrecognised Message Type: ' + message.type;
    }

    function writeLongMessage (writer, message) {

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