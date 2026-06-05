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
@Entity("invoices", { schema: "clinic_flow_erp" })
export class Invoices {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "appointment_id", unique: true })
  appointmentId: number;

  @Column("decimal", { name: "total_amount", precision: 12, scale: 2 })
  totalAmount: string;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["UNPAID", "PAID", "CANCELLED"],
    default: () => "'UNPAID'",
  })
  status: "UNPAID" | "PAID" | "CANCELLED" | null;

  @Column("enum", {
    name: "payment_method",
    nullable: true,
    enum: ["VNPAY", "CASH"],
  })
  paymentMethod: "VNPAY" | "CASH" | null;

  @Column("timestamp", { name: "paid_at", nullable: true })
  paidAt: Date | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToOne(() => Appointments, (appointments) => appointments.invoices, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
  appointment: Appointments;
}
