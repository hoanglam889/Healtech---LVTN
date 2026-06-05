import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Patients } from "./Patients";
import { DoctorProfiles } from "./DoctorProfiles";
import { AppointmentStatusLogs } from "./AppointmentStatusLogs";
import { Invoices } from "./Invoices";
import { MedicalRecords } from "./MedicalRecords";

@Index("qr_code", ["qrCode"], { unique: true })
@Index("patient_id", ["patientId"], {})
@Index("doctor_profile_id", ["doctorProfileId"], {})
@Entity("appointments", { schema: "clinic_flow_erp" })
export class Appointments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "qr_code", unique: true, length: 100 })
  qrCode: string;

  @Column("int", { name: "patient_id" })
  patientId: number;

  @Column("int", { name: "doctor_profile_id", nullable: true })
  doctorProfileId: number | null;

  @Column("date", { name: "appointment_date" })
  appointmentDate: string;

  @Column("time", { name: "appointment_time", nullable: true })
  appointmentTime: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["BOOKED", "WAITING", "EXAMINING", "DONE", "CANCELLED"],
    default: () => "'BOOKED'",
  })
  status: "BOOKED" | "WAITING" | "EXAMINING" | "DONE" | "CANCELLED" | null;

  @Column("int", {
    name: "priority_score",
    nullable: true,
    default: () => "'1'",
  })
  priorityScore: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => Patients, (patients) => patients.appointments, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "patient_id", referencedColumnName: "id" }])
  patient: Patients;

  @ManyToOne(
    () => DoctorProfiles,
    (doctorProfiles) => doctorProfiles.appointments,
    { onDelete: "SET NULL", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "doctor_profile_id", referencedColumnName: "id" }])
  doctorProfile: DoctorProfiles;

  @OneToMany(
    () => AppointmentStatusLogs,
    (appointmentStatusLogs) => appointmentStatusLogs.appointment
  )
  appointmentStatusLogs: AppointmentStatusLogs[];

  @OneToOne(() => Invoices, (invoices) => invoices.appointment)
  invoices: Invoices;

  @OneToOne(
    () => MedicalRecords,
    (medicalRecords) => medicalRecords.appointment
  )
  medicalRecords: MedicalRecords;
}
