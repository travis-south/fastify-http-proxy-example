import Fastify, { FastifyInstance } from 'fastify'
import {
  createProxyMiddleware,
  responseInterceptor,
} from 'http-proxy-middleware'

const server: FastifyInstance = Fastify({
  logger: true,
})

const apiProxy = createProxyMiddleware({
  target: 'https://www.8811188.net/',
  changeOrigin: true,
  followRedirects: false,
  selfHandleResponse: true,
  on: {
    proxyReq: (proxyReq, req) => {
      proxyReq.setHeader(
        'User-Agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3 MSite',
      )
      proxyReq.setHeader('Origin', 'https://www.8811188.net')
      proxyReq.setHeader(
        'Referer',
        'https://www.8811188.net/msite/Maintenance/',
      )
    },
    proxyRes: responseInterceptor(
      async (responseBuffer, _proxyRes, _req, res) => {
        const contentType = res.getHeader('content-type')
        if (contentType && contentType.toString().includes('text/html')) {
          const response = responseBuffer.toString('utf8')
          return response.replace(
            '<base href="https://www.8811188.net/msite/Maintenance/">',
            '',
          )
        }
        return responseBuffer
      },
    ),
  },
})

server.all('/msite/action.php', (req, reply) => {
  apiProxy(req.raw, reply.raw, (err) => {
    if (err) {
      reply.send(err)
    }
  })
})

server.all('/*', (req, reply) => {
  const requestPath = req.raw.url
  if (requestPath?.match(/\.(css|js|png|jpg|gif|svg)$/)) {
    apiProxy(req.raw, reply.raw, (err) => {
      if (err) {
        reply.send(err)
      }
    })
  } else if (requestPath !== '/msite/Maintenance/') {
    reply.redirect('/msite/Maintenance/')
  } else {
    apiProxy(req.raw, reply.raw, (err) => {
      if (err) {
        reply.send(err)
      }
    })
  }
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
