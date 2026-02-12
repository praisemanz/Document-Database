import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("--- Starting CRUD Operations ---");

    // 0. CLEANUP: Delete existing test users if they exist
    await prisma.USER.deleteMany({
        where: {
            OR: [
                { username: 'student_tester' },
                { username: 'teacher_tester' },
                { email: 'test@okstate.edu' },
                { email: 'hello@uni.edu' }
            ]
        }
    });
    console.log('CLEANUP: Removed any existing test users');

    // 1. CREATE: Adding a new user object
    const newUser = await prisma.USER.create({
        data: {
            username: 'student_tester',
            password_hash: 'secure_hash_123',
            email: 'test@okstate.edu',
            first_name: 'Emmanuel',
            last_name: 'Rekeraho',
            phone_number: '555-0123',
            last_login_date: new Date(), // Set to current date to avoid invalid '0000-00-00' default
        },
    });
    const secondUser = await prisma.USER.create({
        data: {
            username: 'teacher_tester',
            password_hash: 'secure_hash_134',
            email: 'hello@uni.edu',
            first_name: 'Praise',
            last_name: 'Manzi',
            phone_number: '555-0123',
            last_login_date: new Date(), // Set to current date to avoid invalid '0000-00-00' default
        },
    });
    console.log('CREATE SUCCESS:', newUser);

    // 2. READ: Finding the user we just created
    const user = await prisma.USER.findUnique({
        where: { email: 'test@okstate.edu' },
    });
    console.log('READ SUCCESS:', user);

    // 3. UPDATE: Changing a property on the object
    const updatedUser = await prisma.USER.update({
        where: { email: 'test@okstate.edu' },
        data: { phone_number: '999-9999' },
    });
    console.log('UPDATE SUCCESS:', updatedUser);

    // 4. DELETE: Removing the object from the database
    // Note: Comment this out if you want to see the data in phpMyAdmin first!

    const deletedUser = await prisma.USER.delete({
        where: { email: 'test@okstate.edu' },
    });
    console.log('DELETE SUCCESS:', deletedUser);

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });