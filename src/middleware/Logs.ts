import { Request, NextFunction, Response } from 'express';

function ReqLogs(request: Request, response: Response, next: NextFunction) {
  const { method, url, body } = request;

  console.log(`[${method}] ${url}`);
  console.log(body);

  return next();
}

export default ReqLogs;
