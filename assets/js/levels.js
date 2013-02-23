/**
 * This file describe different scenes
 */

//Loading Scene
Crafty.scene("Loading",function(){
    var toLoad = [];
    toLoad.push(game_path + "assets/img/loading.jpg", game_path + "assets/img/bg.png");
    for(var i in Crafty.assets){
        toLoad.push(i);
    }
    
    //Setup background image
    Crafty.background("black");
    
    $('#interface').hide();
    
    //Setup loading text
    var loadingText = Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
                        .text("Loading... 0%")
                        .css({ "text-align": "center" });
    
    Crafty.load(toLoad,
        function() {
            //Everything is loaded
            Crafty.scene("Level1");
        },
        function(e) {
            var src = e.src || "";
          
            //update progress
            loadingText.text("Loading... "+src.substr(src.lastIndexOf('/') + 1).toLowerCase()+" Loaded: "+~~e.percent+"%");
        },
        function(e) {
            //uh oh, error loading
            var src = e.src ||"";
            console.log("Error on loading: "+src.substr(src.lastIndexOf('/') + 1).toLowerCase());
        }
        );
},
//Uninit Scene
function(){
    Crafty.audio.stop();
    //Display loading interface
    $('#loading').hide();
});

//Level 1 Scene
Crafty.scene("Level1",function(){
    
    //Display interface
    $('#interface').show();
    
    //Setup background of level
    Crafty.background("url(" + game_path + "/assets/img/bg.png)");
          
    var spotEnemys = function(frame) {   
        //Spot one ball
        if(frame % 50 == 0){

        //Create the initial set of balls
        var marb = Crafty.math.randomInt(0,13);
        var pos = Crafty.math.randomInt(0,24);
        Crafty.e("2D, DOM, Marble, solid, marble"+marb)
            .attr({x: pos * 32, y: 0, z:1})
            .marble(marb);
        }
    };

    // put in the floor
    Crafty.e("2D, DOM, Image")
        .attr({x: 0, y: Crafty.viewport.height - 20})
        .image(game_path + "/assets/img/floor.png");
    
    //Bind Gameloop to the Scene
    Crafty.bind("EnterFrame",function(frame){
        //Trigger Event to display enemies
        spotEnemys(frame.frame);
        
        //Setup Background position
        Crafty.stage.elem.style.backgroundPosition ="0px "+frame.frame+"px";
    });
    
    //Global Event for Game Over
    Crafty.bind("GameOver",function(score){
        Crafty.audio.stop();
    });
});
