import * as express from "express";

export function tokenValidator(token : string) {
  return function(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.header("X-Gitlab-Token") != token) {
      res.status(401).send("Token validation failed");
    }
    next();
  }
}

