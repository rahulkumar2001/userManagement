// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mobile: string;

  @Column()
  name: string;

  @Column({ default: false })
  status: boolean;

  @Column({ type: 'datetime', nullable: true })
  last_login: Date;
  
  @Column({ nullable: true })
  ip_address: string;
  

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  password: string;
}
