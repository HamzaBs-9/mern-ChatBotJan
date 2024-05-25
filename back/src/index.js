const app = require("./app.js");
const { connectToDatabase } = require("./db/connection.js");

//connections and listeners
const PORT = process.env.PORT || 5005;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log("Server Open & Connected To Database 🤟")
    );
  })
  .catch((err) => console.log(err));
