/**
 * # Game settings definition file
 * Copyright(c) 2020 LeoAlexanderLennart <>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = {

    // Variables shared by all treatments.

    // #nodeGame properties:

    /**
     * ### TIMER (object) [nodegame-property]
     *
     * Maps the names of the steps of the game to timer durations
     *
     * If a step name is found here, then the value of the property is
     * used to initialize the game timer for the step.
     */
    TIMER: {
        instructions: 60000
    },

    // # Game specific properties

    // Number of game rounds repetitions.
    REPEAT: 2,

    // In case an incoming offer does not pass validation, which indicates
    // cheating, re-set the dictator's offer to this value.
    //defaultOffer: 100,

    // # Treatments definition.

    // They can contain any number of properties, and also overwrite
    // those defined above.

    // If the `treatments` object is missing a treatment named _standard_
    // will be created automatically, and will contain all variables.

    poolsize: 80,

    treatments: {

        standard: {
            description: "NoHistory",
            bidTime: 10000,


        },

        pressure: {
            description: "withHistory",
            bidTime: 10000
        }

    }
};
