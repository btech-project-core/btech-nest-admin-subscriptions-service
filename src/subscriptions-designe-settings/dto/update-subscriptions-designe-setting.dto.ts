import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionsDesigneSettingDto } from './create-subscriptions-designe-setting.dto';

export class UpdateSubscriptionsDesigneSettingDto extends PartialType(CreateSubscriptionsDesigneSettingDto) {
  id: number;
}
