import { User } from './user';

export interface Post {
    id: number;
    content: string;
    user: User;
    dateCreated: Date;
    score: number;
    postImages: string[];
    comments: Comment[];
}
