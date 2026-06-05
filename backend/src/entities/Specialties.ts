import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DoctorProfiles } from "./DoctorProfiles";

@Entity("specialties", { schema: "clinic_flow_erp" })
export class Specialties {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "icon", length: 255, nullable: true })
  icon: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => DoctorProfiles, (doctorProfiles) => doctorProfiles.specialty)
  doctorProfiles: DoctorProfiles[];
}
