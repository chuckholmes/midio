window.Buffer = window.Buffer || {};

window.Buffer.utils = (function() {
    
    return {
        byteArrayToBuffer: byteArrayToBuffer,
        byteStringToBuffer: byteStringToBuffer,
        base64ToBuffer: base64ToBuffer,

        bufferToByteArray: bufferToByteArray,
        bufferToByteString: bufferToByteString,
        bufferToBase64: bufferToBase64
    };
    
        
    function byteArrayToBuffer(byteArray) { 
        
        var buffer = new ArrayBuffer(byteArray.length);
        var view = new Uint8Array(buffer);
                
        for (var i = 0; i < byteArray.length; i++) {
            view[i] = byteArray[i];
        }          
        
        return buffer;        
    }
        
    function byteStringToBuffer(byteString) {
                        
        var buffer = new ArrayBuffer(byteString.length);
        var view = new Uint8Array(buffer);                

        for (var i = 0; i < byteString.length; i++) {
            view[i] = byteString.charCodeAt(i);
        }          
        
        return buffer;        
    }
    
    function base64ToBuffer(base64) {
        
        var bytes = window.atob(base64);
        var buffer = byteStringToBuffer(bytes);
        
        return buffer;
    }


    function bufferToByteArray(buffer) {     
        // not implemented   
    }
             
    function bufferToByteString(buffer) {
        
        var byteArray = new Uint8Array(buffer);
        var bytes = '';
        
        for (var i = 0; i < byteArray.byteLength; i++) {            
            bytes += String.fromCharCode(byteArray[i]);
        }
        
        return bytes;        
    }
    
    function bufferToBase64(buffer) {
        // not implemented
    }

        
})();


