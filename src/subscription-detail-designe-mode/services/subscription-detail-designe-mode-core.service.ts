import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionDetailDesigneMode } from '../entities/subscription-detail-designe-mode.entity';
import { CreateSubscriptionDetailDesigneModeDto } from '../dto/create-subscription-detail-designe-mode.dto';

@Injectable()
export class SubscriptionDetailDesigneModeCoreService {
  constructor(
    @InjectRepository(SubscriptionDetailDesigneMode)
    private readonly subscriptionDetailDesigneModeRepository: Repository<SubscriptionDetailDesigneMode>,
  ) {}

  async create(
    createDto: CreateSubscriptionDetailDesigneModeDto,
  ): Promise<SubscriptionDetailDesigneMode> {
    const { subscriptionDetailId, designerModeId, isPrimary, isActive } =
      createDto;

    // Si se marca como primario, desmarcar otros primarios del mismo subscriptionDetail
    if (isPrimary) {
      await this.subscriptionDetailDesigneModeRepository.update(
        { subscriptionDetail: { subscriptionDetailId } },
        { isPrimary: false },
      );
    }

    const newRecord = this.subscriptionDetailDesigneModeRepository.create({
      subscriptionDetail: { subscriptionDetailId },
      designerMode: { designerModeId },
      isPrimary: isPrimary ?? false,
      isActive: isActive ?? true,
    });

    return await this.subscriptionDetailDesigneModeRepository.save(newRecord);
  }

  async findAll(): Promise<SubscriptionDetailDesigneMode[]> {
    return await this.subscriptionDetailDesigneModeRepository.find({
      relations: ['subscriptionDetail', 'designerMode'],
    });
  }

  async findOne(
    subscriptionDetailDesigneModeId: string,
  ): Promise<SubscriptionDetailDesigneMode> {
    const record = await this.subscriptionDetailDesigneModeRepository.findOne({
      where: { subscriptionDetailDesigneModeId },
      relations: [
        'subscriptionDetail',
        'designerMode',
        'subscriptionsDesigneSetting',
      ],
    });

    if (!record) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El registro con id ${subscriptionDetailDesigneModeId} no se encuentra.`,
      });
    }

    return record;
  }

  async delete(
    subscriptionDetailDesigneModeId: string,
  ): Promise<{ message: string }> {
    const record = await this.subscriptionDetailDesigneModeRepository.findOne({
      where: { subscriptionDetailDesigneModeId },
    });

    if (!record) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `El registro con id ${subscriptionDetailDesigneModeId} no se encuentra.`,
      });
    }

    await this.subscriptionDetailDesigneModeRepository.remove(record);

    return {
      message: 'Registro eliminado correctamente',
    };
  }
}
