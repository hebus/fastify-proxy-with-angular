# Remplacer le proxy server d'Angular en NodeJS

Le but était au départ d'utiliser un proxy personnalisée pour l'API : `xdownload`.

Plutôt que d'utiliser **Express**, j'ai opté pour **Fastify** qui semblait plus rapide a mettre en oeuvre.

## Lancer le serveur
```
node server.js
```
ou en mode `watch`
```
node --watch server.js
```
Le serveur est à l'écoute sur le port : 3000

## Configurer la SBA

Il faut configurer l'application SBA pour qu'elle utilise ce proxy plutot que le proxy standard

```ts
// Initialization of @sinequa/core
export const startConfig: StartConfig = {
    app: "training",
    url: "http://localhost:3000",
    production: environment.production,
    // autoSAMLProvider: environment.autoSAMLProvider,
    auditEnabled: true
};
```

# Exemple d'utilisation de Fastify
https://www.fastify.io/

Exemple de seveur simple

```js
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
```

Pour lancer le serveur
```
node server
```

# Comment configurer le proxy Angular pour fonctionner avec ce proxy
Peut être utile si on souhaite proxifier l'API **/xdownload** pour retourner un fichier spécifique.

Exemple de configuration du proxy Angular :
```json
{
    "/api": {
      "target": "http://localhost",
      "secure": false,
      "changeOrigin": true
    },
    "/xdownload": {
        "target": "http://localhost:3000",
        "secure": false,
        "changeOrigin": true
    },
    "/saml/redirect": {
        "target": "http://localhost",
        "secure": false,
        "changeOrigin": true
    }
}
```
Configuration alternative avec des `context`
```json
[
    {
        "context": [
            "/api", "/saml/redirect", "/auth/redirect"
        ],
        "target": "http://localhost",
        "secure": true,
        "changeOrigin": true
    },
    {
        "context": ["/xdownload"],
        "target": "http://localhost:3000",
        "secure": false,
        "changeOrigin": false
    }
]
```
Toutes les réquêtes **/xdownload** seront routées vers ce proxy.

> **NOTE**\
voir le texte en commentaire dans le fichier **server.js** pour savoir comment servir un fichier local à la place.

