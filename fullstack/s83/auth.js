const jwt = require("jsonwebtoken");
const secret = "inventoryManagement";


module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email
  };

  return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === 'undefined') {
    return res.status(401).send({ auth: 'Failed. No Token' });
  }

  token = token.slice(7, token.length);

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).send({
        auth: 'Failed',
        message: err.message
      });
    }

    req.user = decodedToken;
    next();
  });
};