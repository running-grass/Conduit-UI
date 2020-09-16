import { ConduitSDK } from '../../index';
import { NextFunction, Request, Response } from 'express';

export abstract class IConduitSecurity {

  constructor(conduit: ConduitSDK) {
  }

  abstract clientMiddleware(req: Request, res: Response, next: NextFunction): void;
}