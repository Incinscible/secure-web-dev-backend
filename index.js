require("dotenv").config();
const express = require("express");
const locationsController = require("./src/locations/locations.controller");
const usersController = require("./src/users/users.controller");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("./src/authentication/local.strategy");
require("./src/authentication/jwt.strategy");
const passport = require("passport");
const corsAnywhere = require('cors-anywhere');


const app = express();
const port = 3000;



const corsProxy = corsAnywhere.createServer({
  originWhitelist: [], // Permettre toutes les origines
  requireHeader: ['origin', 'x-requested-with'] // Exiger les en-têtes origin et x-requested-with
});

app.use('/', corsProxy);

// Définir vos routes ici

app.listen(3000, () => {
  console.log('Le serveur est en cours d\'exécution sur le port 3000');
});

// Protect all /locations route with JWT Authentication
app.use(
  "/locations",
  passport.authenticate("jwt", { session: false }),
  locationsController
);
app.use("/users", usersController);

app.get("/", (req, res) => res.status(200).json({ message: "Hello World !" }));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo Database");
  app.listen(port, () => {
    console.log(
      `API listening on port ${port}, visit http://localhost:${port}/`
    );
  });
}

main();
