import { JwtPayload as JWTPayload } from 'jsonwebtoken';

export interface JwtPayload extends JWTPayload {
  id: string;
  email: string;
  role: string;
}
