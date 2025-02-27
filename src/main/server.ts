import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { makeSignUpControllerFactory } from "@main/factories/controllers/sign-up/sign-up.factory";
import { getEnvironmentConfig } from "./utils/get-environment";

dotenv.config(getEnvironmentConfig(process.argv));

const app = express();
app.use(express.json());

app.post("/sign-up", (req, res) =>
  makeSignUpControllerFactory().handle(req, res)
);

mongoose
  .connect(process.env.CINEBASE_DATABASE_URL || "")
  .then(() => {
    app.listen(3000);
  })
  .catch(console.error);
