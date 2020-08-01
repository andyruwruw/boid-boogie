import jwt from 'jsonwebtoken';

/**
 * Get Redirect URL
 * Returns URL for Spotify Auth Callback.
 * @param {String} sender Service sending request.
 */
export const getRedirectUrl = () => {
  switch (process.env.NODE_ENV) {
    case 'production': {
      return 'https://boidboogie.com/redirect';
    }
    default: {
      return 'http://localhost:3000/redirect';
    }
  }
};

/**
 * Generate Token
 * Generates Signed Json Web Token with Data
 * @param data 
 * @param expires
 */
export const generateToken = (data, expires) => jwt.sign(data, process.env.SERVER_SECRET, { expiresIn: expires });