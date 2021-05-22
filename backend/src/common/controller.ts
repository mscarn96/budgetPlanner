import { Router } from "express";

abstract class Controller {
  abstract path: string;
  abstract router: Router;
}

export default Controller;
