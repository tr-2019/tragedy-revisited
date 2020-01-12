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

            var restPool;
            restPool = sumPool;

            node.game.pl.each(function(player) {
            node.say('leftfish', player.id, restPool)
          });

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
            var pid, client, choice, payoff;

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
                //earnings by every player overall + refill the pool by
                //min. value (5<10)
                sumPool = sumPool - payoff + 5;
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
            match: 'round_robin',
            cycle: 'repeat',
        },
        cb: function() {
            // Creating a new array every round of the receiving offers (manipulated)
            node.game.offers = [];
            // own decision of offer (unmanipulated)
            node.game.offers_um = [];


              var choice, observer;
              var i, pid;
              var playerIds = [];
              var alias;
              playerIds = Object.keys(node.game.history);

            if (treatmentName === 'pressure') {
                  // data.history = history_you_saved;
                  // history[id].choices
              for (i = 0; i < playerIds.length; i++) {
                pid = playerIds[i];

                alias = i+1;


                observer = node.game.matcher.getMatchFor(pid);
                choice = { lastd: getRecentChoice(pid, node.game.history),
                            from: alias};
                if ('DEFECT' === choice.lastd) {
                  choice.lastd = 10;
                }
                else {
                  choice.lastd = 5;
                }
                node.say('history', observer, choice);
              };
            };

          if (treatmentName === 'standard') {
            node.game.pl.each(function(player) {
            node.say('nohistory', player.id)
            });
          };
                node.on.data('done', function(msg) {
                  var observer;
                  var pid, playerIds;
                  var offer, offer2;

                  observer = node.game.matcher.getMatchFor(msg.from);

                  if (msg.data.offer === 2.5) {
                      offer = msg.data.offer + 1.5;
                      offer2 = msg.data.offer;
                  }
                  else {
                      offer = 0;
                      offer2 = 0;
                  }

                node.game.offers.push({
                    donation: offer,
                    receiver: msg.from,
                    from: observer
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
            var i, pid, client, len, receiver, receiver2, data, data_um;
            var playerIds = [];
            len = node.game.offers.length;
            // does not make sense yo, not the same order of decisions in arrays
            //but wit node.game.offers([i]).from([i]) -> undefined
            playerIds = Object.keys(node.game.history);
            for (i=0 ; i < len ; i++) {
                // 'coins' are undefined in history
                //playerIds = Object.keys(node.game.offers[i].from);
                pid = playerIds[i];
                receiver2 = node.game.offers[i].receiver;
                receiver = node.game.offers[i].from;
                data = {
                    from: node.game.offers[i].from,
                    donation: node.game.offers[i].donation,
                    receiver: node.game.offers[i].receiver,
                    loss: node.game.offers_um[i].donation_um * (-1),
                };
                
                addCoins(receiver, data.donation, node.game.history);
                addCoins(receiver2, data.loss, node.game.history);
                updateWin(receiver, data.donation);
                updateWin(receiver2, data.loss);

                // Send the decision to each player.
                node.say('decision', receiver, data);
                node.say('loss', pid, data_um);
            }

            console.log('Game round: ' + node.player.stage.round);
        }
    });

        stager.extendStep('endpayoff', {
    cb: function() {
        // All available options shown here.

        gameRoom.computeBonus({

            // The names of the columns in the dump file.
            // Default: [ 'id' 'access', 'exit', 'bonus' ]
            header: [ 'id', 'type', 'workerid', 'hitid',
                       'assignmentid', 'exit', 'bonus' ],

            // The name of the keys in the registry object from which
            // the values for the dump file are taken. If a custom
            // header is provided, then it is equal to header.
            // Default: [ 'id' 'AccessCode', 'ExitCode', winProperty ] || header
            headerKeys: [ 'id', 'clientType', 'WorkerId',
                          'HITId', 'AssignmentId', 'ExitCode', 'win' ],

            // If different from 1, the bonus is multiplied by the exchange
            // rate, and a new property named (winProperty+'Raw') is added.
            // Default: (settings.EXCHANGE_RATE || 1)
            exchangeRate: 1,

            // The name of the property holding the bonus.
            // Default: 'win'
            cb: function(){
              var i, len;
              var playerIds = [];
              len = node.game.offers.length,
              playerIds = Object.keys(node.game.history);
              for (i=0 ; i < len ; i++) {
                node.game.client[i].win
              };
              winProperty: node.game.client.win
            },

            // The decimals included in the bonus (-1 = no rounding)
            // Default: 2
            winDecimals: 2,

            // If a property is missing, this value is used instead.
            // Default: 'NA'
            missing: 'NA',

            // If set, this callback can manipulate the bonus object
            // before sending it.
            // Default: undefined
            cb: function(o) { o.win = o.win + 1 },

            // If TRUE, sends the computed bonus to each client
            // Default: true
            say: true,

            // If TRUE, writes a 'bonus.csv' file.
            // Default: true
            dump: true,

            // If TRUE, it appends to an existing file (if found).
            // Default: false
            append: true,

            // An optional callback function to filter out clients
            // Default: undefined
            filter: function(client) {
                return true; // keeps the client (else skips it).
            },

            // An array of client objects to use instead of the clients
            // in the registry.
            // Default: undefined
            // clients: [ client1, client2 ],

            // If TRUE, console.log each bonus object
            // Default: false
            print: true
        });

        // Do something with eventual incoming data from EndScreen.
        node.on.data('email', function(msg) {
           // Store msg to file.
        });
        node.on.data('feedback', function(msg) {
           // Store msg to file.
        });

        // Save data in the data/roomXXX directory.
            node.game.memory.save('data.json');
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

    // retrieves the player's most recent choice
    function getRecentChoice(id, history) {
        return history[id].choices[history[id].choices.length - 1];
    }

    // increases player's coins by received Payoff
    function addCoins(id, payOff, history) {
        history[id].coins += payOff;
    }

};
