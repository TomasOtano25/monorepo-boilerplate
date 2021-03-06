import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid") 
  id: string;

  @Field()
  @Column({ type: "text", unique: true, nullable: true })
  username?: string;

  @Column({type: "text", unique: true})
  githubId: string;

  @Field({ nullable: true })
  @Column({type: "text", nullable: true})
  pictureUrl: string;

  @Field({ nullable: true })
  @Column({type: "text", nullable: true})
  bio: string;
}
