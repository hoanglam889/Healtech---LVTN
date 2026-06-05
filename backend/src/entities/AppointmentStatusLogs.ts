import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointments } from "./Appointments";
import { Users } from "./Users";

@Index("appointment_id", ["appointmentId"], {})
@Index("changed_by", ["changedBy"], {})
@Entity("appointment_status_logs", { schema: "clinic_flow_erp" })
export class AppointmentStatusLogs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "appointment_id" })
  appointmentId: number;

  @Column("enum", {
    name: "old_status",
    nullable: true,
    enum: ["BOOKED", "WAITING", "EXAMINING", "DONE", "CANCELLED"],
  })
  oldStatus: "BOOKED" | "WAITING" | "EXAMINING" | "DONE" | "CANCELLED" | null;

  @Column("enum", {
    name: "new_status",
    enum: ["BOOKED", "WAITING", "EXAMINING", "DONE", "CANCELLED"],
  })
  newStatus: "BOOKED" | "WAITING" | "EXAMINING" | "DONE" | "CANCELLED";

  @Column("int", { name: "changed_by", nullable: true })
  changedBy: number | null;

  @Column("timestamp", {
    name: "changed_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  changedAt: Date;

  @ManyToOne(
    () => Appointments,
    (appointments) => appointments.appointmentStatusLogs,
    { onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
  appointment: Appointments;

  @ManyToOne(() => Users, (users) => users.appointmentStatusLogs, {
    onDelete: "SET NULL",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "changed_by", referencedColumnName: "id" }])
  changedBy2: Users;
}
