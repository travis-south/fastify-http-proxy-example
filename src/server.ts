import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import fastifyHttpProxy from '@fastify/http-proxy';

const server: FastifyInstance = Fastify({
  logger: true,
})

// Register the fastify-http-proxy plugin
server.register(fastifyHttpProxy, {
  upstream: 'https://www.8811188.net/msite/Maintenance',
});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

server.get('/ping', opts, async (request, reply) => {
  return { pong: 'it worked!' }
})

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
