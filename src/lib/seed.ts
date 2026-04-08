import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export async function seedSuperAdmin() {
    const adminEmail = 'kk@gmail.com';
    const adminPassword = 'kk123456';
    const saltRounds = 12; // Defaulting to 12 if config is tricky to import, but could use process.env

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    
    if (existingAdmin) {
        console.log('Admin already exists!');
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const admin = await prisma.user.create({
        data: {
            id: "111", // or use a UUID if your schema expects a string
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN'
        },
    });

    console.log('Admin created successfully:', admin);
}
