import proxy from 'koa-proxies';
import * as dotenv from 'dotenv'
dotenv.config()

export default {
  port: 8000,
  middleware: [
    proxy('/api/generate', {
      target: process.env.target,
      changeOrigin: true,
      logs: true
    }),
  ],
};
