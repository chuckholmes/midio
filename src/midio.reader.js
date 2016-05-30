window.Midio = window.Midio || {};

window.Midio.Reader = (function (){

    var _builder = new Midio.Builder();

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

        var channel = status & 0x0f;
        var type = status >> 4;
        var param1 = reader.readUint8();
        var param2 = null;

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


