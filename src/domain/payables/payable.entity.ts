import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  merchant_id: number;

  @Column()
  status: string;

  @Column()
  subTotal: number;

  @Column()
  discount: number;

  @Column()
  total: number;

  @Column()
  dueDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}