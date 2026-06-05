import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DoctorSchedules } from "./DoctorSchedules";

@Entity("shifts", { schema: "clinic_flow_erp" })
export class Shifts {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 50 })
  name: string;

  @Column("time", { name: "start_time" })
  startTime: string;

  @Column("time", { name: "end_time" })
  endTime: string;

  @OneToMany(() => DoctorSchedules, (doctorSchedules) => doctorSchedules.shift)
  doctorSchedules: DoctorSchedules[];
}
