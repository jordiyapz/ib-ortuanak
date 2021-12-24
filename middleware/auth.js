require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

module.exports = async (req, res, next) => {
  // mengambil data token
  const jwtToken = req.headers["x-auth-token"];
  //   verivikasi jwt token
  try {
    jwt.verify(jwtToken, JWT_SECRET_KEY, function (err, decoded) {
      // validasi token
      if (err) {
        // jika token tidak valid
        res.status(401).json({
          code: 401,
          status: "UNATHORIZED",
          message: "silahkan login terlebih dahulu",
        });
      } else {
        // jika token valid
        req.id = decoded.id;
        next();
      }
    });

  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
};
