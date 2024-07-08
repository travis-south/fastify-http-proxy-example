declare module 'fastify-http-proxy' {
  import { FastifyPluginCallback } from 'fastify';

  interface FastifyHttpProxyOptions {
    upstream: string;
    prefix?: string;
    rewritePrefix?: string;
    // Add any other options you need
  }

  const fastifyHttpProxy: FastifyPluginCallback<FastifyHttpProxyOptions>;
  export default fastifyHttpProxy;
}
