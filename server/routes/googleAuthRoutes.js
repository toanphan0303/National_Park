const passport = require('passport');
module.exports = app =>{
  app.get(
        '/auth/google',
        (req, res, next) => {
            if (req.query.return) {
            res.redirect('/profile')
        }
        next();
      },
      passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.profile.emails.read' , 'profile'] })
    );

    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (err,req, res, next) => {
            if (err.name === 'TokenError') {
                    console.log(err)
                    res.redirect('/auth/tokenerror'); // redirect them back to the login page
                } else {
                    console.log(err)
                    res.redirect('/auth/error');
                }
            },
        (req, res) => { // On success, redirect back to '/'
            res.redirect('/');
        }
    );

}
