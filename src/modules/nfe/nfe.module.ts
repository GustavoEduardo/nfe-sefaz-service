import { Module } from '@nestjs/common';
import { NfeController } from './nfe.controller';
import { NfeService } from './nfe.service';
import { IntegrationsModule } from 'src/integrations/integrations.module';

@Module({
  imports: [IntegrationsModule],
  controllers: [NfeController],
  providers: [NfeService]
})
export class NfeModule {}
