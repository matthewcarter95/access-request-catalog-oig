const defaultAuthConfig = {
  authorizationParams: {
    scope: 'openid profile email',
  },
};

const config = {
  auth: {
    ...defaultAuthConfig,
    issuer: 'https://zt.demo-connect.us/oauth2/ausvd838llYQqpSg1697',
    clientId: '0oavdgbu0h2v7Pbfh697',
    // audience: ['api://default'],
  },
  app: {
    enableSilentAuth: true,
    port: 3000,
  },
  server: {
    permissions: ['AuthRocks'],
  },
};

export default config;
