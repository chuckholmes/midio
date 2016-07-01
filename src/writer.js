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