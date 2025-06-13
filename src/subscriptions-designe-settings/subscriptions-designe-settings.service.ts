import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsDesigneSettingDto } from './dto/create-subscriptions-designe-setting.dto';
import { UpdateSubscriptionsDesigneSettingDto } from './dto/update-subscriptions-designe-setting.dto';

@Injectable()
export class SubscriptionsDesigneSettingsService {
  create(createSubscriptionsDesigneSettingDto: CreateSubscriptionsDesigneSettingDto) {
    return 'This action adds a new subscriptionsDesigneSetting';
  }

  findAll() {
    return `This action returns all subscriptionsDesigneSettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionsDesigneSetting`;
  }

  update(id: number, updateSubscriptionsDesigneSettingDto: UpdateSubscriptionsDesigneSettingDto) {
    return `This action updates a #${id} subscriptionsDesigneSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionsDesigneSetting`;
  }
}
