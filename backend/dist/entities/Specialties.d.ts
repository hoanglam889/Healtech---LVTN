import { DoctorProfiles } from './DoctorProfiles';
export declare class Specialties {
    id: number;
    name: string;
    icon: string | null;
    description: string | null;
    createdAt: Date;
    doctorProfiles: DoctorProfiles[];
}
