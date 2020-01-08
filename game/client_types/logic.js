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
var stepRules = ngc.stepRules;
var J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    node.game.history = {};

    // Must implement the stages here.

    stager.setOnInit(function() {
        // Initialize the client.
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });

    stager.extendStep('pbgame_respond', {
        cb: function() {
            ++ node.game.round;
            node.on.data('done', function (msg) {
                var id;

                id = msg.from;
                addToHistory(id, msg.data.choice, node.game.history);
            });
        }
    });

    stager.extendStep('pbgame_results', {
            cb: function() {
                var playerIds = [];
                var p1Id, p2Id, p3Id;
                var p1Choice, p2Choice, p3Choice;
                var p1Payoff, p2Payoff, p3Payoff;

                playerIds = Object.keys(node.game.history);
                p1Id = playerIds[0];
                p2Id = playerIds[1];
                p3Id = playerIds[2];
                p1Choice = getRecentChoice(p1Id, node.game.history);
                p2Choice = getRecentChoice(p2Id, node.game.history);
                p3Choice = getRecentChoice(p3Id, node.game.history);

                if ('DEFECT' === p1Choice) {
                    p1Payoff = 10;
                }
                else {
                    p1Payoff = 5;
                }
                if ('DEFECT' === p2Choice) {
                    p2Payoff = 10;
                }
                else {
                    p2Payoff = 5;
                }
                if ('DEFECT' === p3Choice) {
                    p3Payoff = 10;
                }
                else {
                    p3Payoff = 5;
                }
                addCoins(p1Id, p1Payoff, node.game.history);
                addCoins(p2Id, p2Payoff, node.game.history);
                addCoins(p3Id, p3Payoff, node.game.history);
                sendToClient(p1Id, p1Payoff, p2Payoff, p2Choice, p3Payoff, p3Choice);
                sendToClient(p2Id, p2Payoff, p1Payoff, p1Choice, p3Payoff, p3Choice);
                sendToClient(p3Id, p3Payoff, p2Payoff, p2Choice, p1Payoff, p1Choice);
                updateWin(p1Id, p1Payoff);
                updateWin(p2Id, p2Payoff);
                updateWin(p3Id, p3Payoff);
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

        function sendToClient(id, myPayoff, otherPayoff, choice) {
                node.say("pbgame_results", id, {
                    myEarning: myPayoff,
                    totalFish: otherPayoff + myPayoff ,
                    myBank: getBankTotal(id, node.game.history),
                    otherChoice: choice
                });
                //node.say("myEarning", id, myPayoff);
                //node.say("otherEarning", id, otherPayoff);
                //node.say("myBank", id, getBankTotal(id, node.game.history));
            }

        function updateWin(id, win) {
                var client;
                client = channel.registry.getClient(id);
                client.win = client.win ? client.win + win : win;
            }

            // retrieves the player's total number of coins
            function getBankTotal(id, history) {
                return history[id].coins;
            }

            // appends the player's choice to history data
            function addToHistory(id, choice, history) {
                if (!history[id]) {
                    history[id] = {};
                    history[id].coins = 0;
                    history[id].choices = [];
                }
                history[id].choices.push(choice);
                console.log(id + choice);
            }

            // retrieves the player's most recent choice
            function getRecentChoice(id, history) {
                return history[id].choices[history[id].choices.length - 1];
            }

            // increases player's coins by received Payoff
            function addCoins(id, payOff, history) {
                history[id].coins += payOff;
            }

};


