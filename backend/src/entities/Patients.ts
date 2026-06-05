import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointments } from "./Appointments";
import { PatientAccounts } from "./PatientAccounts";

@Index("cccd", ["cccd"], { unique: true })
@Index("patient_account_id", ["patientAccountId"], {})
@Entity("patients", { schema: "clinic_flow_erp" })
export class Patients {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "patient_account_id", nullable: true })
  patientAccountId: number | null;

  @Column("varchar", {
    name: "relationship",
    nullable: true,
    length: 50,
    default: () => "'Bản thân'",
  })
  relationship: string | null;

  @Column("varchar", { name: "cccd", nullable: true, unique: true, length: 20 })
  cccd: string | null;

  @Column("varchar", { name: "full_name", length: 255 })
  fullName: string;

  @Column("date", { name: "dob" })
  dob: string;

  @Column("enum", { name: "gender", enum: ["MALE", "FEMALE", "OTHER"] })
  gender: "MALE" | "FEMALE" | "OTHER";

  @Column("varchar", { name: "phone", nullable: true, length: 20 })
  phone: string | null;

  @Column("varchar", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => Appointments, (appointments) => appointments.patient)
  appointments: Appointments[];

  @ManyToOne(
    () => PatientAccounts,
    (patientAccounts) => patientAccounts.patients,
    { onDelete: "SET NULL", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "patient_account_id", referencedColumnName: "id" }])
  patientAccount: PatientAccounts;
}
