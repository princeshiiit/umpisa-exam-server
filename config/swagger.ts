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
  swagger: true,
  info: {
    title: 'UMPISA Exam Server API',
    version: '1.0.0',
    description: 'Node.js server application for UMPISA exam management system',
  },
  snakeCase: true,

  debug: true,
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
  showFullPath: true,
}
