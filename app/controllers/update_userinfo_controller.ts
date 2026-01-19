import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserValidator } from '#validators/user'

export default class UpdateUserinfoController {
  /**
   * @handle
   * @summary Update user information
   * @description Update an existing user's information including email, password, full name, or role. All fields are optional.
   * @paramPath id - User ID - @type(number) @required
   * @requestBody { "email": "updated@example.com", "password": "NewSecurePass123", "fullName": "Jane Doe", "roleId": 1 } - @type(object)
   * @response 200 - { "message": "User updated successfully", "data": { "id": 5, "email": "updated@example.com", "fullName": "Jane Doe", "roleId": 1, "isActive": true, "createdAt": "2024-01-25T08:15:00.000Z", "updatedAt": "2024-01-25T10:30:00.000Z", "role": { "id": 1, "name": "admin" } } }
   * @response 400 - { "message": "Bad request - Invalid input data" }
   * @response 401 - { "message": "Unauthorized - Authentication required" }
   * @response 403 - { "message": "Forbidden - Insufficient permissions" }
   * @response 404 - { "message": "User not found" }
   * @response 422 - { "errors": [{ "field": "email", "message": "The email has already been taken", "rule": "unique" }] }
   * @response 500 - { "message": "Internal server error" }
   */
  async handle({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: 'User not found',
      })
    }

    const data = await request.validateUsing(updateUserValidator)

    user.merge(data)
    await user.save()

    // Load role relationship
    await user.load('role')

    return response.ok({
      message: 'User updated successfully',
      data: user,
    })
  }
}
