const passport = require('passport');
module.exports = app =>{
  app.get(
        '/auth/fb',
        (req, res, next) => {
            if (req.query.return) {
            res.redirect('/profile')
        }
        next();
      },
      passport.authenticate('facebook', { scope:  ['user_friends', 'manage_pages'] })
    );

    app.get(
        '/auth/fb/callback',
        passport.authenticate('facebook'),
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
          if(process.env.NODE_ENV === 'production'){
              res.redirect('https://npsplanner.herokuapp.com/#/');
          } else {
            res.redirect('https://localhost:5000/#/');
          }
        }
    );
}
