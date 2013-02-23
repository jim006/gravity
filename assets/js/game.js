//Enable Console log in opera
if(window.opera){ console = {log:window.opera.postError} }
/**
 * This is the Main JS File
 */
$(function(){
    //Init Crafty
    Crafty.init(800,820);
    
    //play the loading scene
    Crafty.scene("Loading");
});


