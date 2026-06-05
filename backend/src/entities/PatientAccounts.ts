import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Notifications } from "./Notifications";
import { Patients } from "./Patients";

@Index("phone", ["phone"], { unique: true })
@Entity("patient_accounts", { schema: "clinic_flow_erp" })
export class PatientAccounts {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "phone", unique: true, length: 20 })
  phone: string;

  @Column("varchar", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("tinyint" as any, {
    name: "is_active",
    nullable: true,
    width: 1,
    default: () => "'1'",
  } as any)
  isActive: boolean | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(
    () => Notifications,
    (notifications) => notifications.patientAccount
  )
  notifications: Notifications[];

  @OneToMany(() => Patients, (patients) => patients.patientAccount)
  patients: Patients[];
}
