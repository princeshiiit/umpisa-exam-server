import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    // First, ensure the admin role exists and get it
    const adminRole = await Role.findBy('role', 'admin')

    if (!adminRole) {
      throw new Error('Admin role not found. Please run the role seeder first.')
    }

    // Create or update the admin user
    await User.updateOrCreate(
      { email: 'admin@umpisa.com' },
      {
        email: 'admin@umpisa.com',
        password: 'Test@123',
        fullName: 'Admin User',
        isActive: true,
        roleId: adminRole.id,
      }
    )
  }
}
