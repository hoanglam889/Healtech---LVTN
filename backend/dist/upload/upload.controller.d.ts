export declare class UploadController {
    uploadImage(file: Express.Multer.File): {
        filePath: string;
        originalName: string;
        size: number;
    };
}
