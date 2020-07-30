import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import querystring from 'querystring';

export default async function (req: NowRequest, res: NowResponse) {
  const { id } = req.body;
  const url = `https://api.spotify.com/v1/audio-analysis/${id}`;
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
  };
    // Gimme
    const response = await axios.post(url, querystring.stringify(data), options);
    return res.send(response.data);
  }
};  