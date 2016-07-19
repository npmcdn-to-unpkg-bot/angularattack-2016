//--------------
__phaser = {

    gameObj: null,

    //-------------------
    game:{

      //-------------------
      init(canvasEle, appComponent){
          //yay

          var game = new Phaser.Game(800, 500, Phaser.AUTO, canvasEle);
          __phaser.gameObj = game;

          var assets = {
              coinSound: null
          };

          game.state.add('play', {
              preload: function() {
                  this.game.load.image('bg', 'assets/kanye_enemies/bg.png');
                  this.game.load.image('kanye', 'assets/kanye_enemies/kanye.png');

                  this.game.load.image('kim', 'assets/kanye_enemies/kim.png');
                  this.game.load.image('north', 'assets/kanye_enemies/north.png');
                  this.game.load.image('drake', 'assets/kanye_enemies/drake.png');
                  this.game.load.image('toddler', 'assets/kanye_enemies/toddler.png');
                  this.game.load.image('taylor', 'assets/kanye_enemies/taylor.png');
                  this.game.load.image('bug', 'assets/kanye_enemies/bug.png');
                  this.game.load.image('mailman', 'assets/kanye_enemies/mailman.png');
                  this.game.load.image('pope', 'assets/kanye_enemies/pope.gif');
                  this.game.load.image('radio', 'assets/kanye_enemies/radio.png');
                  this.game.load.image('yourself', 'assets/kanye_enemies/yourself.png');

                  this.game.load.image('gold_coin', 'assets/kanye_enemies/coin.png');

                  this.game.load.image('dagger', 'assets/kanye_enemies/rudeness.png');
                  this.game.load.image('swordIcon1', 'assets/496_RPG_icons/S_Buff01.png');

                  game.load.audio('music', ['assets/kanye_enemies/607011_This-Is-The-End.ogg']);
                  game.load.audio('coin', ['assets/kanye_enemies/242857__plasterbrain__coin-get.ogg']);

                  // build panel for upgrades
                  var bmd = this.game.add.bitmapData(250, 500);
                  bmd.ctx.fillStyle = '#a13c2a';
                  bmd.ctx.strokeStyle = '#4c0d04';
                  bmd.ctx.lineWidth = 12;
                  bmd.ctx.fillRect(0, 0, 250, 500);
                  bmd.ctx.strokeRect(0, 0, 250, 500);
                  this.game.cache.addBitmapData('upgradePanel', bmd);

                  var buttonImage = this.game.add.bitmapData(476, 48);
                  buttonImage.ctx.fillStyle = '#db9c7d';
                  buttonImage.ctx.strokeStyle = '#110d0d';
                  buttonImage.ctx.lineWidth = 4;
                  buttonImage.ctx.fillRect(0, 0, 225, 48);
                  buttonImage.ctx.strokeRect(0, 0, 225, 48);
                  this.game.cache.addBitmapData('button', buttonImage);

                  // the main player
                  this.player = {
                      clickDmg: 1,
                      gold: 50,
                      dps: 0
                  };

                  // world progression
                  this.level = 1;
                  // how many monsters have we killed during this level
                  this.levelKills = 0;
                  // how many monsters are required to advance a level
                  this.levelKillsRequired = 10;
              },
              create: function() {
                  var state = this;
                  var music;

                  music = game.add.audio('music');
                  assets.coinSound = game.add.audio('coin');

                   // Play music
                  music.loopFull(.75);;

                  this.background = this.game.add.group();
                  // setup each of our background layers to take the full screen
                  ['bg']
                      .forEach(function(image) {
                          var bg = state.game.add.tileSprite(0, 0, state.game.world.width,
                              state.game.world.height, image, '', state.background);
                          bg.tileScale.setTo(4,4);
                      });

                  this.upgradePanel = this.game.add.image(10, 70, this.game.cache.getBitmapData('upgradePanel'));
                  var upgradeButtons = this.upgradePanel.addChild(this.game.add.group());
                  upgradeButtons.position.setTo(8, 8);

                  var upgradeButtonsData = [
                      {icon: 'dagger', name: 'Rudeness', level: 0, cost: 5, purchaseHandler: function(button, player) {
                          player.clickDmg += 1;
                      }},
                      {icon: 'swordIcon1', name: 'Arrogance', level: 0, cost: 25, purchaseHandler: function(button, player) {
                          player.dps += 5;
                      }}
                  ];

                  var button;
                  upgradeButtonsData.forEach(function(buttonData, index) {
                      button = state.game.add.button(0, (50 * index), state.game.cache.getBitmapData('button'));
                      button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
                      button.text = button.addChild(state.game.add.text(42, 6, buttonData.name + ': ' + buttonData.level, {font: '16px Arial Black'}));
                      button.details = buttonData;
                      button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + buttonData.cost, {font: '16px Arial Black'}));
                      button.events.onInputDown.add(state.onUpgradeButtonClick, state);

                      upgradeButtons.addChild(button);
                  });

                  game.add.sprite(0, 300, 'kanye');

                  var monsterData = [
                      {name: 'Interrupt Kim',                   image: 'kim',               maxHealth: 35},
                      {name: 'Interrupt Drake',                 image: 'drake',             maxHealth: 20},
                      {name: 'Interrupt North',                 image: 'north',             maxHealth: 12},
                      {name: 'Interrupt This Toddler',          image: 'toddler',           maxHealth: 33},
                      {name: 'Interrupt Taylor Swift',          image: 'taylor',            maxHealth: 23},
                      {name: 'Interrupt A Bug',                 image: 'bug',               maxHealth: 10},
                      {name: 'Interrupt The Mailman',           image: 'mailman',           maxHealth: 26},
                      {name: 'Interrupt The Pope',              image: 'pope',              maxHealth: 40},
                      {name: 'Interrupt The Radio',             image: 'radio',             maxHealth: 24},
                      {name: 'Interrupt Yourself',              image: 'yourself',          maxHealth: 30}
                  ];
                  this.monsters = this.game.add.group();

                  var monster;
                  monsterData.forEach(function(data) {
                      // create a sprite for them off screen
                      monster = state.monsters.create(1000, state.game.world.centerY, data.image);
                      // use the built in health component
                      monster.health = monster.maxHealth = data.maxHealth;
                      // center anchor
                      monster.anchor.setTo(0.5, 0.7);
                      // reference to the database
                      monster.details = data;

                      //enable input so we can click it!
                      monster.inputEnabled = true;
                      monster.events.onInputDown.add(state.onClickMonster, state);

                      // hook into health and lifecycle events
                      monster.events.onKilled.add(state.onKilledMonster, state);
                      monster.events.onRevived.add(state.onRevivedMonster, state);
                  });

                  // display the monster front and center
                  this.currentMonster = this.monsters.getRandom();
                  this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY + 50);

                  this.monsterInfoUI = this.game.add.group();
                  this.monsterInfoUI.position.setTo(this.currentMonster.x - 220, this.currentMonster.y + 120);
                  this.monsterNameText = this.monsterInfoUI.addChild(this.game.add.text(0, 0, this.currentMonster.details.name, {
                      font: '32px Arial Black',
                      fill: '#fff',
                      strokeThickness: 4
                  }));
                  this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(0, 80, this.currentMonster.health + ' HP', {
                      font: '32px Arial Black',
                      fill: '#ff0000',
                      strokeThickness: 4
                  }));

                  this.dmgTextPool = this.add.group();
                  var dmgText;
                  for (var d=0; d<50; d++) {
                      dmgText = this.add.text(0, 0, '1', {
                          font: '64px Arial Black',
                          fill: '#fff',
                          strokeThickness: 4
                      });
                      // start out not existing, so we don't draw it yet
                      dmgText.exists = false;
                      dmgText.tween = game.add.tween(dmgText)
                          .to({
                              alpha: 0,
                              y: 100,
                              x: this.game.rnd.integerInRange(100, 700)
                          }, 1000, Phaser.Easing.Cubic.Out);

                      dmgText.tween.onComplete.add(function(text, tween) {
                          text.kill();
                      });
                      this.dmgTextPool.add(dmgText);
                  }

                  // create a pool of gold coins
                  this.coins = this.add.group();
                  this.coins.createMultiple(50, 'gold_coin', '', false);
                  this.coins.setAll('inputEnabled', true);
                  this.coins.setAll('goldValue', 1);
                  this.coins.callAll('events.onInputDown.add', 'events.onInputDown', this.onClickCoin, this);

                  this.playerGoldText = this.add.text(30, 30, 'Notoriety: ' + this.player.gold, {
                      font: '24px Arial Black',
                      fill: '#fff',
                      strokeThickness: 4
                  });

                  // 100ms 10x a second
                  this.dpsTimer = this.game.time.events.loop(100, this.onDPS, this);

                  // setup the world progression display
                  this.levelUI = this.game.add.group();
                  this.levelUI.position.setTo(this.game.world.centerX, 30);
                  this.levelText = this.levelUI.addChild(this.game.add.text(0, 0, 'Asshole-Level: ' + this.level, {
                      font: '24px Arial Black',
                      fill: '#fff',
                      strokeThickness: 4
                  }));
                  this.levelKillsText = this.levelUI.addChild(this.game.add.text(0, 30, 'Interrupts: ' + this.levelKills + '/' + this.levelKillsRequired, {
                      font: '24px Arial Black',
                      fill: '#fff',
                      strokeThickness: 4
                  }));
              },
              onDPS: function() {
                  if (this.player.dps > 0) {
                      if (this.currentMonster && this.currentMonster.alive) {
                          var dmg = this.player.dps / 10;
                          this.currentMonster.damage(dmg);
                          // update the health text
                          this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
                      }
                  }
              },
              onUpgradeButtonClick: function(button, pointer) {
                  // make this a function so that it updates after we buy
                  function getAdjustedCost() {
                      return Math.ceil(button.details.cost + (button.details.level * 1.46));
                  }

                  if (this.player.gold - getAdjustedCost() >= 0) {
                      this.player.gold -= getAdjustedCost();
                      this.playerGoldText.text = 'Gold: ' + this.player.gold;
                      button.details.level++;
                      button.text.text = button.details.name + ': ' + button.details.level;
                      button.costText.text = 'Cost: ' + getAdjustedCost();
                      button.details.purchaseHandler.call(this, button, this.player);
                  }
              },
              onClickCoin: function(coin) {
                  if (!coin.alive) {
                      return;
                  }
                  // give the player gold
                  this.player.gold += coin.goldValue;
                  assets.coinSound.play();
                  // update UI
                  this.playerGoldText.text = 'Notoriety: ' + this.player.gold;
                  // remove the coin
                  coin.kill();
              },
              onKilledMonster: function(monster) {
                  // move the monster off screen again
                  monster.position.set(1000, this.game.world.centerY);

                  var coin;
                  // spawn a coin on the ground
                  coin = this.coins.getFirstExists(false);
                  coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY);
                  coin.goldValue = Math.round(this.level * 1.33);
                  this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);

                  this.levelKills++;

                  if (this.levelKills >= this.levelKillsRequired) {
                      this.level++;
                      this.levelKills = 0;
                  }

                  this.levelText.text = 'Asshole-Level: ' + this.level;
                  this.levelKillsText.text = 'Interrupts: ' + this.levelKills + '/' + this.levelKillsRequired;

                  // pick a new monster
                  this.currentMonster = this.monsters.getRandom();
                  // upgrade the monster based on level
                  this.currentMonster.maxHealth = Math.ceil(this.currentMonster.details.maxHealth + ((this.level - 1) * 10.6));
                  // make sure they are fully healed
                  this.currentMonster.revive(this.currentMonster.maxHealth);
              },
              onRevivedMonster: function(monster) {
                  monster.position.set(this.game.world.centerX + 100, this.game.world.centerY + 50);
                  // update the text display
                  this.monsterNameText.text = monster.details.name;
                  this.monsterHealthText.text = monster.health + 'HP';
              },
              onClickMonster: function(monster, pointer) {
                  // apply click damage to monster
                  this.currentMonster.damage(this.player.clickDmg);

                  // grab a damage text from the pool to display what happened
                  var dmgText = this.dmgTextPool.getFirstExists(false);
                  if (dmgText) {
                      dmgText.text = this.player.clickDmg;
                      dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
                      dmgText.alpha = 1;
                      dmgText.tween.start();
                  }

                  // update the health text
                  this.monsterHealthText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP' : 'DEAD';
              }
          });

          var style = { font: "30px Courier New", fill: "#fff", align: "center" };
          splashtext = game.add.text(game.world.centerX, game.world.centerY, "", style);
          splashtext.anchor.set(0.5);
          game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                splashtext.setText("So full disclaimer: ")
          }, this);

          game.time.events.add(Phaser.Timer.SECOND * 2.5, function(){
                splashtext.setText("We had originally envisioned Kanye's Quest\rto be something of an RPG lite.")
          }, this);

          game.time.events.add(Phaser.Timer.SECOND * 8, function(){
                splashtext.setText("We kinda ran out of time.\rBut more importantly, \r once we started thinking about it...")
          }, this);

          game.time.events.add(Phaser.Timer.SECOND * 12, function(){
                splashtext.setText("We don't feel like an RPG would have been\rthe genere of choice for Mr. West.")
          }, this);

          game.time.events.add(Phaser.Timer.SECOND * 18, function(){
                splashtext.setText("He's more of a... man of action.")
          }, this);


          game.time.events.add(Phaser.Timer.SECOND * 22, function(){
                splashtext.setText("So we did this instead... ENJOY!")
          }, this);


          game.time.events.add(Phaser.Timer.SECOND * 26, function(){
                splashtext.destroy();
                game.state.start('play');
          }, this);



      }
      //-------------------

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
