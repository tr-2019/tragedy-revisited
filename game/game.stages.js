/**
 * # Game stages definition file
 * Copyright(c) 2020 LeoAlexanderLennart <>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

     stager
        .stage('instructions')
          .step('instructions1')
          .step('instructions2')
        .stage('quiz')
        .repeatStage('player', 2)
          .step('pbgame')
          .step('irgame1')
          .step('irgame2')
        .stage('feedback')
          .step('feedback1')
          .step('feedback2')
        .stage('end')
        .gameover();

    // Modify the stager to skip one stage.
    // stager.skip('instructions');

    // To skip a step within a stage use:
    // stager.skip('stageName', 'stepName');
    // Notice: here all stages have just one step.
};
