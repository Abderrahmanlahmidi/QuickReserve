import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export type RequestWithUser = Request & {
  user?: JwtPayload;
};
