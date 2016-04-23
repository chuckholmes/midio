describe("Buffer.Writer", function (){
    
    it('should write Int8', function (){

       var input = [-127, 127];         
        var writer = new BufferWriter();
                
        writer.writeInt8(input[0]);
        writer.writeInt8(input[1]);
                                        
        var view = new DataView(writer.getBuffer());      
                  
        expect(view.buffer.byteLength).toBe(2);
        expect(view.getInt8(0)).toBe(input[0]);
        expect(view.getInt8(1)).toBe(input[1]);               
    });
    
    it('should write Uint8', function (){
        
        var input = [0, 255];  
        var writer = new BufferWriter();
                
        writer.writeUint8(input[0]);
        writer.writeUint8(input[1]);
                                        
        var view = new DataView(writer.getBuffer());      
                  
        expect(view.buffer.byteLength).toBe(2);
        expect(view.getUint8(0)).toBe(input[0]);
        expect(view.getUint8(1)).toBe(input[1]);                                  
    });
        
    it('should write Int16', function (){

        var input = [32767, -32768];                                
        var writer = new BufferWriter();
                
        writer.writeInt16(input[0]);
        writer.writeInt16(input[1]);
                                        
        var view = new DataView(writer.getBuffer());      
                  
        expect(view.buffer.byteLength).toBe(4);
        expect(view.getInt16(0)).toBe(input[0]);
        expect(view.getInt16(2)).toBe(input[1]);                 
    });

    it('should write Uint16', function (){

        var input = [0, 65,534];                                               
        var writer = new BufferWriter();
                
        writer.writeUint16(input[0]);
        writer.writeUint16(input[1]);
                                        
        var view = new DataView(writer.getBuffer());      
                  
        expect(view.buffer.byteLength).toBe(4);
        expect(view.getUint16(0)).toBe(input[0]);
        expect(view.getUint16(2)).toBe(input[1]);                
    });
    
    it('should write Int32', function (){

        var input = [-2147483647, 2147483647];                                 
        var writer = new BufferWriter();
                
        writer.writeInt32(input[0]);
        writer.writeInt32(input[1]);
                                        
        var view = new DataView(writer.getBuffer());      
                  
        expect(view.buffer.byteLength).toBe(8);
        expect(view.getInt32(0)).toBe(input[0]);
        expect(view.getInt32(4)).toBe(input[1]);                 
    });
    
    it('should write Uint32', function (){

        var input = [0, 4294967295];                                       
        var writer = new BufferWriter();
                
        writer.writeUint32(input[0]);
        writer.writeUint32(input[1]);
                                        
        var view = new DataView(writer.getBuffer());      
                  
        expect(view.buffer.byteLength).toBe(8);
        expect(view.getUint32(0)).toBe(input[0]);
        expect(view.getUint32(4)).toBe(input[1]);                 
    });    

    it('should write Float32', function (){

        var input = [0, 10];                                       
        var writer = new BufferWriter();
                
        writer.writeFloat32(input[0]);
        writer.writeFloat32(input[1]);
                                        
        var view = new DataView(writer.getBuffer());      
                  
        expect(view.buffer.byteLength).toBe(8);
        expect(view.getFloat32(0)).toBe(input[0]);
        expect(view.getFloat32(4)).toBe(input[1]);                 
    });    

    it('should write Float64', function (){

        var input = [0, 10];                                       
        var writer = new BufferWriter();
                
        writer.writeFloat64(input[0]);
        writer.writeFloat64(input[1]);
                                        
        var view = new DataView(writer.getBuffer());      
                  
        expect(view.buffer.byteLength).toBe(16);
        expect(view.getFloat64(0)).toBe(input[0]);
        expect(view.getFloat64(8)).toBe(input[1]);                 
    });             
               
    it('should write VarInt', function () {
       
        var input = 160000;       
       
        var writer = new BufferWriter();        
        writer.writeVarInt(input);                        
               
        var reader = new BufferReader(writer.getBuffer());
        var output = reader.readVarInt();
        
        expect(output).toBe(input);                                 
    });

    it('should write String', function () {
        
        var input = 'Hello World';
        
        var writer = new BufferWriter();
        writer.writeString(input);
        
        var reader = new BufferReader(writer.getBuffer());
        var output = reader.readString(input.length);
        
        expect(output).toBe(input);                       
    });
        
    it('should write Buffer', function () {
       
        var input =  new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05]);
                        
        var writer = new BufferWriter(); 
        writer.writeBuffer(input.buffer);
        
        var output = new Uint8Array(writer.getBuffer());
        
        expect(output.byteLength).toBe(input.buffer.byteLength);
        
        for (var i = 0; i < input.length; i++) {
            expect(output[i]).toBe(input[i]);    
        }                                             
    });
        
});


