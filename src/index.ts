import { app } from "./app";

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    "Server listening to http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
});

