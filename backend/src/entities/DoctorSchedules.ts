import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DoctorProfiles } from "./DoctorProfiles";
import { Shifts } from "./Shifts";

@Index("doctor_profile_id", ["doctorProfileId"], {})
@Index("shift_id", ["shiftId"], {})
@Entity("doctor_schedules", { schema: "clinic_flow_erp" })
export class DoctorSchedules {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "doctor_profile_id" })
  doctorProfileId: number;

  @Column("int", { name: "shift_id" })
  shiftId: number;

  @Column("date", { name: "date" })
  date: string;

  @Column("int", { name: "max_patients", nullable: true, default: () => "'5'" })
  maxPatients: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(
    () => DoctorProfiles,
    (doctorProfiles) => doctorProfiles.doctorSchedules,
    { onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "doctor_profile_id", referencedColumnName: "id" }])
  doctorProfile: DoctorProfiles;

  @ManyToOne(() => Shifts, (shifts) => shifts.doctorSchedules, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "shift_id", referencedColumnName: "id" }])
  shift: Shifts;
}
