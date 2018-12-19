import { User } from './user';

export interface Comment {
    id: number;
    user: User;
    dateCreated: Date;
    content: string;
    score: number;
    comments: Comment[];
}
