import { randomUUID } from 'crypto';
import { hashPassword } from "better-auth/crypto";
import { prisma } from './prisma';

export async function seedSuperAdmin() {
    const adminEmail = 'kk@gmail.com';
    const adminPassword = 'kk123456';

    const passwordHash = await hashPassword(adminPassword);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        create: {
            id: "111",
            name: 'Admin',
            email: adminEmail,
            password: passwordHash,
            role: 'ADMIN',
        },
        update: {
            name: 'Admin',
            password: passwordHash,
            role: 'ADMIN',
        },
    });

    const existingAccount = await prisma.account.findFirst({
        where: {
            userId: admin.id,
            providerId: 'credential',
        },
    });

    if (existingAccount) {
        await prisma.account.update({
            where: { id: existingAccount.id },
            data: {
                accountId: admin.id,
                password: passwordHash,
            },
        });
    } else {
        await prisma.account.create({
            data: {
                id: randomUUID(),
                userId: admin.id,
                accountId: admin.id,
                providerId: 'credential',
                password: passwordHash,
            },
        });
    }

    console.log('Admin credentials seeded successfully:', admin.email);
}
