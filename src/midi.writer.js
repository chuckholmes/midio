window.Midi = window.Midi || {};

window.Midi.Writer = (function (){
    
    var _writer = new BufferWriter();
    
    return {
        write: write,
        writeChunk: writeChunk,
        writeHeader: writeHeader
    };
    
    function write(midi) {
        
        var buffer, writer = new BufferWriter();
                
        // write header
        buffer = writeChunk('MThd', writeHeader(midi.header));
        writer.writeBuffer(buffer);
        
        // write tracks
        midi.tracks.forEach(function (track){           
           buffer = writeChunk('MTrk', writeTrack(track));
           writer.writeBuffer(buffer);            
        });
                        
        return writer.getBuffer();                        
    }    
    
    function writeChunk(id, buffer) {
     
        var writer = new BufferWriter();
     
        writer.writeString(id);
        writer.writeInt32(buffer.byteLength);
        writer.writeBuffer(buffer);
        
        return writer.getBuffer();
    }
    
    function writeHeader (header) {
        
        var writer = new BufferWriter();
        
        writer.writeInt16(header.type);
        writer.writeInt16(header.trackCount);
        writer.writeInt16(header.timeDivision);
                
        return writer.getBuffer();        
    }
    
    function writeTrack (track) {
        
        var writer = new BufferWriter();
        
        track.forEach(function (msg){
            if (msg.channel !== undefined) {
                writeShortMessage(writer, msg);
            } else {
                writeMetaMessage(writer, msg);
            }
        });
        
        return writer.getBuffer();
    }
    
    function writeMetaMessage (writer, msg) {
        
        writer.writeUint8(0x0);
        writer.writeUint8(0xFF);                
        writer.writeUint8(msg.type);
        writer.writeVarInt(msg.length);
        
        if (msg.length > 0) {
            writer.writeBuffer(msg.data);    
        }        
    }
    
    function writeShortMessage (writer, msg) {
     
        writer.writeVarInt(msg.tick);
        
        var status = parseInt(msg.command.toString(16) + msg.channel.toString(16), 16);
     
        writer.writeUint8(status);
        writer.writeUint8(msg.param1);
        
        if (msg.param2) {
            writer.writeUint8(msg.param2);
        }                    
    }
    
});