import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import querystring from 'querystring';

/**
 * Get Redirect URL
 * Returns URL for Spotify Auth Callback.
 * @param {String} sender Service sending request.
 */
const getRedirectUrl = () => {
  switch (process.env.NODE_ENV) {
    case 'production': {
      return 'https://boidboogie.com/redirect';
    }
    default: {
      return 'http://localhost:3000/redirect';
    }
  }
};

export default async function (req: NowRequest, res: NowResponse) {
  const { code, state } = req.body;
  console.log(req.body);
  if (code && state && state === process.env.SERVER_STATE) {
    const url = 'https://accounts.spotify.com/api/token';
    const data = {
      code,
      redirect_uri: getRedirectUrl(),
      grant_type: 'authorization_code',
    };
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
    };
    // Gimme
    const response = await axios.post(url, querystring.stringify(data), options);
    return res.send(response.data);
  }
};  