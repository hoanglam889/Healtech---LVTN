import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PatientAccounts } from "./PatientAccounts";

@Index("patient_account_id", ["patientAccountId"], {})
@Entity("notifications", { schema: "clinic_flow_erp" })
export class Notifications {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "patient_account_id" })
  patientAccountId: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("tinyint" as any, {
    name: "is_read",
    nullable: true,
    width: 1,
    default: () => "'0'",
  } as any)
  isRead: boolean | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(
    () => PatientAccounts,
    (patientAccounts) => patientAccounts.notifications,
    { onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "patient_account_id", referencedColumnName: "id" }])
  patientAccount: PatientAccounts;
}
