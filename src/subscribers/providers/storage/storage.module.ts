import { Module } from "@nestjs/common";
import { StorageRepository } from "./storage.repository";
import { ClientGrpc, ClientsModule, Transport } from "@nestjs/microservices";
import { STORAGE_CLIENT, STORAGE_SERVICE } from "./storage.constant";
import { envs } from "src/config";
import { join } from "node:path";
import { StorageServiceClient } from "./interfaces/storage";

@Module({
    imports: [
        ClientsModule.registerAsync([
        {
            name: STORAGE_CLIENT,
            imports: [],
            inject: [],
            useFactory: () => ({
            transport: Transport.GRPC,
            options: {
                url: `${envs.storage_service.grpc_host}:${envs.storage_service.grpc_port}`,
                package: ['storage.v1'],
                protoPath: [
                    join(process.cwd(), 'src/common/proto', 'storage.proto')
                ],
            },
            }),
        },
        ]),
    ],
    providers: [
        {
            provide: STORAGE_SERVICE,
            useFactory: (client: ClientGrpc) =>
                client.getService<StorageServiceClient>(STORAGE_SERVICE),
                inject: [STORAGE_CLIENT],
        },
        StorageRepository
    ],
    exports: [StorageRepository],
})
export class StorageModule {}