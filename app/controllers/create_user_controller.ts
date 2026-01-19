import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'

export default class CreateUserController {
  /**
   * @handle
   * @summary Create a new user
   * @description Register a new user in the system with email, password, and optional full name. Requires admin authentication.
   * @requestBody { "email": "newuser@example.com", "password": "SecurePass123", "fullName": "Jane Smith", "roleId": 2 } - @type(object) @required
   * @response 201 - { "message": "User created successfully", "data": { "id": 5, "email": "newuser@example.com", "fullName": "Jane Smith", "roleId": 2, "isActive": true, "createdAt": "2024-01-25T08:15:00.000Z", "updatedAt": "2024-01-25T08:15:00.000Z", "role": { "id": 2, "name": "user" } } }
   * @response 400 - { "message": "Bad request - Invalid input data" }
   * @response 401 - { "message": "Unauthorized - Authentication required" }
   * @response 403 - { "message": "Forbidden - Admin access required" }
   * @response 422 - { "errors": [{ "field": "email", "message": "The email field must be a valid email address", "rule": "email" }] }
   * @response 500 - { "message": "Internal server error" }
   */
  async handle({ request, response }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)

    const user = await User.create({
      ...data,
      isActive: true,
    })

    // Load role relationship
    await user.load('role')

    return response.created({
      message: 'User created successfully',
      data: user,
    })
  }
}
