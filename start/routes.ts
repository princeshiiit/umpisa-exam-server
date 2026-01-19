/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import swagger from '../swagger.js'
import { appEnvironment } from '#config/app'
import AutoSwagger from 'adonis-autoswagger'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Swagger Routes
const disabledEnvironments = ['']

if (!disabledEnvironments.includes(appEnvironment)) {
  console.log('Swagger UI is enabled at /docs')
  router.get('/swagger', async () => {
    return AutoSwagger.default.docs(router.toJSON(), swagger)
  })
  router.get('/docs', async () => {
    return AutoSwagger.default.ui('/swagger', swagger)
    // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead
    // return AutoSwagger.default.rapidoc("/swagger", "view"); //to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
  })
}

// API Routes
router
  .group(() => {
    // Authentication routes
    router.post('/login', '#controllers/login_controller.handle')

    // User management routes
    router.get('/users', '#controllers/retrieve_users_controller.handle')
    router.post('/users', '#controllers/create_user_controller.handle')
    router.put('/users/:id', '#controllers/update_userinfo_controller.handle')
    router.patch('/users/:id/deactivate', '#controllers/deactivate_user_controller.handle')
  })
  .prefix('/api')
