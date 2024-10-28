import { AbstractEntity } from "src/database/abstract.entity";
import { TaskPriority } from "../enums/task-priority.enum";
import { TaskStatus } from "../enums/task-status.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Comment } from "./comment.entity";

@Entity('tasks')
export class Task extends AbstractEntity<Task>{

  @Column()
  description: string;

  @Column({name: 'contact_info'})
  contactInfo: string;

  @Column({ type: 'enum', enum: TaskPriority })
  priority: TaskPriority;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @OneToMany(() => Comment, (comment) => comment.task, { cascade: true })
  comments: Comment[]; // All comments related to this task

  @ManyToOne(() => User, (user) => user.tasks) // User entity relationship
  @JoinColumn({ name: 'assignee_id' }) // Foreign key
  assignee: User;

  @Column({ type: 'boolean', default: false })
  locked: boolean;
}
