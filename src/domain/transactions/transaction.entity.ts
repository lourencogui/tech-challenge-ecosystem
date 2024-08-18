import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  paymentMethod: string;

  @Column()
  paymentStatus: string;

  @Column()
  paymentDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

//   @Field(() => ISODate)
//   @Column({ name: 'created_at', type: 'time without time zone', readonly: true })
//   public createdAt: Date;

//   @Field(() => ISODate)
//   @Column({ name: 'updated_at', type: 'time without time zone' })
//   public updatedAt: Date;
}