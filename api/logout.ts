import { NowRequest, NowResponse } from '@vercel/node';

import { generateToken } from '../util/auth';

export default async function (req: NowRequest, res: NowResponse) {
  const token = generateToken({}, '0');
  res.setHeader('Set-Cookie', [`boidboog-token=${token}; SameSite=Strict`]);
  return res.send({});
};
