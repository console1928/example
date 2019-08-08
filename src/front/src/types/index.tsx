export interface IUserInfo {
    _id: string;
    name: string;
    firstName: string;
    lastName: string;
    contacts: [];
    dialogues: [];
    posts: IPost[];
}

export interface IPost {
    _id: string;
    author: string;
    name: string;
    text: string;
    date: string;
    comments: [];
    likes: string[];
}

export interface IPostComment {
    author: string;
    text: string;
    comments: IPostComment[];
    likes: [];
}
