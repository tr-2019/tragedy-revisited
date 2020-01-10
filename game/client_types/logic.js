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
    var sumPool = 100;
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
            var i, len;
            var sumPayoff;
            var pid, choice, payoff;

            playerIds = Object.keys(node.game.history);

            sumPayoff = 0;
            for (i = 0; i < playerIds.length; i++) {

                pid = playerIds[i];
                choice = getRecentChoice(pid, node.game.history);
                if ('DEFECT' === choice) {
                    payoff = 10;
                }
                else {
                    payoff = 5;
                }
                //earnings by every player each round
                sumPayoff += payoff;
                //earnings by every player overall
                sumPool -= payoff;
                addCoins(pid, payoff, node.game.history);
                updateWin(pid, payoff);

                // Will be executed after the for-loop is finished.
                // This is an anonymous self-executing function.
                // It is called "closure".
                (function(pid, payoff) {
                    setTimeout(function() {
                        sendToClient(pid, payoff, sumPayoff, sumPool);
                    }, 100);
                })(pid, payoff);
            }
        }
    });

    stager.extendStep('irgame1', {
        matcher: {
            // roles: [ 'DONOR', 'RECEIVER' ],
            match: 'round_robin',
            cycle: 'mirror_invert',
            // sayPartner: false
            // skipBye: false,
        },
        cb: function() {
            // Creating a new object every round.
            node.game.offers = [];
            node.game.offers_um = [];

                node.on.data('done', function(msg) {
                  var offer, offer2;
                  if (msg.data.offer === 2.5) {
                      offer = msg.data.offer + 1.5;
                      offer2 = msg.data.offer;
                  }
                  else {
                      offer = 0;
                      offer2 = 0;
                  }

                var observer;
                observer = node.game.matcher.getMatchFor(msg.from);

                node.game.offers.push({
                    donation: offer,
                    receiver: observer,
                    from: msg.from
                });

                node.game.offers_um.push({
                  donation_um: offer2
                });
           });
            console.log('Game round: ' + node.player.stage.round);
        }
    });

    stager.extendStep('irgame2', {
        // maybe matcher here too.
        cb: function() {
            var i, pid, len, receiver, data, data_um;
            var playerIds = [];
            len = node.game.offers.length;
            playerIds = Object.keys(node.game.history);
            for (i=0 ; i < len ; i++) {
                pid = playerIds[i];
                receiver = node.game.offers[i].receiver;
                data = {
                    from: node.game.offers[i].from,
                    donation: node.game.offers[i].donation,
                    receiver: node.game.offers[i].receiver,
                    loss: node.game.offers_um[i].donation_um
                };
                // unmainpulated offer send to own pool
                data_um = 0;
                data_um = {loss: node.game.offers_um[i].donation_um};

                addCoins(pid, data.donation, node.game.history);
                addCoins(pid, data_um, node.game.history);



                if (treatmentName === 'XXX') {
                    // data.history = history_you_saved;
                    // history[id].choices
                }

                // Send the decision to each player.
                node.say('decision', receiver, data);
                node.say('loss', pid, data_um);
            }

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

    function sendToClient(id, myPayoff, totalPayoff, pool) {
        node.say("pbgame_results", id, {
            myEarning: myPayoff,
            totalFish: totalPayoff,
            myBank: getBankTotal(id, node.game.history),
            totalPool: pool
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

    // appends the player's choice to history data
    function addToHistory2(id, myDecision, history) {
      if (!history[id]) {
          history[id].myDecision = [];
      }
        history[id].myDecision.push(myDecision);
        console.log(id + myDecision);
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
