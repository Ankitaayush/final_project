const session = require("express-session");
const express = require("express");
const initAllLoginRoutes = require("./routes/loginRoutes");
const initAllAdminRoutes = require("./routes/adminRoutes");
const initAllItTeamRoutes = require("./routes/itTeamRoutes");
const initAllManagerRoutes = require("./routes/managerRoutes");
const initAllVpRoutes = require("./routes/vpRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
// const cookie_parser = require('cookie-parser')

const app = express();

//config body-parser
// app.use(session({
// 	secret: 'secret',
// 	resave: true,
// 	saveUninitialized: true
// }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//

const allowedOrigin = "http://localhost:3000";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
// init all web routes
// app.use(cookie_parser())

initAllLoginRoutes(app);
initAllAdminRoutes(app);
initAllItTeamRoutes(app);
initAllManagerRoutes(app);
initAllVpRoutes(app);

let port = 5000;

app.listen(port, () => {
  console.log(`App is running at the port ${port}`);
});
