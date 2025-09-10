import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import firebaseConfig from 'src/config/firebase.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(firebaseConfig)],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
