/**
 * # Player type implementation of the game stages
 * Copyright(c) 2020 LeoAlexanderLennart <>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";
//dunno yo
var ngc = require('nodegame-client');
var Stager = ngc.Stager;
var stepRules = ngc.stepRules;
var constants = ngc.constants;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    // var cbs;
    var channel = gameRoom.channel;
    var node = gameRoom.node;

    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;

        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);

        this.visualTimer = node.widgets.append('VisualTimer', header);

        this.doneButton = node.widgets.append('DoneButton', header);

        this.MoneyTalks = node.widgets.append('MoneyTalks', header, {
            title: 'My Earnings: ',
            currency: ' coins',
            money: 0,
            precision: 1,
        });

        // Additional debug information while developing the game.
        //    this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions1', {
        frame: 'instructions1.htm'
    });

      if (treatmentName === "standard") {
          stager.extendStep('instructions2', {
              frame: 'instructions_standard2.htm'
          });
      }

      // Treatment = With history
      else {
        stager.extendStep('instructions2', {
            frame: 'instructions2.htm'
        });

      }

    stager.extendStep('quiz', {
        widget: {
            name: 'ChoiceManager',
            root: 'container',
            options: {
                className: 'centered',
                mainText: "Let's see if you could understand how the game works.",
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'fish_reproduction',
                        mainText: 'How many new fish are born after each round?',
                        hint: 'If your group did not already extinct the whole population, of course.',
                        choices: [
                            '0',
                            '30',
                            '50',
                            'Depends on how much the players fished',
                            "I don't know"
                        ],
                        correctChoice: 1,
                        shuffleChoices: true,
                        orientation: 'V'
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'reciprocity',
                        mainText: '4 ECU can be received every round if your colleague is willing to donate. If he/she is, how many coins does he/she have to take from his/her account?',
                        hint: 'The mayor adds something ...',
                        choices: [
                            '0',
                            '1',
                            '2.5',
                            '4',
                            "I don't know"
                        ],
                        correctChoice: 2,
                        shuffleChoices: true
                    },
                ]
            }

        }
    });

    stager.extendStep('pbgame_respond', {
        donebutton: false,
        frame: 'pbgame.htm',
        timer: settings.bidTime,
        cb: function() {
            W.getElementById('coop').style.display = '';

          var totalPool;
          node.on.data('leftfish', function(msg) {
            totalPool = msg.data;
            W.setInnerHTML('totalPool', totalPool);
          });

          node.on.data('empty', function(msg){
            node.done({choice: 'null'});
          });
            // button options
            var c_button,nc_button;

            c_button = W.getElementById('c_submitOffer');
            nc_button = W.getElementById('nc_submitOffer');
            c_button.onclick = function() {
                node.done({ choice: 'COOPERATE' });
            };
            nc_button.onclick = function() {
                node.done({ choice: 'DEFECT' });
            }
        },

        timeup: function() {
            W.gid('nc_submitOffer').click();
        },
    });

    stager.extendStep('pbgame_results', {
        donebutton: true,
        timer: settings.bidTime,
        cb: function() {
            var myEarning, totalFish, myBank, otherChoice, totalPool;
            node.on.data('pbgame_results', function(msg) {
                myEarning = msg.data.myEarning;
                W.setInnerHTML('myearning', 'You earned ' +  myEarning +
              ' coins.');
                totalFish = msg.data.totalFish;
                W.setInnerHTML('totalFish', 'Total number of fish caught by all players in this round: '
                + totalFish);
                myBank = msg.data.myBank;
                W.setInnerHTML('mybank', myBank);
                totalPool = msg.data.totalPool;
                W.setInnerHTML('totalPool', totalPool + ' fish are left in the pond.');
                otherChoice = msg.data.otherChoice;
                if (otherChoice) {
                    W.setInnerHTML('otherchoice', otherChoice);
                };
                node.game.MoneyTalks.update(myEarning);

            });

            node.on.data('empty', function(msg) {
              W.setInnerHTML('empty', 'Oh no! Your group tried to catch all remaining fish in the pond at once. You will not earn any coins in this round.' +
            ' Also, the fish population is extinct now. All remaining rounds of fishing will be skipped.');

            });
        },

        timeup: function() {
            W.gid('DoneButton').click();
        },

        frame: "results.htm"
    });



    // IR Game, observer -> recieve, and "dictator" -> donate
    stager.extendStep('irgame1', {
        donebutton: false,
        frame: 'game.htm',
        //timer: settings.bidTime,
        cb: function() {
            var button1, button2, offer;
            var span, div, dotsObj;
            // Make the dictator display visible.
            div = W.getElementById('receiver').style.display = '';
            span = W.getElementById('dots');

            node.on.data('history', function(msg) {
              W.setInnerHTML('meeting', 'You meet Player'
              + msg.data.from + ' at the fish market.');
              W.setInnerHTML('pbgdecision',
              'And you have heard from your colleagues that Player' +
              msg.data.from + ' has fished '
               + msg.data.lastd + ' fish in the last round.')
          });
            node.on.data('nohistory', function(msg) {
              W.setInnerHTML('nohistory', "You meet another anonymous player on the fish market. ")
            });
            // W.gid = W.getElementById.
            button1 = W.gid('submitOffer1');
            button2 = W.gid('submitOffer2');

            // Listen on click event.
            button1.onclick = function() {
                var decision;
                decision = 0;
                node.done({ offer: decision });
            };

            button2.onclick = function() {
                var decision;
                decision = 2.5;
                node.done({ offer: decision });
            };
        },
        timeup: function() {
            W.gid('submitOffer1').click();
        }
    });

    stager.extendStep('irgame2', {
        donebutton: true,
        frame: 'irgame_results.htm',
        cb: function() {
            var span, div, dotsObj;
            var myEarning, myLoss;
            // Make the observer display visible.
            div = W.getElementById('receiver').style.display = '';
            span = W.getElementById('dots');
            dotsObj = W.addLoadingDots(span);

            node.on.data('decision', function(msg) {
                dotsObj.stop();

              //  W.setInnerHTML('waitingFor', 'Your partner made a decision!');
                W.setInnerHTML('decision',
                               'Another player decided to give ' +
                               msg.data.donation + ' coins to you.');
                myEarning = msg.data.donation;
                // Display from
                // If an history is in msg.data, display history.
                node.game.MoneyTalks.update(myEarning);

            });

            node.on.data('loss', function(msg) {
              W.setInnerHTML('owndecision', 'You decided to give: ' + msg.data.loss * (-1));
              myLoss = 0;
              myLoss = msg.data.loss; //* (-1);
              node.game.MoneyTalks.update(myLoss);
            });



        }
    });

    stager.extendStep('feedback1', {
        widget: {
            name: 'ChoiceManager',
            root: 'container',
            options: {
                className: 'centered',
                mainText: "Please leave some feedback about the game",
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'instructions_clear',
                        mainText: 'When the game started, how well informed did you feel after reading the instructions?',
                        hint: 'Try to give us an orientation if you were rather confused or rather clear about what to expect.',
                        choices: [
                            '1 - I was rather confused',
                            '2 - Some things were clear, others not so much',
                            '3 - It was okay',
                            '4 - I thought I was rather well informed',
                            '5 - Almost everything seemed perfectly clear to me',
                            "0 - I don't want to answer this"
                        ],
                        requiredChoice: true,
                        shuffleChoices: false,
                        orientation: 'V'
                    },
                ]
            }},
        cb: function() {
            W.cssRule('#instructions_clear td { text-align: left; }');
        }
    });

    /**stager.extendStep('feedback2', {
        widget:  {
            name: 'Feedback',
            options: {
                mainText: 'Please leave any comments about the game here',
                hint: 'If you do not like to do so, just press the "Done"-Button.',
                minChars: 0,
                minWords: 0,
                showSubmit: false,
                requiredChoice: false,
            }
        }
    });*/

    // EndScreen in a Widget Step at the end of the game.
 stager.extendStep('endpayoff', {
    donebutton: false,
    frame: 'end.htm',
    cb: function() {
        node.game.visualTimer.setToZero();
    },
    widget: {
        name: 'EndScreen',
        root: "body",
        options: {
            title: false, // Disable title for seamless Widget Step.
            panel: false, // No border around.
            showEmailForm: false,
            showFeedbackForm: true,
            showTotalWin: true,
            totalWinCurrency: '€',
             email: {
                texts: {
                    label: 'Enter your email (optional):',
                    errString: 'Please enter a valid email and retry'
                }
            },
            feedback: { minLength: 0 }
        }
    }
});

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
            node.game.visualTimer.setToZero();
        }
    });
};
