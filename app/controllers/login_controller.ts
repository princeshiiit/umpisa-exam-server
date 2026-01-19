import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class LoginController {
  /**
   * @handle
   * @summary User login
   * @description Authenticate a user with email and password. Returns user details with role information if credentials are valid.
   * @requestBody { "email": "admin@example.com", "password": "secret123" } - @type(object) @required
   * @response 200 - { "message": "Login successful", "data": { "id": 1, "email": "admin@example.com", "fullName": "Admin User", "roleId": 1, "isActive": true, "createdAt": "2024-01-15T10:30:00.000Z", "updatedAt": "2024-01-20T14:45:00.000Z", "role": { "id": 1, "name": "admin" } } }
   * @response 401 - { "message": "Invalid credentials" }
   * @response 403 - { "message": "Account is deactivated" }
   * @response 422 - { "errors": [{ "field": "email", "message": "The email field is required", "rule": "required" }] }
   * @response 500 - { "message": "Internal server error" }
   */
  async handle({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    // Find user by email
    const user = await User.query().where('email', email).preload('role').first()

    if (!user) {
      return response.unauthorized({
        message: 'Invalid credentials',
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return response.forbidden({
        message: 'Your account has been deactivated',
      })
    }

    // Verify password
    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      return response.unauthorized({
        message: 'Invalid credentials',
      })
    }

    return response.ok({
      message: 'Login successful',
      data: user,
    })
  }
}
