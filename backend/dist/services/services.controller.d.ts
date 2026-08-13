import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto): Promise<import("../entities/Services").Services>;
    findAll(): Promise<import("../entities/Services").Services[]>;
    findOne(id: string): Promise<import("../entities/Services").Services | null>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<import("../entities/Services").Services | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
