/**
 * CRUD Operations Demo for Document Statement System
 * This file demonstrates full CRUD operations on the User table using Prisma ORM
 * 
 * Run this file: npm run test:crud
 */

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable query logging to see SQL
});

// Helper function to hash passwords (simple demo - use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper function to display user data
function displayUser(user) {
  console.log('\n' + '='.repeat(80));
  console.log('USER RECORD:');
  console.log('='.repeat(80));
  console.log(`ID:               ${user.userId}`);
  console.log(`Username:         ${user.username}`);
  console.log(`Email:            ${user.email}`);
  console.log(`Name:             ${user.firstName} ${user.lastName}`);
  console.log(`Phone:            ${user.phoneNumber || 'N/A'}`);
  console.log(`Active:           ${user.isActive}`);
  console.log(`Registration:     ${user.registrationDate.toISOString()}`);
  console.log(`Last Login:       ${user.lastLoginDate?.toISOString() || 'Never'}`);
  console.log('='.repeat(80));
}

// Helper function to display all users
function displayAllUsers(users) {
  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL USERS: ${users.length}`);
  console.log('='.repeat(80));
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username} (${user.email}) - Active: ${user.isActive}`);
  });
  console.log('='.repeat(80));
}

async function main() {
  console.log('\n\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                   CRUD OPERATIONS DEMONSTRATION                           ║');
  console.log('║            Document Statement System - User Table                         ║');
  console.log('║                      Using Prisma ORM                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  try {
    // ========================================================================
    // STEP 1: READ - Show initial state of database
    // ========================================================================
    console.log('\n📖 STEP 1: READ - Fetching all existing users from database');
    console.log('-'.repeat(80));
    
    const initialUsers = await prisma.user.findMany({
      orderBy: {
        registrationDate: 'desc'
      }
    });
    
    displayAllUsers(initialUsers);
    console.log('✅ Successfully fetched all users using Prisma ORM');
    console.log(`   Query: prisma.user.findMany()`);

    // ========================================================================
    // STEP 2: CREATE - Insert new user
    // ========================================================================
    console.log('\n\n➕ STEP 2: CREATE - Adding a new user to database');
    console.log('-'.repeat(80));
    
    const newUserData = {
      username: `testuser_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '555-1234',
      passwordHash: hashPassword('SecurePassword123!'),
      securityQuestion: 'What is your favorite color?',
      securityAnswerHash: hashPassword('blue')
    };

    console.log('Creating user with data:');
    console.log(`  Username: ${newUserData.username}`);
    console.log(`  Email: ${newUserData.email}`);
    console.log(`  Name: ${newUserData.firstName} ${newUserData.lastName}`);
    console.log(`  Phone: ${newUserData.phoneNumber}`);

    const createdUser = await prisma.user.create({
      data: newUserData
    });

    displayUser(createdUser);
    console.log('✅ Successfully created new user using Prisma ORM');
    console.log(`   Query: prisma.user.create({ data: { ... } })`);
    console.log(`   Generated UUID: ${createdUser.userId}`);

    // ========================================================================
    // STEP 3: READ - Fetch single user by ID
    // ========================================================================
    console.log('\n\n🔍 STEP 3: READ - Fetching single user by ID');
    console.log('-'.repeat(80));
    
    console.log(`Fetching user with ID: ${createdUser.userId}`);

    const fetchedUser = await prisma.user.findUnique({
      where: {
        userId: createdUser.userId
      }
    });

    displayUser(fetchedUser);
    console.log('✅ Successfully fetched user by ID using Prisma ORM');
    console.log(`   Query: prisma.user.findUnique({ where: { userId: '${createdUser.userId}' } })`);

    // ========================================================================
    // STEP 4: READ - Query with filters
    // ========================================================================
    console.log('\n\n🔎 STEP 4: READ - Querying users with filters');
    console.log('-'.repeat(80));
    
    console.log('Filter: Active users with phone numbers');

    const activeUsersWithPhone = await prisma.user.findMany({
      where: {
        isActive: true,
        phoneNumber: {
          not: null
        }
      },
      select: {
        userId: true,
        username: true,
        email: true,
        phoneNumber: true,
        isActive: true
      }
    });

    console.log(`\nFound ${activeUsersWithPhone.length} active users with phone numbers:`);
    activeUsersWithPhone.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username} - ${user.phoneNumber}`);
    });
    console.log('✅ Successfully queried users with filters');
    console.log(`   Query: prisma.user.findMany({ where: { isActive: true, phoneNumber: { not: null } } })`);

    // ========================================================================
    // STEP 5: UPDATE - Modify existing user
    // ========================================================================
    console.log('\n\n✏️  STEP 5: UPDATE - Updating user information');
    console.log('-'.repeat(80));
    
    console.log(`Updating user: ${createdUser.username}`);
    console.log('Changes:');
    console.log('  - First Name: John → Jane');
    console.log('  - Phone: 555-1234 → 555-9999');
    console.log('  - Last Login: null → now');

    const updatedUser = await prisma.user.update({
      where: {
        userId: createdUser.userId
      },
      data: {
        firstName: 'Jane',
        phoneNumber: '555-9999',
        lastLoginDate: new Date()
      }
    });

    displayUser(updatedUser);
    console.log('✅ Successfully updated user using Prisma ORM');
    console.log(`   Query: prisma.user.update({ where: { userId: '...' }, data: { ... } })`);

    // ========================================================================
    // STEP 6: UPDATE - Update multiple records
    // ========================================================================
    console.log('\n\n✏️  STEP 6: UPDATE - Batch update (updating multiple records)');
    console.log('-'.repeat(80));
    
    console.log('Updating all users who never logged in (setting lastLoginDate to now)');

    const batchUpdateResult = await prisma.user.updateMany({
      where: {
        lastLoginDate: null
      },
      data: {
        lastLoginDate: new Date()
      }
    });

    console.log(`\n✅ Updated ${batchUpdateResult.count} users`);
    console.log(`   Query: prisma.user.updateMany({ where: { lastLoginDate: null }, data: { ... } })`);

    // ========================================================================
    // STEP 7: READ - Complex query with relations
    // ========================================================================
    console.log('\n\n🔗 STEP 7: READ - Fetching user with related data (joins)');
    console.log('-'.repeat(80));
    
    console.log(`Fetching user ${updatedUser.username} with all related records`);

    const userWithRelations = await prisma.user.findUnique({
      where: {
        userId: updatedUser.userId
      },
      include: {
        userAccounts: {
          include: {
            account: {
              include: {
                client: true
              }
            }
          }
        },
        notifications: {
          take: 5,
          orderBy: {
            sentDate: 'desc'
          }
        },
        sessions: {
          where: {
            isActive: true
          }
        },
        notificationPreference: true
      }
    });

    console.log('\nUser with related data:');
    console.log(`  Username: ${userWithRelations.username}`);
    console.log(`  Linked Accounts: ${userWithRelations.userAccounts.length}`);
    console.log(`  Notifications: ${userWithRelations.notifications.length}`);
    console.log(`  Active Sessions: ${userWithRelations.sessions.length}`);
    console.log(`  Has Notification Preferences: ${userWithRelations.notificationPreference ? 'Yes' : 'No'}`);
    console.log('✅ Successfully fetched user with relations');
    console.log(`   Query: prisma.user.findUnique({ include: { userAccounts: {...}, notifications: {...} } })`);

    // ========================================================================
    // STEP 8: READ - Aggregation queries
    // ========================================================================
    console.log('\n\n📊 STEP 8: READ - Aggregation queries (count, statistics)');
    console.log('-'.repeat(80));
    
    console.log('Calculating user statistics...');

    const userStats = await prisma.user.aggregate({
      _count: {
        userId: true
      },
      where: {
        isActive: true
      }
    });

    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const inactiveUsers = await prisma.user.count({ where: { isActive: false } });

    console.log('\nUser Statistics:');
    console.log(`  Total Users: ${totalUsers}`);
    console.log(`  Active Users: ${activeUsers}`);
    console.log(`  Inactive Users: ${inactiveUsers}`);
    console.log('✅ Successfully calculated statistics');
    console.log(`   Queries: prisma.user.count(), prisma.user.aggregate()`);

    // ========================================================================
    // STEP 9: DELETE - Soft delete (deactivate user)
    // ========================================================================
    console.log('\n\n🚫 STEP 9: UPDATE (Soft Delete) - Deactivating user');
    console.log('-'.repeat(80));
    
    console.log(`Soft deleting user: ${updatedUser.username}`);
    console.log('Setting isActive = false instead of actual deletion');

    const deactivatedUser = await prisma.user.update({
      where: {
        userId: updatedUser.userId
      },
      data: {
        isActive: false
      }
    });

    console.log(`\n✅ User deactivated: ${deactivatedUser.username}`);
    console.log(`   Active status: ${deactivatedUser.isActive}`);
    console.log(`   Query: prisma.user.update({ where: { ... }, data: { isActive: false } })`);

    // ========================================================================
    // STEP 10: DELETE - Hard delete (permanent deletion)
    // ========================================================================
    console.log('\n\n🗑️  STEP 10: DELETE - Permanently deleting user from database');
    console.log('-'.repeat(80));
    
    console.log(`⚠️  WARNING: About to permanently delete user: ${deactivatedUser.username}`);
    console.log('This action cannot be undone!');

    const deletedUser = await prisma.user.delete({
      where: {
        userId: deactivatedUser.userId
      }
    });

    console.log(`\n✅ User permanently deleted: ${deletedUser.username} (${deletedUser.email})`);
    console.log(`   Query: prisma.user.delete({ where: { userId: '${deletedUser.userId}' } })`);

    // ========================================================================
    // STEP 11: READ - Verify deletion
    // ========================================================================
    console.log('\n\n✔️  STEP 11: READ - Verifying user was deleted');
    console.log('-'.repeat(80));
    
    console.log(`Attempting to fetch deleted user with ID: ${deletedUser.userId}`);

    const verifyDeleted = await prisma.user.findUnique({
      where: {
        userId: deletedUser.userId
      }
    });

    if (verifyDeleted === null) {
      console.log('\n✅ Confirmed: User no longer exists in database');
      console.log('   Query returned: null');
    } else {
      console.log('\n❌ ERROR: User still exists in database!');
    }

    // ========================================================================
    // FINAL: Show final state
    // ========================================================================
    console.log('\n\n📊 FINAL STATE: All users in database');
    console.log('-'.repeat(80));
    
    const finalUsers = await prisma.user.findMany({
      orderBy: {
        registrationDate: 'desc'
      }
    });
    
    displayAllUsers(finalUsers);

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('\n\n');
    console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
    console.log('║                        CRUD DEMONSTRATION COMPLETE                        ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════╝');
    console.log('\n✅ Successfully demonstrated all CRUD operations:');
    console.log('   ✓ CREATE - Created new user with prisma.user.create()');
    console.log('   ✓ READ   - Fetched users with findUnique(), findMany(), count(), aggregate()');
    console.log('   ✓ UPDATE - Modified user with update() and updateMany()');
    console.log('   ✓ DELETE - Soft delete (deactivate) and hard delete (permanent removal)');
    console.log('\n✅ All operations used Prisma ORM - NO raw SQL queries');
    console.log('✅ All operations interacted with actual PostgreSQL database');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ ERROR occurred during CRUD operations:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database\n');
  }
}

// Run the demo
main()
  .then(() => {
    console.log('✅ CRUD demonstration completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
