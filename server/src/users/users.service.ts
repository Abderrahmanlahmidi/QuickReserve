import {
  Injectable,
  Inject,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DRIZZLE } from '../db/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async register(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password } = createUserDto;

    const existingUser = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const participantRole = await this.db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.name, 'PARTICIPANT'))
      .limit(1);

    if (participantRole.length === 0) {
      throw new InternalServerErrorException(
        'Default role "PARTICIPANT" not found in database. Did you run the seed?',
      );
    }

    const roleId = participantRole[0].id;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const [newUser] = await this.db
        .insert(schema.users)
        .values({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          roleId: roleId,
        })
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          firstName: schema.users.firstName,
          lastName: schema.users.lastName,
        });

      return {
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        message: 'Error creating user',
        error: error.message,
      });
    }
  }
}
