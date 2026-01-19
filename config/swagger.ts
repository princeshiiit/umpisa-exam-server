// for AdonisJS v6
import path from 'node:path'
import url from 'node:url'
// ---

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  title: 'UMPISA Exam Server API',
  version: '1.0.0',
  description: 'Node.js server application for UMPISA exam management system',
  tagIndex: 2,
  // swagger: false, // Don't use manual swagger file, generate from decorators
  info: {
    title: 'UMPISA Exam Server API',
    version: '1.0.0',
    description: 'Node.js server application for UMPISA exam management system',
  },
  snakeCase: true,

  debug: false,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
