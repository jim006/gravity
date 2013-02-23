// these sprite constructors will also push the sprites into the Crafty.assets array

Crafty.sprite(32, game_path + "assets/img/marbles_small.png",{
    //Gold
    marble0:[0,0],
    marble1:[1,0],
    marble2:[2,0],
    marble3:[3,0],
    marble4:[0,1],
    marble5:[1,1],
    marble6:[2,1],
    marble7:[3,1],
    marble8:[0,2],
    marble9:[1,2],
    marble10:[2,2],
    marble11:[3,2],
    marble12:[0,3],
    marble13:[1,3]
});

Crafty.sprite(5,13,game_path + "assets/img/weapon1_small.png",{
    laser1:[0,0] 
});
Crafty.sprite(27,36,game_path + "assets/img/weapon2.png",{
    laser2:[0,0] 
});
Crafty.sprite(32,32,game_path + "assets/img/dmg.svg",{
    dmg:[0,0]
});
Crafty.sprite(64,game_path + "assets/img/asteroid64.png",{
    asteroid64:[0,0]
});
Crafty.sprite(32,game_path + "assets/img/asteroid32.png",{
    asteroid32:[0,0]
});
Crafty.sprite(128,game_path + "assets/img/explosion.png",{
    explosion1:[0,0],
    explosion2:[0,1],
    explosion3:[0,2]
});

Crafty.sprite(34,30,game_path + "assets/img/powerups.png",{
    heal:[0,0],
    shield:[0,1],
    overheat:[0,2],
    invincible:[0,3]
});