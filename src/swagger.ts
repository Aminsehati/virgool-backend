import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { CategoryModule } from './modules/category/category.module';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle(' Virgool Documentation')
        .setVersion('1.0')
        .addBearerAuth(
            {
                description: ``,
                name: 'authorization',
                bearerFormat: 'Bearer',
                scheme: 'Bearer',
                type: 'http',
                in: 'Header',
            },
            'access-token',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        include: [
            AuthModule,
            UserModule,
            CategoryModule
        ],
    });
    SwaggerModule.setup('/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    const options = new DocumentBuilder()
        .setTitle('Virgool Admin Documentation')
        .setVersion('1.0')
        .addBearerAuth(
            {
                name: 'Admin-Access-Token',
                type: 'oauth2',
                scheme: 'Bearer',
                bearerFormat: 'JWT',
                flows: {
                    password: {
                        tokenUrl: '/api/v1/admin/auth/oauth2-login',
                        refreshUrl: '/api/v1/admin/auth/refresh-token',
                        scopes: {},
                    },
                },
            },
            'Admin-Access-Token',
        )
        .build();
    const adminDocument = SwaggerModule.createDocument(app, options, {
        include: [
            AdminModule
        ],
    });
    SwaggerModule.setup('/admin-docs', app, adminDocument, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}