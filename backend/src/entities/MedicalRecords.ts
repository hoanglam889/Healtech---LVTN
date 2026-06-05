import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointments } from "./Appointments";

@Index("appointment_id", ["appointmentId"], { unique: true })
@Entity("medical_records", { schema: "clinic_flow_erp" })
export class MedicalRecords {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "appointment_id", unique: true })
  appointmentId: number;

  @Column("text", { name: "symptoms" })
  symptoms: string;

  @Column("text", { name: "diagnosis", nullable: true })
  diagnosis: string | null;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToOne(() => Appointments, (appointments) => appointments.medicalRecords, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
  appointment: Appointments;
}
