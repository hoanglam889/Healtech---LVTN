import { Users } from './Users';
export declare class Articles {
    id: number;
    title: string;
    category: string;
    content: string;
    image_url: string;
    author_name: string;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
    user_id: number;
    user: Users;
}
