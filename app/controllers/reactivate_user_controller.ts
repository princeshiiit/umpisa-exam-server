import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class ReactivateUserController {
  /**
   * @handle
   * @summary Reactivate a user
   * @description Reactivate a deactivated user by setting is_active to true. Only admin users can perform this action.
   * @paramPath id - User ID - @type(number) @required
   * @response 200 - { "message": "User reactivated successfully", "data": { "id": 5, "email": "user@example.com", "fullName": "Jane Smith", "roleId": 2, "isActive": true, "createdAt": "2024-01-25T08:15:00.000Z", "updatedAt": "2024-01-25T11:00:00.000Z", "role": { "id": 2, "name": "user" } } }
   * @response 400 - { "message": "User is already active" }
   * @response 401 - { "message": "Unauthorized - Authentication required" }
   * @response 403 - { "message": "Forbidden - Admin access required" }
   * @response 404 - { "message": "User not found" }
   * @response 500 - { "message": "Internal server error" }
   */
  async handle({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: 'User not found',
      })
    }

    if (user.isActive) {
      return response.badRequest({
        message: 'User is already active',
      })
    }

    user.isActive = true
    await user.save()

    if (user.roleId) {
      await user.load('role')
    }

    return response.ok({
      message: 'User reactivated successfully',
      data: user,
    })
  }
}
