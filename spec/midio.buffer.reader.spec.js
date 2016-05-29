
describe("Mido.buffer.Reader", function (){

    it("should read Int8", function () {

       var input = [-127, 127];
       var array = new Int8Array(input);
       var reader = new BufferReader(array.buffer);

       expect(reader.readInt8()).toBe(input[0]);
       expect(reader.readInt8()).toBe(input[1]);
    });

    it("should read Uint8", function () {

       var input = [0, 255];
       var array = new Uint8Array(input);
       var reader = new BufferReader(array.buffer);

       expect(reader.readUint8()).toBe(input[0]);
       expect(reader.readUint8()).toBe(input[1]);
    });

    it("should read Int16", function () {

       var input = [32767, -32768];
       var view = new DataView(new ArrayBuffer(4));

       view.setInt16(0, input[0]);
       view.setInt16(2, input[1]);

       var reader = new BufferReader(view.buffer);

       expect(reader.readInt16()).toBe(input[0]);
       expect(reader.readInt16()).toBe(input[1]);
    });

    it("should read Uint16", function () {

       var input = [0, 65,534];
       var view = new DataView(new ArrayBuffer(4));

       view.setUint16(0, input[0]);
       view.setUint16(2, input[1]);

       var reader = new BufferReader(view.buffer);

       expect(reader.readUint16()).toBe(input[0]);
       expect(reader.readUint16()).toBe(input[1]);
    });

    it("should read Int32", function () {

       var input = [-2147483647, 2147483647];
       var view = new DataView(new ArrayBuffer(8));

       view.setInt32(0, input[0]);
       view.setInt32(4, input[1]);

       var reader = new BufferReader(view.buffer);

       expect(reader.readInt32()).toBe(input[0]);
       expect(reader.readInt32()).toBe(input[1]);
    });

    it("should read Uint32", function () {

       var input = [0, 4294967295];
       var view = new DataView(new ArrayBuffer(8));

       view.setUint32(0, input[0]);
       view.setUint32(4, input[1]);

       var reader = new BufferReader(view.buffer);

       expect(reader.readUint32()).toBe(input[0]);
       expect(reader.readUint32()).toBe(input[1]);
    });
    
    it("should read Float32", function () {

       var input = [0, 10];
       var view = new DataView(new ArrayBuffer(8));
       
       view.setFloat32(0, input[0]);
       view.setFloat32(4, input[1]);

       var reader = new BufferReader(view.buffer);

       expect(reader.readFloat32()).toBe(input[0]);
       expect(reader.readFloat32()).toBe(input[1]);
    });    

    it("should read Float64", function () {
       
       var input = [1, 10];
       var view = new DataView(new ArrayBuffer(16));

       view.setFloat64(0, input[0]);
       view.setFloat64(8, input[1]);

       var reader = new BufferReader(view.buffer);

       expect(reader.readFloat64()).toBe(input[0]);
       expect(reader.readFloat64()).toBe(input[1]);
    }); 

    it('should read VarInt', function () {

        var input = 160000;
       
        var writer = new BufferWriter();
        writer.writeVarInt(input);

        var reader = new BufferReader(writer.getBuffer());
        var output = reader.readVarInt();

        expect(output).toBe(input);
    });

    it("should read String", function () {
        
        var input = "hello world";
        
        var buffer = Buffer.utils.byteStringToBuffer(input);
        var reader = new BufferReader(buffer);        
        var output = reader.readString(buffer.byteLength);

        expect(output).toBe(input);
    });

});