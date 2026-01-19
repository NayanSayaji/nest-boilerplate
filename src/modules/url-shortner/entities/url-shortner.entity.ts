import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { IndexOptions } from "typeorm";

@Entity('url_shortner')
@Index('shortUrl_unique_active_urls', ['shortUrl'], {
    unique: true,
    where: 'deleted_at IS NULL',
})
@Index('idx_created_at', ['createdAt'], {
    where: 'deleted_at IS NOT NULL',
})
@Index('idx_deleted_at', ['deletedAt'])
export class UrlShortnerEntity {

    @PrimaryGeneratedColumn("uuid", {
        primaryKeyConstraintName: 'pkey_index_in_url_shortner_id',
    })
    id: string;

    @Column({ name: "original_url", type: "text" })
    originalUrl: string;

    @Column({ name: "short_url", type: "text" })
    shortUrl: string;

    @Column({ type: "int8", name: "visitors_count" })
    visitorsCount: number;

    @Column({ type: "timestamp", array: true, name: "visited_at" })
    visitedAt: Timestamp[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;
}
