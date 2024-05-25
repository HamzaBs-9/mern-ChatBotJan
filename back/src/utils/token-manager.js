const jwt = require("jsonwebtoken");


const createToken = (id, email, expiresIn) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

const verifyToken = async (req, res, next) => {
  const token =  req.cookies[process.env.JWT_TOKEN_NAME];

  if (!token || typeof token !== "string" || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });

  }

  try {
    const success = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtData = success;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token Expired" , err });
  }
    
}

module.exports = { createToken, verifyToken };