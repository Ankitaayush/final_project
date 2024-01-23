const jwt = require("jsonwebtoken");
const connection = require("../config/db");
const cookieParser = require("cookie-parser");
let getLoginPage = (req, res) => {
  if (req.session.loggedin) {
    console.log(req.session.role);
    if (req.session.role === 1) return res.redirect("/manager");
    else if (req.session.role === 2) return res.redirect("/vp");
    else if (req.session.role === 3) return res.redirect("/admin");
    else return res.redirect("/it");
  } else {
    return res.send({ text: "Welcome to login page" });
  }
};

let postLogin = (req, res, next) => {
  let username = req.body.userName;
  let password = req.body.password;

  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) {
          return res.json({
            error,
          });
        }
        // If the account exists
        if (results.length > 0) {
          // Generate JWT token
          // console.log("ho");
          const { id, username } = results[0];
          const token = jwt.sign(
            { id, username, role: results[0].id },
            "qwertyuiotuyutreewfq",
            { expiresIn: "1h" }
          );
          // Send the token in the response
          // console.log(token);

          // if (results[0].id == 1) res.redirect("/manager");
          // else if (results[0].id == 2) res.redirect("/vp");
          // else if (results[0].id == 3) res.redirect("/admin");
          // else if (results[0].id == 4) res.redirect("/request/track");
          // else res.redirect("/login");
          console.log(token);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: true,
          });

          res.json({ token, id: results[0].id });
        } else {
          return res.status(401).send("Incorrect Username and/or Password!");
        }
      }
    );
  } else {
    return res.status(400).send("Please enter Username and Password!");
  }
};

const protect = async (req, res) => {
  console.log("token return");
  try {
    console.log(req.cookies, "hi");
    const decode = req.cookies.jwt;
    if (!decode)
      return res.status(401).json({ error: "unauthorized:no token provided" });
    const decoded = jwt.verify(token, "qwertyuiotuyutreewfq");
    // jwt.verify(decode, "qwertyuiotuyutreewfq");
    // res.redirect("/it/vendor");
    console.log(decoded);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      error: "unauthorized :invalid token",
    });
  }
};
const checkuserrole = (expectedrole) => {
  console.log("hi87887i");
  return (req, res, next) => {
    try {
      const token = req.cookies.jwt;

      if (!token)
        return res.status(401).json({ error: "Unauthorized :no token" });
      const decoded = jwt.verify(token, "qwertyuiotuyutreewfq");

      if (decoded.role === expectedrole) next();
      else return res.status(403).json({ error: "forbidden" });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: "invalid token" });
    }
  };
};
const checkuserrole2 = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ error: "unauthorized:no token provided" });
    console.log(req.params.expectedRole);

    jwt.verify(token, "qwertyuiotuyutreewfq", (err, decoded) => {
      // console.log(decoded);
      if (err) return res.sendStatus(403);
      console.log(req.params.expectedRole);
      console.log(decoded.role);
      if (parseInt(req.params.expectedRole) == parseInt(decoded.role)) {
        console.log("wtf");
        res.send({ status: true });
      } else res.send({ status: false });
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      error: "unauthorized :invalid token",
    });
  }
};
const navuser = (req, res) => {
  console.log("00");
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // if(!token) {
    //   return res.send('/login')
    // }
    jwt.verify(token, "qwertyuiotuyutreewfq", (err, decoded) => {
      if (decoded == 1) res.redirect("/manager");
      else if (decoded == 2) res.redirect("/vp");
      else if (decoded == 3) res.redirect("/admin");
      else if (decoded == 4) res.redirect("/request/track");
      else res.redirect("/login");
    });
  } catch (err) {
    console.log(err);
  }
};
let getLogout = (req, res) => {
  req.session.loggedin = false;
  req.session.username = null;
  req.session.role = null;
  res.redirect("/login");
};

module.exports = {
  getLoginPage,
  postLogin,
  getLogout,
  protect,
  checkuserrole,
  checkuserrole2,
  navuser,
};
