require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
    console.log('--- Database Debug Script ---');
    console.log('Testing connection...');
    try {
        await prisma.$connect();
        console.log('✅ Connected successfully to PostgreSQL');

        console.log('Checking "users" table...');
        const userCount = await prisma.users.count();
        console.log(`✅ "users" table exists. Current count: ${userCount}`);

        console.log('Fetching columns from information_schema...');
        const columns = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `;
        console.log('✅ Columns in "users" table:');
        console.table(columns);

    } catch (error) {
        console.error('❌ Database error detected:');
        console.error(error.message || error);
        if (error.code) console.error(`Error Code: ${error.code}`);
        if (error.meta) console.error('Error Meta:', error.meta);
    } finally {
        await prisma.$disconnect();
    }
}

debug();
