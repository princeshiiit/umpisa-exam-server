import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator, userQueryValidator } from '#validators/user'

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a paginated list of users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by email or full name
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     lastPage:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
export default class UsersController {
  /**
   * Get all users with pagination and search
   */
  async index({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 10, search } = await request.validateUsing(userQueryValidator)

      const query = User.query().select('id', 'fullName', 'email', 'createdAt', 'updatedAt')

      if (search) {
        query.where((builder) => {
          builder.whereILike('email', `%${search}%`).orWhereILike('fullName', `%${search}%`)
        })
      }

      const users = await query.orderBy('createdAt', 'desc').paginate(page, limit)

      return response.ok(users.toJSON())
    } catch (error) {
      return response.badRequest({ message: 'Failed to fetch users', error: error.messages || error.message })
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get a user by ID
   *     description: Retrieve a single user by their ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   */
  async show({ params, response }: HttpContext) {
    try {
      const user = await User.query()
        .select('id', 'fullName', 'email', 'createdAt', 'updatedAt')
        .where('id', params.id)
        .firstOrFail()

      return response.ok(user)
    } catch (error) {
      return response.notFound({ message: 'User not found' })
    }
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     tags:
   *       - Users
   *     summary: Create a new user
   *     description: Create a new user account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               fullName:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 example: password123
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Validation error
   *       422:
   *         description: Email already exists
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createUserValidator)

      // Check if email already exists
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        return response.unprocessableEntity({ message: 'Email already exists' })
      }

      const user = await User.create(data)

      return response.created({
        message: 'User created successfully',
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    } catch (error) {
      return response.badRequest({ message: 'Failed to create user', error: error.messages || error.message })
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     tags:
   *       - Users
   *     summary: Update a user
   *     description: Update an existing user's information
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fullName:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 example: newpassword123
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   *       422:
   *         description: Email already exists
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const data = await request.validateUsing(updateUserValidator)

      // Check if email is being changed and if it already exists
      if (data.email && data.email !== user.email) {
        const existingUser = await User.findBy('email', data.email)
        if (existingUser) {
          return response.unprocessableEntity({ message: 'Email already exists' })
        }
      }

      user.merge(data)
      await user.save()

      return response.ok({
        message: 'User updated successfully',
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'User not found' })
      }
      return response.badRequest({ message: 'Failed to update user', error: error.messages || error.message })
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     tags:
   *       - Users
   *     summary: Delete a user
   *     description: Delete a user by their ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.ok({ message: 'User deleted successfully' })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'User not found' })
      }
      return response.badRequest({ message: 'Failed to delete user', error: error.message })
    }
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fullName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
