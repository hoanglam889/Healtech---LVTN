import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppointmentStatusLogs } from "./AppointmentStatusLogs";
import { DoctorProfiles } from "./DoctorProfiles";

@Index("phone", ["phone"], { unique: true })
@Entity("users", { schema: "clinic_flow_erp" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "phone", unique: true, length: 20 })
  phone: string;

  @Column("varchar", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("enum", { name: "role", enum: ["ADMIN", "DOCTOR", "STAFF"] })
  role: "ADMIN" | "DOCTOR" | "STAFF";

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
    () => AppointmentStatusLogs,
    (appointmentStatusLogs) => appointmentStatusLogs.changedBy2
  )
  appointmentStatusLogs: AppointmentStatusLogs[];

  @OneToOne(() => DoctorProfiles, (doctorProfiles) => doctorProfiles.user)
  doctorProfiles: DoctorProfiles;
}
