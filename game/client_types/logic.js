/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2020 LeoAlexanderLennart <>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    stager.setOnInit(function() {
        // Initialize the client.
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });

var earnings;

    stager.extendStep('pbgame', {
      cb: function() {
        console.log('PBgame.');


      node.game.memory.on('insert', function(item){
          storeData({ data: item.offer });
      });

      node.game.memory.save('results1.json');


  /**    node.game.pl.each(function(player) {
          // Get the value saved in the registry, and send it.
          var cumulativeFishing = channel.registry.getClient(player.id).win;
          node.say('WIN', player.id, cumulativeFishing);
      });
    */

        function MoneyTalks(options) {

            /**
             * ### MoneyTalks.spanCurrency
             *
             * The SPAN which holds information on the currency
             */
            this.spanCurrency = 10;

            /**
             * ### MoneyTalks.spanMoney
             *
             * The SPAN which holds information about the money earned so far
             */
            this.spanMoney = null;

            /**
             * ### MoneyTalks.currency
             *
             * String describing the currency
             */
            this.currency = 'ECU';

            /**
             * ### MoneyTalks.money
             *
             * Currently earned money
             */
            this.money = 0;

            /**
             * ### MoneyTalks.precicison
             *
             * Precision of floating point number to display
             */
            this.precision = 2;

            /**
             * ### MoneyTalks.showCurrency
             *
             * If TRUE, the currency is displayed after the money
             */
            this.showCurrency = true;

            /**
             * ### MoneyTalks.currencyClassname
             *
             * Class name to be attached to the currency span
             */
            this.classnameCurrency = 'moneytalkscurrency';

            /**
             * ### MoneyTalks.currencyClassname
             *
             * Class name to be attached to the money span
             */
            this.classnameMoney = 'moneytalksmoney';
        }
      }
    });

    stager.extendStep('irgame1', {
          matcher: {
              roles: [ 'DONOR', 'RECEIVER' ],
              match: 'round_robin',
              cycle: 'mirror_invert',
              // sayPartner: false
              // skipBye: false,

          },
          cb: function() {
              node.once.data('done', function(msg) {
                  var offer, observer;
                  offer = msg.data.offer;

                  observer = node.game.matcher.getMatchFor(msg.from);
                  // Send the decision to the other player.
                  node.say('decision', observer, msg.data.offer);

              });
              console.log('Game round: ' + node.player.stage.round);
          }
      });

    stager.extendStep('irgame2', {
        matcher: {
            roles: [ 'DONOR', 'RECEIVER' ],
            match: 'round_robin',
            cycle: 'mirror_invert',
            // sayPartner: false
            // skipBye: false,

        },
        cb: function() {
            node.once.data('done', function(msg) {
                var offer, observer;
                offer = msg.data.offer;

                observer = node.game.matcher.getMatchFor(msg.from);
                // Send the decision to the other player.
                node.say('decision', observer, msg.data.offer);

            });
            console.log('Game round: ' + node.player.stage.round);
        }
    });

    stager.extendStep('end', {
        cb: function() {
            // Save data in the data/roomXXX directory.
            node.game.memory.save('data.json');
        }
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
