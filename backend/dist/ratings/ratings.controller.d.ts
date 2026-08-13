import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    create(createRatingDto: CreateRatingDto): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/Ratings").Ratings;
    }>;
    findAll(doctorId?: string): Promise<import("../entities/Ratings").Ratings[]>;
    findOne(id: string): Promise<import("../entities/Ratings").Ratings>;
    update(id: string, updateRatingDto: UpdateRatingDto): string;
    remove(id: string): string;
}
