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

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
    });


    stager.extendStep('pbgame', {
        donebutton: false,
        frame: 'pbgame.htm',
        timer: settings.bidTime,
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
        timeup: function() {
            W.gid('nc_submitOffer').click();
        }
      });

// IR Game, observer -> recieve, and "dictator" -> donate
stager.extendStep('irgame1', {
    donebutton: false,
    frame: 'game.htm',
    roles: {
        DONOR: {
            timer: settings.bidTime,
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
        donebutton: false,
        frame: 'game.htm',
        roles: {
            DONOR: {
                timer: settings.bidTime,
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

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
            node.game.visualTimer.setToZero();
        }
    });
};
