Crafty.c("Marble",{
    _type: 0,
    _vy: 0.2,
    _ay: 0.2,
    _elas: 0.6,
    init:function(){
        this.requires("2D,DOM,Mouse")
        .bind("MouseDown", function(e){
            if(e.mouseButton == Crafty.mouseButtons.LEFT){
                this.trigger("Die");
            }
        })
        .bind("Die", function(){
            //Create a random explosion at his position
            Crafty.e("Explosion").attr({
                x:this.x,
                y:this.y
            });
            //Trigger the player event to calculate points
            Crafty("Player").trigger("Killed", this.points);
            //Destroy the marble
            this.destroy();
        })
		.bind("EnterFrame", function(){
            if (this._vy === 0)
            {
                if (this.hitCheck(this._ay)){
                    // start moving
                    this._vy = this._ay;
                }
            } else {
                // Physics
                this._vy += this._ay;

                // Check if we fell through the floor
                if (this.hitCheck(this._vy)){
                    Crafty.audio.play("tink1", 1);
                    this._vy *= -this._elas;
                    if (this._vy < 2.0 && this._vy > -2.0){
                        this._vy = 0;
                    }
                }

                // Physics
                this.y += this._vy;
            }
        })          
    },
    marble: function(type){
            this._type = type;
    },
    hitCheck: function(increment){
        var obj, q, i, l;
        var pos = this.pos();

        // Check for item underneath to restart fall
        pos._y += increment;
        
        if (pos._y > 768) {
            // hit floor
            return true;
        }
        
        //map.search wants _x and intersect wants x...
        pos.x = pos._x;
        pos.y = pos._y;
        pos.w = pos._w;
        pos.h = pos._h;
    
        q = Crafty.map.search(pos);
        l = q.length;
        for (i = 0; i < l; ++i) {
            obj = q[i];
            // check for an intersection in our new position
            if (obj !== this && obj.has("solid") && obj.intersect(pos)) {
                return true;
            }
        }
        
        // no hit
        return false;
    }
});

Crafty.c("Player",{
    hp:{
        current:10,
        max:10,
        percent:100
    },
    shield:{
        current:10,
        max:10,
        percent:100
    },
    heat:{
        current:0,
        max:100,
        percent:0
    },
    movementSpeed:8,
    lives:3,
    score:0,
    weapon:{
        firerate:5,
        name:"Weapon1",
        overheated:false
    },
    powerups:{},
    ship:"ship1",
    bars:{},
    infos:{},
    preparing:true,
    bounce:false,
    init:function(){
     
        var stage = $('#cr-stage');
        var keyDown = false; //Player didnt pressed a key
        this.requires("2D,Canvas,"+this.ship+",Multiway,Keyboard,Collision,Flicker") /*Add needed Components*/
        .multiway(this.movementSpeed, { /*Enable Movement Control*/
            UP_ARROW: -90, 
            DOWN_ARROW: 90, 
            RIGHT_ARROW: 0, 
            LEFT_ARROW: 180
        })
        .bind('Moved', function(from) { /*Bind a function which is triggered if player is moved*/
            /*Dont allow to move the player out of Screen*/
            if(this.x+this.w > Crafty.viewport.width ||
                this.x+this.w < this.w || 
                this.y+this.h-35 < this.h || 
                this.y+this.h+35 > Crafty.viewport.height || this.preparing){
                this.attr({
                    x:from.x, 
                    y:from.y
                });
            }
          
        })
        .bind("KeyDown", function(e) {
            if(e.keyCode === Crafty.keys.SPACE){
                keyDown = true;
            } 
        })
        .bind("KeyUp", function(e) {
            if(e.keyCode === Crafty.keys.SPACE){
                keyDown = false;
            } 
        })
        .bind("EnterFrame",function(frame){
            if(frame.frame % this.weapon.firerate == 0){
               
                if(keyDown && !this.weapon.overheated){
                    this.shoot();
                }else{
                    if(this.heat.current > 0) //Cooldown the weapon
                        this.heat.current = ~~(this.heat.current*29/30); 
                }

                Crafty.trigger("UpdateStats");
                
                if(this.weapon.overheated && this.heat.percent < 85){
                    this.weapon.overheated = false;
                    Crafty.trigger("HideText");
                }
                    
            }
            if(this.preparing){
                this.y--;
                if(this.y < Crafty.viewport.height-this.h-Crafty.viewport.height/4){
                    this.preparing = false;
                    this.flicker=false;
                  
                }
            }
         
            
        })
        .bind("Killed",function(points){
            this.score += points;
            Crafty.trigger("UpdateStats");
        })
        .bind("Hurt",function(dmg){
            if(this.flicker) return;
            if(this.bounce == false) {
                this.bounce = true;
                var t = this;
                stage.effect('highlight',{
                    color:'#990000'
                },100,function(){
                    t.bounce = false;
                });
            }
            Crafty.e("Damage").attr({
                x:this.x,
                y:this.y
            });
            if(this.shield.current <= 0){
                this.shield.current = 0;
                this.hp.current -= dmg;
            }else{
                this.shield.current -= dmg;
            } 
            Crafty.trigger("UpdateStats");
            if(this.hp.current <= 0) this.die();
        })
        .onHit("EnemyBullet",function(ent){
            var bullet = ent[0].obj;
            this.trigger("Hurt",bullet.dmg);
            bullet.destroy();
        })
        .bind("RestoreHP",function(val){
            if(this.hp.current < this.hp.max){
                this.hp.current += val;
                Crafty.trigger("UpdateStats");
            }
        
        })
        .bind("RestoreShield",function(val){
            if(this.shield.current < this.shield.max){
                this.shield.current += val;
                Crafty.trigger("UpdateStats");
            }  
        
        })
        .reset() /*Set initial points*/;
        return this;
    },
    reset:function(){
        this.hp = {
            current:10,
            max:10,
            percent:100
        };
        this.shield = {
            current:10,
            max:10,
            percent:100
        };
        this.heat = {
            current:0,
            max:100,
            percent:0
        }
        Crafty.trigger("UpdateStats");
        //Init position
        this.x = Crafty.viewport.width/2-this.w/2;
        this.y = Crafty.viewport.height-this.h-36;
        
        this.flicker = true;
        this.preparing = true;
    },
    shoot:function(){ 
        if(this.preparing) return;
        
        var bullet = Crafty.e(this.weapon.name,"PlayerBullet");
        bullet.attr({
            playerID:this[0],
            x: this._x+this._w/2-bullet.w/2,
            y: this._y-this._h/2+bullet.h/2,
            rotation: this._rotation,
            xspeed: 20 * Math.sin(this._rotation / (180 / Math.PI)),
            yspeed: 20 * Math.cos(this._rotation / (180 / Math.PI))
        }); 
     
        if(this.heat.current < this.heat.max)
            this.heat.current ++;
         
        if(this.heat.current >= this.heat.max){
            Crafty.trigger("ShowText","Weapon Overheated!");
            this.weapon.overheated = true;
        }
           
    },
    die:function(){
        Crafty.e("RandomExplosion").attr({
            x:this.x,
            y:this.y
        });
        this.lives--;
        Crafty.trigger("UpdateStats");
        if(this.lives <= 0){
            this.destroy();
            Crafty.trigger("GameOver",this.score);
        }else{
            this.reset();
        }
        
        
    }
    
});
