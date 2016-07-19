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
                allowInput: true,
                gameSelection: 0,
                keybufferL:[],
                keybufferR:[],
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

            var ball;
            var paddle;
            var bricks;

            var ballOnPaddle = true;

            var lives = 5;
            var score = 0;

            var scoreText;
            var livesText;


            var s;

            var content = [];
            var kernText;
            var index = 0;
            var line = '';
            //-----------------------

            //-----------------------
            function preload() {

                // set canvas color
                game.stage.backgroundColor = '#182d3b';

                // images
                game.load.image('winners', 'assets/game/images/winners.jpg')
                game.load.atlas('breakout', 'assets/game/images/breakout.png', 'assets/game/images/breakout.json');
                game.load.image('starfield', 'assets/game/images/starfield.png');
                game.load.image('gametitle', 'assets/images/debugger-panic-title.png')


                // load music into buffer
                assets.ready.music.main = game.load.audio('music-main', ['assets/game/music/hip-and-cool.ogg']);
                game.load.audio('hitPaddle', ['assets/sound/Jump3.ogg']);
                game.load.audio('hitBlock', ['assets/sound/Pickup_Coin.ogg']);
                game.load.audio('hitBottom', ['assets/sound/Powerup2.ogg']);


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
                    assets.keybufferL[0] = true
                }, this);
                rightKey.onDown.add(function(){
                    assets.keybufferLR[0] = 1
                    assets.keybufferR[0] = true
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

                        if(e.code == "ArrowLeft"){
                            assets.keybufferL.shift()
                        }
                        if(e.code == "ArrowRight"){
                            assets.keybufferR.shift()
                        }
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
            	loadingtext.setText("LOAD 'DebuggerPanic_1988.exe', 8, 1\r\r(╯°□°)╯︵ ┻━┻");
                loadingPercentage.setText(progress + "%")

            }
            //-----------------------

            //-----------------------
            function loadComplete() {
                loadingtext.setText("Debugger Panic loaded!  \rStarting momentarily...");
                loadingPercentage.setText("^__^")

                // start game after slight delay
                setTimeout(function(){
                    clearPreloader();

                    splashDelay = game.time.now + 2000;
                    splashScreen = game.add.sprite(game.world.centerX - 15, game.world.centerY, 'winners');
                    splashScreen.anchor.set(0.5);
                    splashScreen.scale.setTo(1.1, 1.1)
                    splashScreen.alpha = 1
                    assets.state = "ready"


                    setTimeout(function(){
                        splashScreen.destroy();
                        assets.ready.music.main = game.add.audio('music-main')
                        assets.ready.music.main.loopFull(0.75)
                        preloadGame();
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

                if(assets.state == "menuscreen"){
                    filter.update();

                    //----------- flashing text
                    if(game.time.now > pressStartTextDelay){
                        pressStartText.visible = !pressStartText.visible
                        pressStartTextDelay = game.time.now + 700;
                    }
                    //-----------

                    if(assets.keybufferStart[0] && assets.allowInput){
                        assets.allowInput = false;
                        startGameplay()

                    }
                }

                //-----------------
                if(assets.state == "gameloop"){
                    filter.update();

                    if(assets.keybufferL[0] != undefined || assets.keybufferR[0] != undefined || assets.keybufferB[0] !== undefined && assets.allowInput){

                        if(assets.keybufferL[0]){
                            paddle.x -= 7
                        }

                        if(assets.keybufferR[0]){
                            paddle.x += 7
                        }

                        if(assets.keybufferB[0]){
                            releaseBall();
                        }

                    }


                    if (paddle.x < 24){
                        paddle.x = 24;
                    }
                    else if (paddle.x > game.width - 24){
                        paddle.x = game.width - 24;
                    }

                    if (ballOnPaddle){
                        ball.body.x = paddle.x;
                        helpText.setText("Press A to launch ball.")
                    }
                    else{
                        helpText.setText(" ")
                        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
                        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
                    }
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
            function preloadGame(){
                assets.state = "menuscreen"

                var fragmentSrc = [
                    "#ifdef GL_ES",
                    "precision mediump float;",
                    "const vec3 df = vec3(0.05, 0.0, 0.0);",
                    "#else",
                    "const vec3 df = vec3(0.01, 0.0, 0.0);",
                    "#endif",
                    "uniform float     time;",
                    "uniform vec2      resolution;",
                    "uniform vec2      mouse;",
                    "// Sphere tracer by mzeo",
                    "// inspired by http://www.youtube.com/watch?v=kuesTvUYsSc#t=377",
                    "// waves by @hintz",

                    "#define AUTO_CAMERA",

                    "// Constants",
                    "// Camera",
                    "const vec3 origin = vec3(0, 0, 0);",
                    "const int steps = 128;",
                    "const vec3 sun = vec3(1.0, .5, -1.0);",

                    "const int miterations = 32;",

                    "// Ball",
                    "struct Ball",
                    "{",
                        "vec3 pos;",
                        "float size;",
                    "};",

                    "const Ball ball = Ball(vec3(0, 0, 5), 0.5);",

                    "struct Balls",
                    "{",
                        "vec3 dir;",
                        "vec3 p;",
                        "float dist;",
                    "};",

                    "const Balls balls = Balls(vec3(1, 0, 0), vec3(0, 0, 0), 1.0);",

                    "// Floor",

                    "struct Plane",
                    "{",
                        "vec3 n;",
                        "float d;",
                    "};",

                    "const Plane plane = Plane(vec3(0, 1, 0), -1.0);",

                    "// Distance",
                    "struct Dist",
                    "{",
                        "float dist;",
                        "int id;",
                    "};",


                    "Dist and(Dist a, Dist b)",
                    "{",
                        "if (a.dist < b.dist)",
                        "{",
                            "return a;",
                        "}",

                        "return b;",
                    "}",

                    "Dist fBall(Ball ball, vec3 p)",
                    "{",
                        "return Dist(length(ball.pos - p) - ball.size, 0);",
                    "}",

                    "Ball get(Balls balls, float t)",
                    "{",
                        "float a = abs(mod(t, 6.0) - 3.0);",
                        "vec3 p = balls.p + balls.dir * t * balls.dist + a * a * vec3(0, -0.15, 0);",
                        "return Ball(p, ball.size);",
                    "}",

                    "Dist fBalls(Balls balls, vec3 p)",
                    "{",
                        "float t = dot(p - balls.p, balls.dir) / balls.dist;",
                        "float t0 = t - fract(t + fract(time) * 2.0);",
                        "float t1 = t0 + 1.0;",

                        "return and(",
                        "fBall(get(balls, t0), p),",
                        "fBall(get(balls, t1), p));",
                    "}",

                    "Dist fPlane(Plane plane, vec3 p)",
                    "{",
                        "return Dist(dot(plane.n, p) - plane.d - 0.4*cos(length(p.xz) - time), 1);",
                    "}",

                    "Dist f(vec3 p)",
                    "{",
                        "return and(",
                        "fBalls(balls, p),",
                        "fPlane(plane, p));",
                    "}",

                    "vec3 grad(vec3 p)",
                    "{",
                        "float f0 = f(p).dist;",

                        "return normalize(vec3(",
                        "f(p + df.xyz).dist,",
                        "f(p + df.yxz).dist,",
                        "f(p + df.yzx).dist) - f0);",
                    "}",

                    "float mandel(vec2 c)",
                    "{",
                        "vec2 z = c;",

                        "for(int i = 0; i < miterations; ++i)",
                        "{",
                            "z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;",
                            "if (length(z) > 40.0) return float(i) / float(miterations);",
                        "}",

                        "return 0.0;",
                    "}",

                    "vec3 floorTexture(vec3 p)",
                    "{",
                        "mat2 rot = mat2(vec2(1, 1), vec2(1, -1));",
                        "vec2 c = rot * (p.xz + vec2(-0.7, -1.0)) * 0.2;",
                        "float i = mandel(c);",
                        "return clamp(vec3(i * 10.0, i * i *10.0, i*i*i*5.0).zyx, vec3(0,0,0), vec3(2,2,2));",
                    "}",


                    "vec4 shade(vec3 p, vec3 ray, int id)",
                    "{",
                        "vec3 n = grad(p);",
                        "float diffuse = clamp(dot(normalize(sun), n), 0.0, 1.0);",

                        "vec3 color;",
                        "float ref;",

                        "if (id == 0)",
                        "{",
                            "color = vec3(0,1,0);",
                            "ref = 0.1;",
                        "}",
                        "else",
                        "{",
                            "color = floorTexture(p);",
                            "ref = 0.5;",
                        "}",

                        "return vec4(color * diffuse, 1) * ref;",
                    "}",

                    "vec4 combine(vec4 a, vec4 b)",
                    "{",
                        "return a + b * (1.0 - a.w);",
                    "}",

                    "vec4 sky(vec3 ray)",
                    "{",
                        "float sun = dot(ray, normalize(sun));",
                        "sun = (sun > 0.0) ? pow(sun, 100.0) * 3.0 : 0.0;",
                        "float horizon = 1.0 - abs(ray.y);",
                        "vec3 blue = vec3(0.1, 0.3, 0.6);",
                        "vec3 red = vec3(0.6, 0.3, 0.) * 2.0;",
                        "return vec4(vec3(0.9, 0.8, 0.5) * sun + blue * horizon + red * pow(horizon, 8.0), 1);",
                    "}",

                    "vec4 trace(vec3 origin, vec3 ray)",
                    "{",
                        "vec3 p = origin;",
                        "Dist dist = Dist(10000.0, 2);",
                        "vec4 result = vec4(0, 0, 0, 0);",

                        "for(int i = 0; i < steps; ++i)",
                        "{",
                            "dist = f(p);",
                            "if (dist.dist > 0.01)",
                            "{",
                                "p += ray * dist.dist;",
                                "float absorb = exp(-dist.dist * 0.05);",
                                "vec4 s = sky(ray) * (1.0 - absorb);",

                                "result = combine(result, s);",
                            "}",
                            "else if (result.w < 0.99)",
                            "{",
                                "vec3 n = grad(p);",
                                "vec4 s = shade(p, ray, dist.id);",
                                "ray = reflect(ray, n);",
                                "p += n * 0.01;",

                                "result = combine(result, s);",
                            "}",
                            "else",
                            "{",
                                "break;",
                            "}",
                        "}",

                        "return combine(result, sky(ray));",
                    "}",

                    "void main(void)",
                    "{",
                        "float scale = 2.0 / max(resolution.x, resolution.y);",
                        "vec3 ray = vec3((gl_FragCoord.xy - resolution.xy / 2.0) * scale, 1);",

                        "#ifdef AUTO_CAMERA",
                        "float yaw = cos(time) * -0.25 + 0.1;",
                        "float angle = time * 0.5;",
                        "#else",
                        "float yaw = mouse.y - 0.15;",
                        "float angle = mouse.x * 8.0;",
                        "#endif",

                        "vec3 from = (vec3(sin(angle), 0, cos(angle)) * cos(yaw) + vec3(0, sin(yaw) * 1.0, 0)) * 5.0;",
                        "//vec3 from = origin + vec3((mouse.xy - vec2(0.5,0.0)) * vec2(15.0, 3.0), -5);",
                        "vec3 to = vec3(0, -1, 0);",
                        "vec3 up = vec3(0, 1, 0);",
                        "vec3 dir = normalize(to - from);",
                        "vec3 left = normalize(cross(up, dir));",
                        "mat3 rot = mat3(left, cross(dir, left), dir);",

                        "gl_FragColor = trace(from, rot * normalize(ray));",
                    "}"
                ];

                filter = new Phaser.Filter(game, null, fragmentSrc);
                filter.setResolution(400, 300);
                var background = game.add.sprite();
                background.width = 800;
                background.height = 500;
                background.filters = [ filter ];


                game.physics.startSystem(Phaser.Physics.ARCADE);

                //  We check bounds collisions against all walls other than the bottom one
                game.physics.arcade.checkCollision.down = false;


                bricks = game.add.group();
                bricks.enableBody = true;
                bricks.physicsBodyType = Phaser.Physics.ARCADE;
                bricks.visible = false;
                var brick;

                for (var y = 0; y < 4; y++)
                {
                    for (var x = 0; x < 15; x++)
                    {
                        brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
                        brick.body.bounce.set(1);
                        brick.body.immovable = true;
                    }
                }

                paddle = game.add.sprite(game.world.centerX, 420, 'breakout', 'paddle_big.png');
                paddle.anchor.setTo(0.5, 0.5);
                paddle.visible = false;

                game.physics.enable(paddle, Phaser.Physics.ARCADE);

                paddle.body.collideWorldBounds = true;
                paddle.body.bounce.set(1);
                paddle.body.immovable = true;

                ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
                ball.anchor.set(0.5);
                ball.checkWorldBounds = true;
                ball.visible = false;

                game.physics.enable(ball, Phaser.Physics.ARCADE);

                ball.body.collideWorldBounds = true;
                ball.body.bounce.set(1);

                ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);

                ball.events.onOutOfBounds.add(ballLost, this);

                scoreText = game.add.text(32, 30, 'score: 0', { font: "14px Press Start 2P", fill: "#ffffff", align: "left" });
                livesText = game.add.text(650, 30, 'lives: 5', { font: "14px Press Start 2P", fill: "#ffffff", align: "left" });


                // tween in title
                gametitleart = game.add.sprite(game.world.centerX, game.world.centerY - 50, 'gametitle');
                gametitleart.anchor.set(.5)
                gametitleart.scale.setTo(0, 0)
                game.add.tween(gametitleart.scale).to( { x: 2, y: 2}, 2000, Phaser.Easing.Bounce.In, true)

                pressStartTextDelay = game.time.now + 1500;
                var style = { font: "24px Press Start 2P", fill: "#fff", align: "center" };
                pressStartText = game.add.text(game.world.centerX, game.world.centerY + 250, "Press Enter to PANIC!", style);
                pressStartText.anchor.set(0.5);
                pressStartText.alpha = 0;
                game.add.tween(pressStartText).to( { alpha: 1,  y: game.world.centerY + 200 }, 350, "Linear", true, 1500);
                assets.disableInput = false;

                var style = { font: "12px Press Start 2P", fill: "#fff", align: "center" };
                helpText = game.add.text(game.world.centerX, 40, "", style);
                helpText.anchor.set(0.5);

                hitPaddle = game.add.audio('hitPaddle');
                hitBlock = game.add.audio('hitBlock');
                hitGround = game.add.audio('hitBottom')

            }
            //-----------------------


            function startGameplay(){
                pressStartText.destroy();

                game.add.tween(gametitleart).to( { alpha: 0}, 1500, Phaser.Easing.Linear.None, true, 0, 0, false)
                game.time.events.add(Phaser.Timer.SECOND * 2, function(){
                    gametitleart.destroy();

                    assets.allowInput = true;
                    assets.state = "gameloop"
                    ball.visible = true;
                    paddle.visible = true;
                    bricks.visible = true;
                }, this).autoDestroy = true;


                kernText = game.add.text(32, 465, '', { font: "12px Press Start 2P", fill: "#fff"});
                content = [
                    "      ",
                    "Hello I'm Allen from Team Totally Not a Robot.",
                    "We are 100% totally human here.  Just like the name implies.",
                    "Yep.  Nothing suspicious about that. *ahem*",
                    "      ",
                    "ANYWAYS",
                    "I'm a software engineer.  And - ",
                    "Oh, I'm being told I can't call myself an engineer ",
                    "because we don't use bricks and stuff? ",
                    "Seems pretty arbitrary to me... ",
                    "Well whatever.",
                    "I build stuff.  That's engineering to me.",
                    "      ",
                    "Anywho, we're going to talk about debugging.",
                    "Because like this game, it will never, ever end.",
                    "And no matter how many bugs you fix, there will always be more.",
                    "      ",
                    "So in many ways, this game is analagous to being a programmer.",
                    "It's kinda boring.  It's kinda blasé.  Very repetative.",
                    "Sometimes you ovrelook things.  Tahts just how it goes.",
                    "But you don't care.  BECAUSE YOU LOVE IT.",
                    "      ",
                    "      ",
                    "You LOVE IT SO MUCH that ",
                    "you're gonna follow your childhood dreams.",
                    "And what's that dream, you ask? ",
                    "Why, to make a game of course.",
                    "So you're gonna start.  You're gonna tinker with some code.",
                    "And then you're gonna be like, 'Huh.  This ain't so bad.'",
                    "That's how it starts, anyway.",
                    "      ",
                    "      ",
                    "But now weeks and months have gone by.",
                    "Your body, fatigued from sitting all day, withers.",
                    "Your friends and family mean nothing.",
                    "Because you have a calling.",
                    "      ",
                    "To make the best GODAMN GAME EVER.",
                    "      ",
                    "      ",
                    "Look, I'm not saying thats me.  Obviously it's not me.",
                    "This is a 48 competition and I'm hour 45 into it.",
                    "Like I'm sweating right now I'm hacking SO DAMN HARD.",
                    "But I wanted to motivate you because I'm a swell guy.",
                    "Like I'm not voting for Trump or anything.",
                    "That guy's an asshole.",
                    "      ",
                    "      ",
                    "Look, I'm getting ahead of myself here.",
                    "This isn't about me; this is about YOU.",
                    "Make your game.",
                    "Chase your dreams.",
                    "Unless your dreams are killing things.  DON'T do that.",
                    "Well, UNLESS unless you make",
                    "a game about dreaming where you kill.",
                    "That would be pretty rad.",
                    "Like Inception, but with a meta commentary.",
                    "      ",
                    "      ",
                    "Alright, I'm done here.  Enjoy my game. ",
                    "      ",
                    "Enjoy this stupid, dumb game.",
                    "      ",
                    "      ",
                    "      ",
                    "      ",
                    "Are you... are you still playing?",
                    "Why?",
                    "      ",
                    "Oh right you can't die.  Like ever.",
                    "      ",
                    "      ",
                    "      ",
                    "      ",
                    "Okay, well if you're content on sticking around...",
                    "Then you should totally vote for this to win ",
                    "the 2016 Angular Attack contest!",
                    "We worked SUPER hard to put this together.",
                    "And it's way better than that *other* guy/gals thing.",
                    "      ",
                    "      ",
                    "      ",
                    "      ",
                    "That's a FACT.",
                    "      ",
                    "Like, I googled it and everything.",
                    "      ",
                    "Okay, well that's my pitch.  VOTE FOR US!",
                    "      ",
                    "      ",
                    "      ",
                    "      ",
                    "There is no cow level.",
                    "      ",
                    "-- fin",
                    "      ",
                    "      ",
                ];
                game.time.events.add(Phaser.Timer.SECOND * 5, function(){
                    nextLine();
                }, this).autoDestroy = true;

            }

            //-----------------------
            function releaseBall () {

                if (ballOnPaddle)
                {
                    ballOnPaddle = false;
                    ball.body.velocity.y = -300;
                    ball.body.velocity.x = -75;
                    ball.animations.play('spin');

                }

            }

            function ballLost () {
                hitGround.play();
                lives--;
                livesText.text = 'lives: ' + lives;

                if (lives === 0)
                {
                    gameOver();
                }
                else
                {
                    ballOnPaddle = true;

                    ball.reset(paddle.body.x + 16, paddle.y - 16);

                    ball.animations.stop();
                }

            }

            function gameOver () {


                lives = 99;
                ballOnPaddle = true;
                ball.reset(paddle.body.x + 16, paddle.y - 16);
                ball.animations.stop();


            }

            function ballHitBrick (_ball, _brick) {

                _brick.kill();
                hitBlock.play();
                score += 10;

                scoreText.text = 'score: ' + score;

                //  Are they any bricks left?
                if (bricks.countLiving() == 0)
                {
                    //  New level starts
                    score += 1000;
                    scoreText.text = 'score: ' + score;


                    //  Let's move the ball back to the paddle
                    ballOnPaddle = true;
                    ball.body.velocity.set(0);
                    ball.x = paddle.x + 16;
                    ball.y = paddle.y - 16;
                    ball.animations.stop();

                    //  And bring the bricks back from the dead :)
                    bricks.callAll('revive');
                }

            }

            function ballHitPaddle (_ball, _paddle) {
                hitPaddle.play();
                var diff = 0;

                if (_ball.x < _paddle.x)
                {
                    //  Ball is on the left-hand side of the paddle
                    diff = _paddle.x - _ball.x;
                    _ball.body.velocity.x = (-10 * diff);
                }
                else if (_ball.x > _paddle.x)
                {
                    //  Ball is on the right-hand side of the paddle
                    diff = _ball.x -_paddle.x;
                    _ball.body.velocity.x = (10 * diff);
                }
                else
                {
                    //  Ball is perfectly in the middle
                    //  Add a little random X to stop it bouncing straight up!
                    _ball.body.velocity.x = 2 + Math.random() * 8;
                }

            }


            function updateLine() {
                if(line.length != undefined){
                    if (line.length < content[index].length)
                    {
                        line = content[index].substr(0, line.length + 1);
                        // text.text = line;
                        kernText.setText(line);
                    }
                    else{
                        //  Wait 2 seconds then start a new line
                        game.time.events.add(Phaser.Timer.SECOND * 2, nextLine, this);
                    }
                }
            }

            function nextLine() {
                index++;
                if (index < content.length){
                    line = '';
                    game.time.events.repeat(80, content[index].length + 1, updateLine, this);
                }
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
