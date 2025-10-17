import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ActivitiesModule } from './activities/activities.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Resolver()
export class FooResolver {
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
        'subscriptions-transport-ws': true,
      },
      debug: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req, res }) => ({ req, res }),
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    MongooseModule.forRootAsync(
      // process.env.MONGODB_URI || 'mongodb://localhost:27017/sync-dashboard',
      {
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('database.uri'),
        }),
        inject: [ConfigService],
      },
    ),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
