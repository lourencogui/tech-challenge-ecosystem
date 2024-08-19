import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // merchantId: number;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @Column({ name: 'card_number' })
  cardNumber: string;

  @Column({ name: 'card_holder_name' })
  cardHolderName: string;

  @Column({ name: 'card_expiration_date' })
  cardExpirationDate: Date;

  @Column({ name: 'card_cvv' })
  cardCvv: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

//   @Field(() => ISODate)
//   @Column({ name: 'created_at', type: 'time without time zone', readonly: true })
//   public createdAt: Date;

//   @Field(() => ISODate)
//   @Column({ name: 'updated_at', type: 'time without time zone' })
//   public updatedAt: Date;
}