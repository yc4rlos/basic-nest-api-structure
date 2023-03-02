export const config = () => ({

    // API configuration
    apiPort: Number(process.env.API_PORT || 3000),
    apiUrl: String(process.env.API_URL || 'http://localhost:3000'),
    
    // Database configuration  
    database: {
        host: String(process.env.DATABASE_HOST || 'localhost'),
        username: String(process.env.DATABASE_USER || 'postgres'),
        password: String(process.env.DATABASE_PASSWORD || '123456'),
        database: String(process.env.DATABASE_NAME || 'test')
    },

    // Email configuration
    mail: {
        host: String(process.env.MAIL_HOST),
        port: String(process.env.MAIL_PORT),
        auth: {
            user: String(process.env.MAIL_USER ),
            pass: String(process.env.MAIL_PASSWORD),
        }
    }
})