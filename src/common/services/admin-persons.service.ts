import { MessagingService } from 'src/messaging/messaging.service';
import { NaturalPersonResponseDto } from '../dto/natural-person.dto';
import { PersonResponseDto } from '../dto/person.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminPersonsService {
  constructor(private readonly client: MessagingService) {}

  async findOneNaturalPersonBySubscriberId(
    naturalPersonId: string,
  ): Promise<NaturalPersonResponseDto> {
    return this.client.send('naturalPerson.findByNaturalPersonId', {
      naturalPersonId,
    });
  }

  async findOneSubscriptionPersonData(
    personId: string,
  ): Promise<PersonResponseDto> {
    return this.client.send('person.findSubscriptionPersonData', {
      personId,
    });
  }
}
