require('dotenv').config();
import { registerAs } from '@nestjs/config';

const localServers = [
  {
    url: `http://localhost:${process.env.APP_PORT || '3001'}`,
    description: 'Nong San server',
  },
];
const devServers = [
  {
    description: 'Nong San server',
  },
];

const prodServers = [];

const getServers = () => {
  if (process.env.APP_ENV === 'production') return prodServers;
  if (['development', 'staging'].includes(process.env.APP_ENV)) return devServers;
  return localServers;
};

export default registerAs('app', () => ({
  port: process.env.APP_PORT || 8080,
  env: process.env.NODE_ENV || 'development',
  prefix: process.env.APP_PREFIX || 'nong-san',
  name: process.env.APP_NAME || 'nong-san',
  swagger: {
    servers: getServers(),
  },
  auth: {
    jwtSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'nong-san-secret',
    jwtTokenExpiry: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) || 86400,
  },
}));
