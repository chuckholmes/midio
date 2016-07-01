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

    // read a MIDI-style variable-length integer (big-endian value in groups of 7 bits,
    // with top bit set to signify that another byte follows)           
	function readVarInt() {
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