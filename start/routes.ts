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
import { middleware } from './kernel.js'

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
    // Authentication routes (no auth required)
    router.post('/login', '#controllers/login_controller.handle')

    // User management routes (auth required)
    router
      .group(() => {
        router.patch('/users/:id', '#controllers/update_userinfo_controller.handle')
        router.get('/users/retrieve', '#controllers/retrieve_users_controller.handle')
      })
      .use(middleware.auth())

    // Admin only routes
    router
      .group(() => {
        
        router.post('/users', '#controllers/create_user_controller.handle')
        router.delete('/users/:id/deactivate', '#controllers/deactivate_user_controller.handle')
        router.patch('/users/:id/reactivate', '#controllers/reactivate_user_controller.handle')
        router.post('/users/:id/regenerate-password', '#controllers/regenerate_password_controller.handle')
      })
      .use([middleware.auth(), middleware.admin()])
  })
  .prefix('/api')
