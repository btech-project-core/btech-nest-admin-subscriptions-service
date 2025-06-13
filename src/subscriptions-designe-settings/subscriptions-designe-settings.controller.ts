import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionsDesigneSettingsService } from './subscriptions-designe-settings.service';
import { CreateSubscriptionsDesigneSettingDto } from './dto/create-subscriptions-designe-setting.dto';
import { UpdateSubscriptionsDesigneSettingDto } from './dto/update-subscriptions-designe-setting.dto';

@Controller()
export class SubscriptionsDesigneSettingsController {
  constructor(private readonly subscriptionsDesigneSettingsService: SubscriptionsDesigneSettingsService) {}

  @MessagePattern('createSubscriptionsDesigneSetting')
  create(@Payload() createSubscriptionsDesigneSettingDto: CreateSubscriptionsDesigneSettingDto) {
    return this.subscriptionsDesigneSettingsService.create(createSubscriptionsDesigneSettingDto);
  }

  @MessagePattern('findAllSubscriptionsDesigneSettings')
  findAll() {
    return this.subscriptionsDesigneSettingsService.findAll();
  }

  @MessagePattern('findOneSubscriptionsDesigneSetting')
  findOne(@Payload() id: number) {
    return this.subscriptionsDesigneSettingsService.findOne(id);
  }

  @MessagePattern('updateSubscriptionsDesigneSetting')
  update(@Payload() updateSubscriptionsDesigneSettingDto: UpdateSubscriptionsDesigneSettingDto) {
    return this.subscriptionsDesigneSettingsService.update(updateSubscriptionsDesigneSettingDto.id, updateSubscriptionsDesigneSettingDto);
  }

  @MessagePattern('removeSubscriptionsDesigneSetting')
  remove(@Payload() id: number) {
    return this.subscriptionsDesigneSettingsService.remove(id);
  }
}
