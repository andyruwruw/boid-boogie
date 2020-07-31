import { NowRequest, NowResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const generateToken = (data, expires) => jwt.sign(data, process.env.SERVER_SECRET, { expiresIn: expires });

export default async function (req: NowRequest, res: NowResponse) {
    const token = generateToken({}, '0');
    res.setHeader('Set-Cookie', [`boidboog-token=${token}; SameSite=Strict`]);
    return res.send({});
  }
};  