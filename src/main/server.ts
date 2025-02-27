import express from "express";
import mongoose from "mongoose";

import { makeSignUpControllerFactory } from "@main/factories/controllers/sign-up/sign-up.factory";

const app = express();
app.use(express.json());

app.post("/sign-up", (req, res) =>
  makeSignUpControllerFactory().handle(req, res)
);

mongoose
  .connect("mongodb://localhost:27017/database")
  .then(() => {
    app.listen(3000);
  })
  .catch(console.error);
