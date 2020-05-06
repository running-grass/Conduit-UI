import {App} from './app';
import {ConduitApp} from './interfaces/ConduitApp';
import { ConfigModelGenerator } from './models/Config';
import {DatabaseConfigUtility} from './utils/config';
import {Config} from 'convict';
import AdminModule from '@conduit/admin';
import SecurityModule from '@conduit/security';
import PushNotificationsModule from '@conduit/push-notifications';
import EmailModule from '@conduit/email';
import AuthenticationModule from '@conduit/authentication';
import {CMS} from '@conduit/cms';
import StorageModule from '@conduit/storage';
import InMemoryStoreModule from '@conduit/in-memory-store';
import {ConfigAdminHandlers} from './admin/config';
import {ConduitSDK} from '@conduit/sdk';

export class CoreBootstrapper {
    static bootstrap() {
        const app = new App().get();
        CoreBootstrapper.bootstrapSdkComponents(app).catch(console.log);
        return app;
    }

    private static registerSchemas(app: ConduitApp) {
        const database = app.conduit.getDatabase();
        const ConfigModel = new ConfigModelGenerator(app).configModel;
        database.createSchemaFromAdapter(ConfigModel);
    }

    private static registerAdminRoutes(sdk: ConduitSDK) {
        const configHandlers = new ConfigAdminHandlers(sdk);
        const adminModule = sdk.getAdmin();

        adminModule.registerRoute('GET', '/config/:module?', configHandlers.getConfig.bind(configHandlers));
        adminModule.registerRoute('PUT', '/config/:module?', configHandlers.setConfig.bind(configHandlers));
    }

    private static async bootstrapSdkComponents(app: ConduitApp) {
        CoreBootstrapper.registerSchemas(app);

        const database = app.conduit.getDatabase();
        const appConfig: Config<any> = (app.conduit as any).config;

        const databaseConfigUtility = new DatabaseConfigUtility(database, appConfig);

        await databaseConfigUtility.configureFromDatabase();

        app.conduit.registerAdmin(new AdminModule(app.conduit));

        app.conduit.registerSecurity(new SecurityModule(app.conduit));

        app.conduit.registerEmail(new EmailModule(app.conduit));

        app.conduit.registerAuthentication(new AuthenticationModule(app.conduit));

        app.conduit.registerPushNotifications(new PushNotificationsModule(app.conduit));

        // initialize plugin AFTER the authentication so that we may provide access control to the plugins
        app.conduit.registerCMS(new CMS(app.conduit));

        app.conduit.registerStorage(new StorageModule(app.conduit));

        app.conduit.registerInMemoryStore(new InMemoryStoreModule(app.conduit));

        CoreBootstrapper.registerAdminRoutes(app.conduit);

        app.initialized = true;
    }
}