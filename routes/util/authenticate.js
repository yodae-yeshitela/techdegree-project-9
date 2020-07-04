const basicAuth = require('basic-auth');
const {User} = require('./../../db');
const bcryptjs = require('bcryptjs')

module.exports = async(req,res,next) => {
    const credentials = basicAuth(req);
    let message;
    if(credentials){
      let user = await User.findOne({
        where: {
          emailAddress: credentials.name
        }
      });
  
      if(user){
        const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
  
        if(authenticated){
          console.log(`Authentication successful for email: ${user.emailAddress}`);
          req.currentUserId = user.id;
        } else {
          message = `Authentication failed for email: ${user.emailAddress}`;
        }
  
      } else {
        message = `User not found for email: ${credentials.name}`;
      }
    } else {
      message = `Auth header not found`;
    }
  
    if(message){
      console.warn(message);
      res.status(401).json({error: {message: 'Access Denied'}})
    } else {
      next();
    }
}