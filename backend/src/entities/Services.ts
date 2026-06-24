import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentServices } from "./AppointmentServices";

@Entity("services", { schema: "clinic_flow_erp" })
export class Services {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("decimal", { name: "price", precision: 12, scale: 2 })
  price: string;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "'1'",
  })
  isActive: boolean | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(
    () => AppointmentServices,
    (appointmentServices) => appointmentServices.service
  )
  appointmentServices: AppointmentServices[];
}
