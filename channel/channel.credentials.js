/**
 * # Channel secret file
 * Copyright(c) 2019 LeoAlexLennart <>
 * MIT Licensed
 *
 * The file must return the administrator user name and password
 *
 * The secret key can be stored here directly or loaded asynchronously from
 * another source, e.g a remote service or a database.
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = function(settings, done) {

    return {
        user: 'tr-2019',
        pwd: 'z?{w8UZeh<'
    };

    // Example: return key asynchronously

    // loadCredentialsFromDatabase(function(err, credentials) {
    //     done(err, credentials);
    // });
};
