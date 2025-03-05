import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { makeSignUpControllerFactory } from "@main/factories/controllers/sign-up/sign-up.factory";
import { getEnvironmentConfig } from "./utils/get-environment";
import { makeSignInControllerFactory } from "./factories/controllers/sign-in/sign-in.factory";

dotenv.config(getEnvironmentConfig(process.argv));

const app = express();
app.use(express.json());

app.post("/sign-up", (req, res) =>
  makeSignUpControllerFactory().handle(req, res)
);

app.post("/sign-in", (req, res) =>
  makeSignInControllerFactory().handle(req, res)
);

mongoose
  .connect(process.env.CINEBASE_DATABASE_URL || "")
  .then(() => {
    app.listen(3000);
  })
  .catch(console.error);
