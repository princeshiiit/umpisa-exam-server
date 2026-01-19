import vine from '@vinejs/vine'

/**
 * Validator for creating a new user
 */
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(255),
    roleId: vine.number().positive().optional(),
  })
)

/**
 * Validator for updating an existing user
 */
export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().normalizeEmail().optional(),
    password: vine.string().minLength(8).maxLength(255).optional(),
    roleId: vine.number().positive().optional(),
  })
)

/**
 * Validator for user query parameters
 */
export const userQueryValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(100).optional(),
    search: vine.string().trim().optional(),
  })
)

