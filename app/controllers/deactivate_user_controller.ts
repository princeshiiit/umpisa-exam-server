import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class DeactivateUserController {
  /**
   * @handle
   * @summary Deactivate a user
   * @description Soft delete a user by setting is_active to false. The user record is preserved but marked as inactive.
   * @paramPath id - User ID - @type(number) @required
   * @response 200 - { "message": "User deactivated successfully", "data": { "id": 5, "email": "user@example.com", "fullName": "Jane Smith", "roleId": 2, "isActive": false, "createdAt": "2024-01-25T08:15:00.000Z", "updatedAt": "2024-01-25T11:00:00.000Z", "role": { "id": 2, "name": "user" } } }
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

    user.isActive = false
    await user.save()

    // Load role relationship
    await user.load('role')

    return response.ok({
      message: 'User deactivated successfully',
      data: user,
    })
  }
}
