import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { createProxyMiddleware } from 'http-proxy-middleware';

const server: FastifyInstance = Fastify({
  logger: true,
})

const apiProxy = createProxyMiddleware({
  target: 'https://www.8811188.net/msite/Maintenance',
  changeOrigin: true,
  followRedirects: false,
});

server.all('/*', (req, reply) => {
  apiProxy(req.raw, reply.raw, (err) => {
    if (err) {
      reply.send(err);
    }
  });
});

const start = async () => {
  try {
    await server.listen({ port: 3000 })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
