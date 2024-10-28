import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Task } from "./task.entity";
import { AbstractEntity } from "src/database/abstract.entity";

@Entity('comments')
export class Comment extends AbstractEntity<Comment> {

  @Column('text')
  content: string;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task; 

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User; 
}
