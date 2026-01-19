import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    // Idempotent seeder - uses updateOrCreate to avoid duplicates
    await Role.updateOrCreate(
      { role: 'admin' },
      {
        role: 'admin',
        description:
          'Administrator with full system access and permissions to manage all users, content, and system configurations',
      }
    )

    await Role.updateOrCreate(
      { role: 'user' },
      {
        role: 'user',
        description:
          'Standard user with basic permissions to access and interact with the system features',
      }
    )
  }
}