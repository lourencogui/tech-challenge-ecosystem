import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class AppEntity {
    @PrimaryColumn()
    user_id: number;

    @Column()
    token: string;
}