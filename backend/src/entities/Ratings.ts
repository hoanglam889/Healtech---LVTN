import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointments } from './Appointments';
import { DoctorProfiles } from './DoctorProfiles';
import { PatientAccounts } from './PatientAccounts';
@Index('uk_ratings_appointment_id', ['appointment_id'], { unique: true })
@Index('idx_ratings_doctor_id', ['doctor_profile_id'], {})
@Index('idx_ratings_patient_id', ['patient_account_id'], {})
@Entity('ratings', { schema: 'clinic_flow_erp' })
export class Ratings {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'appointment_id' })
  appointment_id: number;

  @Column('int', { name: 'doctor_profile_id' })
  doctor_profile_id: number;

  @Column('int', { name: 'patient_account_id' })
  patient_account_id: number;

  @Column('int', { name: 'rating' })
  rating: number;

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToOne(() => Appointments, (appointments) => appointments.rating, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'appointment_id', referencedColumnName: 'id' }])
  appointment: Appointments;

  @ManyToOne(() => DoctorProfiles, (doctorProfiles) => doctorProfiles.ratings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'doctor_profile_id', referencedColumnName: 'id' }])
  doctor_profile: DoctorProfiles;

  @ManyToOne(
    () => PatientAccounts,
    (patientAccounts) => patientAccounts.ratings,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'patient_account_id', referencedColumnName: 'id' }])
  patient_account: PatientAccounts;
}
