import { createBackend } from '@backstage/backend-defaults';
import { coreServices, createBackendModule, createServiceFactory, RootHealthService } from '@backstage/backend-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { JsonValue } from '@backstage/types/index';
import dotenv from 'dotenv';

// Read environment variables from .env file
dotenv.config({path: '../../.env'});

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// GitHub discovery
backend.add(import('@backstage/plugin-catalog-backend-module-github'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
// See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend'));

// Readiness and liveness service
class HealthService implements RootHealthService {
  getLiveness(): Promise<{ status: number; payload?: JsonValue; }> {
    return Promise.resolve({
      status: 200,
      payload: { status: 'OK' }
    });
  }

  getReadiness(): Promise<{ status: number; payload?: JsonValue; }> {
    return Promise.resolve({
      status: 200,
      payload: { status: 'OK' }
    });
  }
}

backend.add(
  createServiceFactory({
    service: coreServices.rootHealth,
    deps: {},
    factory: ({}) => {
      return new HealthService();
    }
  })
)

const customAuthResolver = createBackendModule({
  pluginId: 'auth',                  // This ID must be exactly "auth" because that's the plugin it targets
  moduleId: 'custom-auth-provider',  // This ID must be unique, but can be anything
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'github',                  // auth.providers.github in app-config
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            async signInResolver(info, ctx) {
              // "info" is the sign in result from the upstream (github here)
              // "ctx" contains useful utilities for token issuance etc.
              const { result: { fullProfile: { username } } } = info;

              if (!username) {
                throw new Error('User profile contained no user name');
              }

              const userEntity = stringifyEntityRef({
                kind: 'user',
                name: username,
                namespace: 'default',
              })

              return ctx.issueToken({
                claims: {
                  sub: userEntity,  // JWT subject claim
                  ent: [userEntity],
                },
              });
            },
          }),
        });
      },
    });
  },
});

backend.add(customAuthResolver)

backend.start();
