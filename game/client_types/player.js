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

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;

        // Bid is valid if it is a number between 0 and 100.
        this.isValidBid = function(n) {
            return node.JSUS.isInt(n, -1, 101);
        };

        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);

        this.visualTimer = node.widgets.append('VisualTimer', header);

        this.doneButton = node.widgets.append('DoneButton', header);

        this.MoneyTalks = node.widgets.append('MoneyTalks', header);

        // Additional debug information while developing the game.
    //    this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions1', {
        frame: 'instructions1.htm'
    });

    stager.extendStep('instructions2', {
        frame: 'instructions2.htm'
    });

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
                hint: 'If you did not alredy extinct the whole population, of course.',
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
                mainText: '4 ECU can be received every round if your potential is willing to donate. If he is, how much ECU does he have to take from his account?',
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

    stager.extendStep('pbgame', {
        donebutton: false,
        frame: 'pbgame.htm',
      //  timer: settings.bidTime,
        cb: function() {
            var c_button, nc_button, offer;

            W.getElementById('coop').style.display = '';
            c_button = W.gid('c_submitOffer');
            nc_button = W.gid('nc_submitOffer');

            c_button.onclick = function() {
                var decision;
                  decision = 5;
                node.done({ offer: decision });
            },
            nc_button.onclick = function() {
                var decision;
                  decision = 10;
                node.done({ offer: decision });
            };

            },
/**
            widget: function() {
              var earnings, offer;

              if c_button.onclick = TRUE {
              earnings = money + offer

            }

*/
            timeup: function() {
            W.gid('nc_submitOffer').click();
        },

      });

// IR Game, observer -> recieve, and "dictator" -> donate
stager.extendStep('irgame1', {
    donebutton: false,
    frame: 'game.htm',
    roles: {
        DONOR: {
            //timer: settings.bidTime,
            cb: function() {
                var button1, button2, offer;

                // Make the dictator display visible.
                W.getElementById('donor').style.display = '';
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
        },
        RECEIVER: {
            cb: function() {
                var span, div, dotsObj;

                // Make the observer display visible.
                div = W.getElementById('receiver').style.display = '';
                span = W.getElementById('dots');
                dotsObj = W.addLoadingDots(span);

                node.on.data('decision', function(msg) {
                    dotsObj.stop();
                    W.setInnerHTML('waitingFor', 'Decision arrived: ');
                    W.setInnerHTML('decision',
                                   'The donor offered: ' +
                                   msg.data + ' ECU.');

                    setTimeout(function() {
                        node.done();
                    }, 10000);
                });
            }
        }
    }
});

stager.extendStep('irgame2', {
        donebutton: true,
        frame: 'game.htm',
        roles: {
            DONOR: {
                //timer: settings.bidTime,
                cb: function() {
                    var button1, button2, offer;

                    // Make the dictator display visible.
                    W.getElementById('donor').style.display = '';
                    // W.gid = W.getElementById.
                    button1 = W.gid('submitOffer1');
                    button2 = W.gid('submitOffer2');

                    // Listen on click event.
                    button1.onclick = function() {
                        var decision;
                          decision = 0;
                       // Validate offer.
                      //  decision = node.game.isValidBid(offer.value);
                      //  if ('number' !== typeof decision) {
                      //      W.writeln('Please enter a number between ' +
                      //                '0 and 100.', 'dictator');
                      //      return;
                      //  }
                      //  button.disabled = true;

                        // Mark the end of the round, and
                        // store the decision in the server.
                        node.done({ offer: decision });
                    };

                    button2.onclick = function() {
                        var decision;
                          decision = 2.5;
                       // Validate offer.
                      //  decision = node.game.isValidBid(offer.value);
                      //  if ('number' !== typeof decision) {
                      //      W.writeln('Please enter a number between ' +
                      //                '0 and 100.', 'dictator');
                      //      return;
                      //  }
                      //  button.disabled = true;

                        // Mark the end of the round, and
                        // store the decision in the server.
                        node.done({ offer: decision });
                    };
                },
                timeup: function() {
                    //var n;
                    // Generate random value.
                    //n = 0;
                    // Set value in the input box.
                    //W.gid('offer').value = n;
                    // Click the submit button to trigger the event listener.
                    W.gid('submitOffer1').click();
                }
            },
            RECEIVER: {
                cb: function() {
                    var span, div, dotsObj;
                    // Make the observer display visible.
                    div = W.getElementById('receiver').style.display = '';
                    span = W.getElementById('dots');
                    dotsObj = W.addLoadingDots(span);

                    node.on.data('decision', function(msg) {
                        dotsObj.stop();
                        W.setInnerHTML('waitingFor', 'Decision arrived: ');
                        W.setInnerHTML('decision',
                                       'The donor offered: ' +
                                       msg.data + ' ECU.');

                        setTimeout(function() {
                            node.done();
                        }, 10000);
                    });
                }
            }
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

stager.extendStep('feedback2', {
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
});

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
            node.game.visualTimer.setToZero();
        }
    });
};
