import { NowRequest, NowResponse } from '@vercel/node';
import querystring from 'querystring';

import { getRedirectUrl } from '../util/auth';

export default async function (req: NowRequest, res: NowResponse) {
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
  ];
  return res.send(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes.join('%20'),
    redirect_uri: getRedirectUrl(),
    state: process.env.SERVER_STATE,
    show_dialog: 'false',
  })}`);
};  