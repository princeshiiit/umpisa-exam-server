import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class RetrieveUsersController {
  /**
   * @handle
   * @summary Retrieve all users with pagination
   * @description Get a paginated list of all active users with their roles. Supports optional name filter for specific user lookup (case-insensitive).
   * @paramQuery search - Filter by user full name (case-insensitive, optional) - @type(string)
   * @paramQuery page - Page number for pagination (default: 1) - @type(number)
   * @paramQuery limit - Number of items per page (default: 10, max: 100) - @type(number)
   * @response 200 - { "data": [{ "id": 1, "email": "admin@example.com", "fullName": "Admin User", "roleId": 1, "isActive": true, "createdAt": "2024-01-15T10:30:00.000Z", "updatedAt": "2024-01-20T14:45:00.000Z", "role": { "id": 1, "name": "admin" } }], "meta": { "total": 25, "perPage": 10, "currentPage": 1, "lastPage": 3, "firstPage": 1, "firstPageUrl": "/?page=1", "lastPageUrl": "/?page=3", "nextPageUrl": "/?page=2", "previousPageUrl": null } }
   * @response 401 - { "message": "Unauthorized - Authentication required" }
   * @response 403 - { "message": "Forbidden - Insufficient permissions" }
   * @response 404 - { "message": "User not found" }
   * @response 500 - { "message": "Internal server error" }
   */
  async handle({ request, response }: HttpContext) {
    const search = request.input('search')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    let query = User.query().preload('role')

    // If search is provided, filter users by full name or parts of it (case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase()
      query = query.where((subQuery) => {
        // Search in full name
        subQuery.whereRaw('LOWER(full_name) LIKE ?', [`%${searchLower}%`])
        
        // Also search if it matches first word (first name)
        subQuery.orWhereRaw('LOWER(full_name) LIKE ?', [`${searchLower}%`])
        
        // Also search if it matches last word (last name)
        subQuery.orWhereRaw('LOWER(full_name) LIKE ?', [`% ${searchLower}%`])
      })
    }

    const users = await query.paginate(page, limit)

    return response.ok({
      data: users.all(),
      meta: users.getMeta(),
    })
  }
}
