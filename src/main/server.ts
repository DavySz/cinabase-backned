import express from "express";
import { makeSignUpControllerFactory } from "./factories/controllers/sign-up/sign-up.factory";

const app = express();
app.use(express.json());

app.post("/sign-up", (req, res) =>
  makeSignUpControllerFactory().handle(req, res)
);

app.listen(3000);
