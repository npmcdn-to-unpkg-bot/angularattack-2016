//--------------
__phaser = {

    gameObj: null,

    //-------------------
    game:{

      //-------------------
      init(canvasEle, appComponent){

            //----------------------- assign variables
            var assets = {
                app: null,
                preloader: {

                },
                ready:{
                    music:{
                        main: null
                    }
                },
                gameSelection: 0,
                disableInput: true,
                keybufferLR:[],
                keybufferUD:[],
                keybufferStart:[],
                keybufferA:[],
                keybufferB:[],
                keybufferX:[],
                keybufferY:[],
                state: "boot"

            }
            var game = new Phaser.Game(800, 500, Phaser.AUTO, canvasEle, { preload: preload, create: create, update: update });
            __phaser.gameObj = game;

            WebFontConfig = {
                active: function() { game.time.events.add(Phaser.Timer.SECOND, function(){}, this); },
                google: {
                  families: ['Press Start 2P']
                }
            };



            //-----------------------

            //-----------------------
            function preload() {

                // set canvas color
                game.stage.backgroundColor = '#182d3b';

                // images
                game.load.image('winners', 'assets/game/images/winners.jpg')
                game.load.image('starfield', 'assets/game/images/starfield.png')
                game.load.image('purewhite', 'assets/game/images/purewhite.png')
                game.load.image('boxart1', 'assets/cabinet/angular-attacks.png');
                game.load.image('boxart2', 'assets/cabinet/debugger-panic.png');
                game.load.image('boxart3', 'assets/cabinet/kanyes-quest.png');

                // scripts
                game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
                game.load.script('checkerwaveFilter', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/CheckerWave.js');

                // load music into buffer
                assets.ready.music.main = game.load.audio('music-main', ['assets/game/music/gaggle-of-gumdrops.ogg']);
                game.load.audio('click', ['assets/sound/Powerup4.ogg']);
                game.load.audio('select', ['assets/sound/Pickup_Coin.ogg']);


                //	You can listen for each of these events from Phaser.Loader
                game.load.onLoadStart.add(loadStart, this);
                game.load.onFileComplete.add(fileComplete, this);
                game.load.onLoadComplete.add(loadComplete, this);
                game.load.enableParallel = true;

            }
            //-----------------------

            //-----------------------
            function create() {

                // establish controls
                buttonDelay = game.time.now;
                leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
                downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

                // estblish buttons
                enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                enterA = game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
                enterB = game.input.keyboard.addKey(Phaser.Keyboard.A);
                enterX = game.input.keyboard.addKey(Phaser.Keyboard.S);
                enterY = game.input.keyboard.addKey(Phaser.Keyboard.D);


                // keypress goes into buffer
                leftKey.onDown.add(function(){
                    assets.keybufferLR[0] = 0
                }, this);
                rightKey.onDown.add(function(){
                    assets.keybufferLR[0] = 1
                }, this);
                upKey.onDown.add(function(){
                    assets.keybufferUD[0] = 0
                }, this);
                downKey.onDown.add(function(){
                    assets.keybufferUD[0] = 1
                }, this);

                enterKey.onDown.add(function(){
                    assets.keybufferStart[0] = true
                }, this);
                enterA.onDown.add(function(){
                    assets.keybufferA[0] = true
                }, this);
                enterB.onDown.add(function(){
                    assets.keybufferB[0] = true
                }, this);
                enterX.onDown.add(function(){
                    assets.keybufferX[0] = true
                }, this);
                enterY.onDown.add(function(){
                    assets.keybufferY[0] = true
                }, this);


                game.input.keyboard.onUpCallback = function(e){
                    buttonDelay = game.time.now;
                    if(e.code == "ArrowLeft" || e.code == "ArrowRight"){
                        assets.keybufferLR.shift();
                    }
                    if(e.code == "ArrowUp" || e.code == "ArrowDown"){
                        assets.keybufferUD.shift();
                    }
                    if(e.code == "Enter"){
                        assets.keybufferStart.shift();
                    }
                    if(e.code == "SPACE"){
                        assets.keybufferA.shift();
                    }
                    if(e.code == "KeyA"){
                        assets.keybufferB.shift();
                    }
                    if(e.code == "KeyS"){
                        assets.keybufferX.shift();
                    }
                    if(e.code == "KeyD"){
                        assets.keybufferY.shift();
                    }
                }

            }
            //-----------------------

            //-----------------------
            function start() {

                // start
                game.load.start();

            }
            //-----------------------

            //-----------------------
            function loadStart() {

                // fragment
                var fragmentSrc = [
                        "precision mediump float;",
                        "uniform float     time;",
                        "uniform vec2      resolution;",
                        "uniform vec2      mouse;",
                        "float noise(vec2 pos) {",
                            "return fract(sin(dot(pos, vec2(12.9898 - time,78.233 + time))) * 43758.5453);",
                        "}",
                        "void main( void ) {",
                            "vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
                            "float pos = (gl_FragCoord.y / resolution.y);",
                            "float mouse_dist = length(vec2((mouse.x - normalPos.x) * (resolution.x / resolution.y) , mouse.y - normalPos.y));",
                            "float distortion = clamp(1.0 - (mouse_dist + 0.1) * 3.0, 0.0, 1.0);",
                            "pos -= (distortion * distortion) * 0.1;",
                            "float c = sin(pos * 400.0) * 0.4 + 0.4;",
                            "c = pow(c, 0.2);",
                            "c *= 0.2;",
                            "float band_pos = fract(time * 0.1) * 3.0 - 1.0;",
                            "c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;",
                            "c += distortion * 0.08;",
                            "// noise",
                            "c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);",
                            "gl_FragColor = vec4( 0.0, c, 0.0, 1.0 );",
                        "}"
                ];

                // filter
                filter = new Phaser.Filter(game, null, fragmentSrc);
                filter.setResolution(800, 600);
                filterContainer = game.add.sprite();
                filterContainer.width = 800;
                filterContainer.height = 600;
                filterContainer.filters = [ filter ];

                // text
                var style = { font: "12px Press Start 2P", fill: "#fff", align: "center" };
                loadingtext = game.add.text(game.world.centerX, game.world.centerY/2, "", style);
                loadingtext.anchor.set(0.5);

                var style = { font: "50px Courier New", fill: "#fff", align: "center" };
                loadingPercentage = game.add.text(game.world.centerX, game.world.centerY, "", style);
                loadingPercentage.anchor.set(0.5);

                // change state
                assets.state = "preload";

            }
            //-----------------------

            //-----------------------
            function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {

                // change text
                // change text
            	loadingtext.setText("LOAD 'MainMenu_1985.exe', 8, 1...\r\r(╯°□°)╯︵ ┻━┻");
                loadingPercentage.setText(progress + "%")

            }
            //-----------------------

            //-----------------------
            function loadComplete() {
            	loadingtext.setText("Main Menu loaded!  \rStarting momentarily...");
                loadingPercentage.setText("^__^")


                // start game after slight delay
                setTimeout(function(){
                    clearPreloader();

                    // render game code
                    assets.state = "ready";
                    game.stage.backgroundColor = '#5252f2';


                    filter = game.add.filter('CheckerWave', 800, 600);
                    filter.setResolution(800, 500);
                    menubg = game.add.sprite();
                    menubg.width = 800;
                    menubg.height = 500;
                    menubg.visible = false;
                    menubg.filters = [ filter ];

                    splashDelay = game.time.now + 2000;
                    splashScreen = game.add.sprite(game.world.centerX - 15, game.world.centerY, 'winners');
                    splashScreen.anchor.set(0.5);
                    splashScreen.scale.setTo(1.1, 1.1)
                    splashScreen.alpha = 1

                    // add button delay
                    buttonDelay = game.time.now + 1000;

                    // play music (with delay)
                    clickSound = game.add.audio('click');
                    clickSound.allowMultiple = true;
                    selectSound = game.add.audio('select');

                    assets.ready.music.main = game.add.audio('music-main')
                    setTimeout(function(){
                        assets.ready.music.main.loopFull(0.75)
                    }, 2000)

                }, 4000)
            }
            //-----------------------


            //-----------------------
            function update() {

                //-----------------
                if(assets.state == "preload"){
                    filter.update();
                }
                //-----------------

                //-----------------
                if(assets.state == "ready"){
                    if(game.time.now > splashDelay){
                        clearReady();
                        assets.state = "showmenu"
                    }
                }
                //-----------------

                //-----------------
                if(assets.state == "showmenu"){
                    filter.update();

                    if(game.time.now > buttonDelay && !assets.disableInput){
                        if(assets.keybufferLR[0] != undefined || assets.keybufferUD[0] != undefined || assets.keybufferStart[0] !== undefined){


                            if(assets.keybufferLR[0] == 0){
                                clickSound.play()
                                assets.gameSelection --;
                                if(assets.gameSelection < 0){assets.gameSelection = 0}
                                appComponent.updateSelected(assets.gameSelection + 1)
                                scaleSelected(assets.gameSelection)
                            }
                            if(assets.keybufferLR[0] == 1){
                                clickSound.play()
                                assets.gameSelection ++;
                                if(assets.gameSelection > 2){assets.gameSelection = 2}
                                appComponent.updateSelected(assets.gameSelection + 1)
                                scaleSelected(assets.gameSelection)
                            }

                            if(assets.keybufferStart[0]){
                                selectSound.play();
                                assets.disableInput = true;
                                selectGame()
                            }

                            buttonDelay = game.time.now + 250
                        }
                    }

                }
                //-----------------

            }
            //-----------------------

            //-----------------------
            function selectGame(){

                // move boxarts
                if(assets.gameSelection == 0){
                    game.add.tween(boxart1).to( { x: game.world.centerX, y: game.world.centerY }, 1000, Phaser.Easing.Linear.In, true, 300);
                    game.add.tween(boxart1.scale).to( { x: 4.5, y: 4.5 }, 10000, Phaser.Easing.Linear.In, true, 1000);
                    game.add.tween(boxart2).to( { x: game.world.centerX + 1000, y:game.world.centerY }, 400, Phaser.Easing.Linear.In, true);
                    game.add.tween(boxart3).to( { x: game.world.centerX + 1000, y:game.world.centerY }, 400, Phaser.Easing.Linear.In, true);
                }
                if(assets.gameSelection == 1){
                    game.add.tween(boxart2).to( { x: game.world.centerX, y: game.world.centerY }, 1000, Phaser.Easing.Linear.In, true, 300);
                    game.add.tween(boxart2.scale).to( { x: 4.5, y: 4.5 }, 10000, Phaser.Easing.Linear.In, true, 1000);
                    game.add.tween(boxart1).to( { x: game.world.centerX + 1000, y:game.world.centerY }, 400, Phaser.Easing.Linear.In, true);
                    game.add.tween(boxart3).to( { x: game.world.centerX + 1000, y:game.world.centerY }, 400, Phaser.Easing.Linear.In, true);
                }
                if(assets.gameSelection == 2){
                    game.add.tween(boxart3).to( { x: game.world.centerX, y: game.world.centerY }, 1000, Phaser.Easing.Linear.In, true, 300);
                    game.add.tween(boxart3.scale).to( { x: 4.5, y: 4.5 }, 10000, Phaser.Easing.Linear.In, true, 1000);
                    game.add.tween(boxart1).to( { x: game.world.centerX + 1000, y:game.world.centerY }, 400, Phaser.Easing.Linear.In, true);
                    game.add.tween(boxart2).to( { x: game.world.centerX + 1000, y:game.world.centerY }, 400, Phaser.Easing.Linear.In, true);
                }

                // fade in white
                purewhite = game.add.sprite(game.world.centerX, game.world.centerY, 'purewhite');
                purewhite.anchor.set(0.5);
                purewhite.alpha = 0;
                game.add.tween(purewhite).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.In, true, 2000);

                // remove texts
                game.add.tween(headerText).to( { alpha: 0,  y: game.world.centerY/3 - 50 }, 800, "Linear", true);

                // fade music
                assets.ready.music.main.fadeOut(4000)

                // load next!
                setTimeout(function(){
                    appComponent.loadGame(assets.gameSelection + 1)
                }, 7000)
            }
            //-----------------------

            //-----------------------
            function scaleSelected(){
                boxart1.scale.setTo(1, 1)
                boxart2.scale.setTo(1, 1)
                boxart3.scale.setTo(1, 1)

                if(assets.gameSelection == 0){
                    tween = game.add.tween(boxart1.scale).to( { x: 1.2, y: 1.2 }, 1, Phaser.Easing.Linear.In, true);
                    titleText.setText("Angular Attacks")
                    subtext.setText("Show the world who's the real MVC hero.")
                }
                if(assets.gameSelection == 1){
                    tween = game.add.tween(boxart2.scale).to( { x: 1.2, y: 1.2 }, 1, Phaser.Easing.Linear.In, true);
                    titleText.setText("Debugger Panic");
                    subtext.setText("Everything is fine.")
                }
                if(assets.gameSelection == 2){
                    tween = game.add.tween(boxart3.scale).to( { x: 1.2, y: 1.2 }, 1, Phaser.Easing.Linear.In, true);
                    titleText.setText("Kanye's Quest")
                    subtext.setText("Being an asshole never felt so good.")
                }
            }
            //-----------------------


            //-----------------------
            function clearPreloader(){
                loadingtext.destroy();
                loadingPercentage.destroy();
            }
            //-----------------------

            //-----------------------
            function clearReady(){
                splashScreen.destroy();
                menubg.visible = true;
                assets.state = "showmenu"

                // text
                var style = { font: "45px Press Start 2P", fill: "#fff", align: "center" };
                headerText = game.add.text(game.world.centerX, game.world.centerY - 200, "Select a game!", style);
                headerText.anchor.set(0.5);
                headerText.alpha = 0;
                game.add.tween(headerText).to( { alpha: 1,  y: game.world.centerY/3 }, 800, "Linear", true, 1500);

                var style = { font: "16px Press Start 2P", fill: "#0600ff", align: "center" };
                titleText = game.add.text(game.world.centerX, game.world.centerY + 200, "", style);
                titleText.anchor.set(0.5);
                var style = { font: "12px Press Start 2P", fill: "#0600ff", align: "center" };
                subtext = game.add.text(game.world.centerX, game.world.centerY + 220, "", style);
                subtext.anchor.set(0.5);

                boxart1 = game.add.sprite(game.world.centerX + 1000, game.world.centerY, 'boxart1');
                boxart1.anchor.set(.5)
                boxart1.alpha = 1;
                boxart1.angle = -4;
                game.add.tween(boxart1).to( { x: game.world.centerX - 250}, 2000, Phaser.Easing.Bounce.Out, true)
                tweenYoyo = game.add.tween(boxart1).to( { angle: 4 }, 500, Phaser.Easing.Bounce.Out, true, 0, 2000);
                tweenYoyo.yoyo(true, 0);

                boxart2 = game.add.sprite(game.world.centerX + 1000, game.world.centerY, 'boxart2');
                boxart2.anchor.set(.5)
                boxart2.alpha = 1;
                game.add.tween(boxart2).to( { x: game.world.centerX }, 2000, Phaser.Easing.Bounce.Out, true, 500);
                tweenYoyo = game.add.tween(boxart2).to( { angle: 4 }, 500, Phaser.Easing.Bounce.Out, true, 0, 2000);
                tweenYoyo.yoyo(true, 0);

                boxart3 = game.add.sprite(game.world.centerX + 1000, game.world.centerY, 'boxart3');
                boxart3.anchor.set(.5)
                boxart3.alpha = 1;
                game.add.tween(boxart3).to( { x: game.world.centerX + 250}, 2000, Phaser.Easing.Bounce.Out, true, 1000);
                tweenYoyo = game.add.tween(boxart3).to( { angle: 4 }, 500, Phaser.Easing.Bounce.Out, true, 0, 2000);
                tweenYoyo.yoyo(true, 0);

                setTimeout(function(){
                    scaleSelected()
                    assets.disableInput = false;
                }, 2500)
            }
            //-----------------------

      },



    },
    //-------------------


    //-------------------
    destroyGame(callback){
          this.gameObj.destroy();
          callback();
    }
    //-------------------


}
//--------------
