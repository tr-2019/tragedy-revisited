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

    stager.extendStep('pbgame', {
      cb: function() {
        console.log('PBgame.');
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
