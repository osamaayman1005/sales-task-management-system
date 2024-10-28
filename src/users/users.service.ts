import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { UserRole } from './enums/user.role.enum';
import { TaskStatus } from 'src/tasks/enums/task-status.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = await hash(createUserDto.password, 10);
      const user = new User(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException('An error occurred while creating the user');
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    return await this.userRepository.save(updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id: id });
  }


  async getLoggedInSalesAgentsBySuccessRate(): Promise<User[]> {
    const query = `
        SELECT u.*, 
                CASE 
                  WHEN COUNT(t.id) = 0 THEN 0 
                  ELSE (COUNT(CASE WHEN t.status = 'Succeeded' THEN 1 END) * 1.0 / COUNT(t.id)) * 100 
                END as successRate
              FROM users u
              LEFT JOIN tasks t ON t.assignee_id = u.id
              WHERE u.role = 'SalesAgent'
                AND u.is_logged_in = true
                AND (SELECT COUNT(*) FROM tasks WHERE assignee_id = u.id AND status = 'Succeeded') > 0
              GROUP BY u.id
              ORDER BY successRate DESC;
    `;

    return this.userRepository.query(query);
  }

}
