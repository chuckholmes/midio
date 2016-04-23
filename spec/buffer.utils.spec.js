describe("Buffer.Reader", function (){
      
    var _b64 = "TVRoZAAAAAYAAAABAIBNVHJrAAAAFgCQPFqBAIA8WgCQPlqBAIA+WgD/LwA=";
    var _binary = window.atob(_b64);              
    var _buffer;
    
    beforeEach(function(){
            
        _buffer = Buffer.utils.base64ToBuffer(_b64);          
    });       
    
    
    it("should convert buffer to bytes", function (){
       
       var bytes = Buffer.utils.bufferToByteString(_buffer);
       
       expect(bytes.length).toBe(_buffer.byteLength);       
       expect(bytes).toBe(_binary);
       expect(window.btoa(bytes)).toBe(_b64);               
    });    
    
});