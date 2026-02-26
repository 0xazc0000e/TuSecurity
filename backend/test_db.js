require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRegister() {
    console.log('Testing User Creation...');
    const testEmail = `test_${Date.now()}@test.com`;
    try {
        const user = await prisma.users.create({
            data: {
                full_name: 'Test User',
                username: `testuser_${Date.now()}`,
                email: testEmail,
                password_hash: 'hashed_password',
                is_verified: true
            }
        });
        console.log('✅ User created:', user.id);

        // Clean up
        await prisma.users.delete({ where: { id: user.id } });
        console.log('✅ User deleted');
    } catch (error) {
        console.error('❌ Registration failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testRegister();
