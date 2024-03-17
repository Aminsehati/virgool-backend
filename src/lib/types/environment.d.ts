namespace NodeJS {
    interface ProcessEnv {
        PORT?: number
        DB_HOST: string
        DB_PORT: number
        DB_PASSWORD: string
        DB_NAME: string
        DB_USER: string
        USER_JWT_SECRET: string
        ADMIN_JWT_SECRET: string
        ACCESS_TOKEN_USER_EXPIRATION: string
        ACCESS_TOKEN_ADMIN_EXPIRATION: string
        REFRESH_TOKEN_USER_EXPIRATION: string
        REFRESH_TOKEN_ADMIN_EXPIRATION: string
        COOKIE_SECRET: string
    }
}