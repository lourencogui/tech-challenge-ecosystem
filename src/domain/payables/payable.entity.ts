import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payables')
export class Payable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'merchant_id' })
  merchantId: number;

  @Column()
  status: string;

  @Column({ name: 'sub_total' })
  subTotal: number;

  @Column()
  discount: number;

  @Column()
  total: number;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  public constructor(partial?: Partial<Payable>) {
    Object.assign(this, partial);
  }
}