import { Post } from './post';

export interface User {
    id: number;
    username: string;
    displayName: string;
    email: string;
    dateCreated: Date;
    dateLastActive: Date;
    bio?: string;
    profileImageUrl: string;
    posts?: Post[];
    isPrivate: boolean;
    isFollowing: boolean;
}
