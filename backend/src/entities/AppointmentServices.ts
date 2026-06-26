import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointments } from './Appointments';
import { Services } from './Services';

@Index('appointment_id', ['appointmentId'], {})
@Index('service_id', ['serviceId'], {})
@Entity('appointment_services', { schema: 'clinic_flow_erp' })
export class AppointmentServices {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'appointment_id' })
  appointmentId: number;

  @Column('int', { name: 'service_id' })
  serviceId: number;

  @Column('int', { name: 'quantity', nullable: true, default: () => "'1'" })
  quantity: number | null;

  @Column('decimal', { name: 'snapshot_price', precision: 12, scale: 2 })
  snapshotPrice: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => Appointments,
    (appointments) => appointments.appointmentServices,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'appointment_id', referencedColumnName: 'id' }])
  appointment: Appointments;

  @ManyToOne(() => Services, (services) => services.appointmentServices, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'service_id', referencedColumnName: 'id' }])
  service: Services;
}
