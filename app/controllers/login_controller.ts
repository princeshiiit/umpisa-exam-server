import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class LoginController {
  /**
   * @handle
   * @summary User login
   * @description Authenticate a user with email and password. Returns user details with role information if credentials are valid.
   * @requestBody { "email": "admin@umpisa.com", "password": "Test@123" } - @type(object) @required
   * @response 200 - { "message": "Login successful", "data": { "id": 1, "email": "admin@example.com", "fullName": "Admin User", "roleId": 1, "isActive": true, "createdAt": "2024-01-15T10:30:00.000Z", "updatedAt": "2024-01-20T14:45:00.000Z", "role": { "id": 1, "name": "admin" } } }
   * @response 401 - { "message": "Invalid credentials" }
   * @response 403 - { "message": "Account is deactivated" }
   * @response 422 - { "errors": [{ "field": "email", "message": "The email field is required", "rule": "required" }] }
   * @response 500 - { "message": "Internal server error" }
   */
  async handle({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.query().where('email', email).preload('role').first()

    if (!user) {
      return response.unauthorized({
        message: 'Invalid credentials',
      })
    }

    if (!user.isActive) {
      return response.status(403).send({
        message: 'Account is deactivated',
      })
    }

    const isPasswordValid = await hash.use('scrypt').verify(user.password, password)

    if (!isPasswordValid) {
      return response.unauthorized({
        message: 'Invalid credentials',
      })
    }

    const token = await User.accessTokens.create(user)

    return response.ok({
      message: 'Login successful',
      data: {
        user,
        token: {
          type: 'Bearer',
          value: token.value!.release(),
        },
      },
    })
  }
}
