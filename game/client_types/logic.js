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
            var pid, payoff, sumPayoff;
            sendToClient(pid, payoff, sumPayoff, sumPool);
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
                sumPayoff += payoff;
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

            node.on.data('done', function(msg) {
                var offer, observer;
                offer = msg.data.offer;

                observer = node.game.matcher.getMatchFor(msg.from);

                node.game.offers.push({
                    donation: offer,
                    receiver: observer,
                    from: msg.from
                });

            });
            console.log('Game round: ' + node.player.stage.round);
        }
    });

    stager.extendStep('irgame2', {
        // maybe matcher here too.
        cb: function() {
            var i, len, receiver, data;
            len = node.game.offers.length;
            for (i=0 ; i < len ; i++) {
                receiver = node.game.offers[i].receiver;
                data = {
                    from: node.game.offers[i].from,
                    donation: node.game.offers[i].donation
                };

                if (treatmentName === 'XXX') {
                    // data.history = history_you_saved;
                    // history[id].choices
                }

                // Send the decision to each player.
                node.say('decision', receiver, data);
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

        node.say("pbgame_respond", id, {
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

    // retrieves the player's most recent choice
    function getRecentChoice(id, history) {
        return history[id].choices[history[id].choices.length - 1];
    }

    // increases player's coins by received Payoff
    function addCoins(id, payOff, history) {
        history[id].coins += payOff;
    }

};
