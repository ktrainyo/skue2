const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3011;

app.use(cors());

const apiProxies = {
  '/callstaticrpc': {
    target: 'https://api.callstaticrpc.com',
    changeOrigin: true,
    pathRewrite: {
      '^/callstaticrpc': '', // Remove '/callstaticrpc' prefix
    },
    onProxyReq: (proxyReq, req) => {
      console.log(`[PROXY REQ] URL: ${req.url}`);
      console.log(`[PROXY REQ HEADERS BEFORE]:`, proxyReq.getHeaders());

      const authHeader = req.headers['authorization'];
      if (authHeader) {
        console.log(`[PROXY REQ AUTHORIZATION]: ${authHeader}`);
      } else {
        console.log(`[PROXY REQ AUTHORIZATION]: No Authorization Header Found`);
      }

      if (!proxyReq.getHeader('authorization') && authHeader) {
        proxyReq.setHeader('authorization', authHeader);
      }

      console.log(`[PROXY REQ HEADERS AFTER]:`, proxyReq.getHeaders());
      console.log(`[PROXY REQ FULL URL]: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes) => {
      console.log(`[PROXY RES STATUS]: ${proxyRes.statusCode}`);
    },
  },
  '/solanatracker': {
    target: 'https://api.coingecko.com',
    changeOrigin: true,
    pathRewrite: {
      '^/solanatracker': '', // Remove '/solanatracker' prefix
    },
    onProxyReq: (proxyReq, req) => {
      console.log(`[PROXY REQ] URL: ${req.url}`);
      console.log(`[PROXY REQ HEADERS BEFORE]:`, proxyReq.getHeaders());

      const authHeader = req.headers['authorization'];
      if (authHeader) {
        console.log(`[PROXY REQ AUTHORIZATION]: ${authHeader}`);
      } else {
        console.log(`[PROXY REQ AUTHORIZATION]: No Authorization Header Found`);
      }

      if (!proxyReq.getHeader('authorization') && authHeader) {
        proxyReq.setHeader('authorization', authHeader);
      }

      console.log(`[PROXY REQ HEADERS AFTER]:`, proxyReq.getHeaders());
      console.log(`[PROXY REQ FULL URL]: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes) => {
      console.log(`[PROXY RES STATUS]: ${proxyRes.statusCode}`);
    },
  },
  '/bitquery': {
    target: 'https://graphql.bitquery.io',
    changeOrigin: true,
    pathRewrite: {
      '^/bitquery': '', // Remove '/bitquery' prefix
    },
    onProxyReq: (proxyReq, req) => {
      console.log(`[PROXY REQ] URL: ${req.url}`);
      console.log(`[PROXY REQ HEADERS BEFORE]:`, proxyReq.getHeaders());

      const authHeader = req.headers['authorization'];
      if (authHeader) {
        console.log(`[PROXY REQ AUTHORIZATION]: ${authHeader}`);
      } else {
        console.log(`[PROXY REQ AUTHORIZATION]: No Authorization Header Found`);
      }

      if (!proxyReq.getHeader('authorization') && authHeader) {
        proxyReq.setHeader('authorization', authHeader);
      }

      console.log(`[PROXY REQ HEADERS AFTER]:`, proxyReq.getHeaders());
      console.log(`[PROXY REQ FULL URL]: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes) => {
      console.log(`[PROXY RES STATUS]: ${proxyRes.statusCode}`);
    },
  },
};

Object.entries(apiProxies).forEach(([path, options]) => {
  app.use(path, createProxyMiddleware(options));
});

app.use((err, req, res, next) => {
  console.error(`[PROXY ERROR]:`, err.message);
  res.status(500).send('Proxy Error');
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
