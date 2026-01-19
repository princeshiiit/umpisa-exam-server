import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'


export default class RegeneratePasswordController {
  /**
   * @handle
   * @summary Regenerate user password
   * @description Generates a new random password for a user. The new password is returned only once and cannot be retrieved again. Requires admin authentication.
   * @paramPath id - User ID - @type(number) @required
   * @response 200 - { "message": "Password regenerated successfully", "data": { "newPassword": "Abc123!@#Xyz", "email": "user@example.com", "fullName": "John Doe" } }
   * @response 401 - { "message": "Unauthorized - Authentication required" }
   * @response 403 - { "message": "Forbidden - Admin access required" }
   * @response 404 - { "message": "User not found" }
   * @response 500 - { "message": "Internal server error" }
   */
  /**
   * Generate a secure random password
   */
  private generateSecurePassword(): string {
    const length = 16
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const special = '@#$%&*'
    const allChars = uppercase + lowercase + numbers + special

    const required = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      special[Math.floor(Math.random() * special.length)],
    ]

    const remaining = []
    for (let i = 0; i < length - required.length; i++) {
      remaining.push(allChars[Math.floor(Math.random() * allChars.length)])
    }

    const passwordArray = [...required, ...remaining]
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]
    }

    return passwordArray.join('')
  }

  async handle({ params, response }: HttpContext) {
    try {
      const userId = params.id
      const user = await User.find(userId)

      if (!user) {
        return response.notFound({
          message: 'User not found',
        })
      }

      const newPassword = this.generateSecurePassword()

      user.password = newPassword
      await user.save()

      return response.ok({
        message: 'Password regenerated successfully',
        data: {
          newPassword,
          email: user.email,
          fullName: user.fullName,
        },
      })
    } catch (error) {
      console.error('Error regenerating password:', error)
      return response.internalServerError({
        message: 'Failed to regenerate password',
      })
    }
  }
}
