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
import { Appointments } from "./Appointments";
import { Users } from "./Users";
import { Specialties } from "./Specialties";
import { DoctorSchedules } from "./DoctorSchedules";

@Index("user_id", ["userId"], { unique: true })
@Index("specialty_id", ["specialtyId"], {})
@Entity("doctor_profiles", { schema: "clinic_flow_erp" })
export class DoctorProfiles {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id", unique: true })
  userId: number;

  @Column("int", { name: "specialty_id" })
  specialtyId: number;

  @Column("varchar", { name: "full_name", length: 255 })
  fullName: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
avatarUrl: string;

  @Column("int", {
    name: "experience_years",
    nullable: true,
    default: () => "'0'",
  })
  experienceYears: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => Appointments, (appointments) => appointments.doctorProfile)
  appointments: Appointments[];

  @OneToOne(() => Users, (users) => users.doctorProfiles, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Specialties, (specialties) => specialties.doctorProfiles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "specialty_id", referencedColumnName: "id" }])
  specialty: Specialties;

  @OneToMany(() => DoctorSchedules, (doctorSchedules) => doctorSchedules.doctorProfile)
  doctorSchedules: DoctorSchedules[];
}
