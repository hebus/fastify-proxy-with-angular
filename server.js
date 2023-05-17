const Fastify = require('fastify')

const fastify = Fastify({ logger: true, rewriteUrl: (req) => { console.log("url", req.url); return req.url } })


const fs = require('fs')
const baseAPI = "/api"
const baseURL = "http://host.docker.internal"

fastify.register(require("@fastify/cors"), (instance) => {
  return (req, callback) => {
    const corsOptions = {
      origin: true
    }

    if (/^localhost$/m.test(req.headers.origin)) [
      corsOptions.origin = false
    ]

    console.log("cors", corsOptions);
    callback(null, corsOptions)
  }

})

fastify.register(require('@fastify/http-proxy'), {
  upstream: `${baseURL}${baseAPI}`,
  // port: 13343,
  prefix: '/api', // optional
  http2: false, // optional
  replyOptions: {
    onResponse: (req, reply, res) => {
      // reply.header('Access-Control-Allow-Origin', 'https://localhost:4200')
      reply.send(res)
    }
  }
})

const FAKE_XDOWNLOAD = false;

fastify.register(require('@fastify/http-proxy'), {
  // utiliser cette version avec une version compilée de vanilla-search
  // upstream: `https://localhost:4200/xdownload`,

  // utiliser cette version avec une version dev de vanilla- search
  upstream: FAKE_XDOWNLOAD
    ? `${baseURL}/xdownload/:id`
    : `${baseURL}/xdownload`,

  // upstream: `${baseURL}/xdownload`,
  prefix: 'xdownload', // optional
  // undici: false,
  http2: false, // optional
  replyOptions: {
    onResponse: (req, reply, res) => {
      if (FAKE_XDOWNLOAD) {
        reply.header('Content-Type', 'text/html');
        reply.statusCode = 200;
        // reply.send("hello world");
        fs.readFile('static/index.html', (err, filebuffer) => {
          reply.send(err || filebuffer);
        })
      } else {
        reply.send(res);
      }
    }
  }
})



fastify.register(require('@fastify/http-proxy'), {
  upstream: `${baseURL}/saml/redirect`,
  prefix: '/saml/redirect', // optional
  http2: false, // optional

  // replyOptions: {
  //   rewriteHeaders: (originalRequest, headers) => {
  //     return {
  //       ...headers
  //     }
  //   },
  //   onResponse: (req, reply, res) => {
  //     // handle redirects
  //     console.log("ici",res.headers)
  //     if ([301, 302, 303, 307].includes(res.statusCode)) {
  //       let i = res.rawHeaders.indexOf('Location')
  //       if (i > -1) {
  //         let location = res.rawHeaders[i + 1];
  //         reply.redirect(location)
  //       }
  //       reply.redirect("https://localhost:4200")
  //     } else {
  //       reply.send(res)
  //     }
  //   }
  // }
})

fastify.get('/download', (request, reply) => {
  const stream = fs.createReadStream('static/index.html', 'utf8')
    reply.header('Content-Type', 'text/html')
    reply.send(stream)
  }
)

fastify.get('/test', (req, reply) => {
  reply.status = 200;
  reply.send("bonjour")
})

fastify.listen({
  port: 3000,
  host: '0.0.0.0',
  callback: (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
})