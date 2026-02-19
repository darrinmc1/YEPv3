import { SignJWT, jwtVerify } from 'jose';

export interface AdminTokenPayload {
    email: string
    role: 'admin'
    iat?: number
    exp?: number
}

const SECRET_KEY = new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || 'dev-secret-change-me'
);

export async function generateAdminToken(email: string): Promise<string> {
    return new SignJWT({ email, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as unknown as AdminTokenPayload;
    } catch (error) {
        return null;
    }
}
