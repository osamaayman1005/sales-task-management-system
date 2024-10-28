import { AbstractEntity } from "src/database/abstract.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserRole } from "../enums/user.role.enum";

@Entity('users')
export class User extends AbstractEntity<User> {
    @Column({unique: true})
    email: string;

    @Column()
    password:string
    
    @Column({default: false, name: 'is_logged_in'})
    isLoggedIn: boolean;

    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.SALES_AGENT
    })
    role: UserRole;

  
  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[]; 
}
