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

                // load music into buffer
                assets.ready.music.main = game.load.audio('music-main', ['assets/game/music/hip-and-cool.ogg']);

                // scripts
                game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

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
                var style = { font: "25px Courier New", fill: "#fff", align: "center" };
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

                // TODO: dumb things to say while loading (make sure this matches the amount of things loaded)
                var text = [
                    "Looking for all the thingies...",
                    "Searching all the Googles...",
                    "Applying nostalgia filters...",
                    "Unleashing the undead armies unto the world...",
                    "Applying all the MATH and stuff...",
                    "Almost done!"
                ]

                // change text
            	loadingtext.setText(text[totalLoaded]);
                loadingPercentage.setText("Hacking " + progress + "%")

            }
            //-----------------------

            //-----------------------
            function loadComplete() {
            	loadingtext.setText("Hacking Complete!  Starting momentarily...");
                loadingPercentage.setText("(╯°□°)╯︵ ┻━┻")

                // start game after slight delay
                setTimeout(function(){
                    clearPreloader();

                    // render game code
                    assets.state = "ready";
                    game.stage.backgroundColor = '#5252f2';
                    var style = { font: "50px Arial", fill: "#fff", align: "center" };
                    loadingPercentage = game.add.text(game.world.centerX, game.world.centerY, "Load Complete!", style);
                    loadingPercentage.anchor.set(0.5);


                    assets.ready.music.main = game.add.audio('music-main')
                    setTimeout(function(){
                        assets.ready.music.main.loopFull(0.75)
                    }, 2500)

                }, 1500)
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

                assets.state = "showmenu"
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
