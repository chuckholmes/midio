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

  function getBuffer() {
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

  // writes a MIDI-style variable-length integer (big-endian value in groups of 7 bits,
  // with top bit set to signify that another byte follows)
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
