import { MessagingService } from 'src/messaging/messaging.service';
import { NaturalPersonResponseDto } from '../dto/natural-person.dto';
import { PersonResponseDto } from '../dto/person.dto';
import { Injectable } from '@nestjs/common';
import {
  FindSubscriptionMultiplePersonDataDto,
  FindSubscriptionMultiplePersonDataResponseDto,
} from '../dto/find-subscription-multiple-person-data.dto';
import {
  FindMultipleNaturalPersonsDto,
  FindMultipleNaturalPersonsResponseDto,
} from '../dto/find-multiple-natural-persons.dto';

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

  async findMultipleSubscriptionPersonData(
    findSubscriptionMultiplePersonDataDto: FindSubscriptionMultiplePersonDataDto,
  ): Promise<FindSubscriptionMultiplePersonDataResponseDto[]> {
    console.log(findSubscriptionMultiplePersonDataDto);
    return this.client.send(
      'person.findMultipleSubscriptionPersonData',
      findSubscriptionMultiplePersonDataDto,
    );
  }

  async validatePersonsExist(personIds: string[]): Promise<void> {
    return this.client.send('person.validatePersonsExist', { personIds });
  }

  async findMultipleNaturalPersonsByIds(
    findMultipleDto: FindMultipleNaturalPersonsDto,
  ): Promise<FindMultipleNaturalPersonsResponseDto[]> {
    return this.client.send(
      'naturalPersons.findMultipleByIds',
      findMultipleDto,
    );
  }

  async isValidDocumentNumberForUser(
    documentNumber: string,
  ): Promise<{ naturalPersonId: string }> {
    return this.client.send('person.isValidDocumentNumberForUser', {
      documentNumber,
    });
  }

  async findAllNaturalPersonIds(): Promise<string[]> {
    return this.client.send('naturalPersons.findAllNaturalPersonIds', {});
  }
}
