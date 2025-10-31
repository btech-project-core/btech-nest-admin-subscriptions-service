import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, timeout } from 'rxjs';
import { STORAGE_SERVICE_NAME, StorageResponse, StorageServiceClient } from './interfaces/storage';

@Injectable()
export class StorageRepository {
  constructor(
    @Inject(STORAGE_SERVICE_NAME)
    private readonly service: StorageServiceClient,
  ) {}

  async findBySubscriptionDetailId(
    subscriptionDetailId: string,
  ): Promise<StorageResponse> {
    return await firstValueFrom(
      this.service
        .findBySubscriptionDetailId({ subscriptionDetailId })
        .pipe(timeout(30 * 1000)),
    );
  }
}
