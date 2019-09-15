export interface IUserInfo {
    _id: string;
    name: string;
    firstName: string;
    lastName: string;
    contacts: [];
    dialogues: [];
    posts: string[];
    info: string;
    picture: string;
}

export interface IUserPublicInfo {
    _id: string;
    name: string;
    firstName: string;
    lastName: string;
    info: string;
    picture: string;
}

export interface IPost {
    _id: string;
    author: string;
    name: string;
    text: string;
    previewPicture: string;
    date: string;
    comments: string[];
    likes: string[];
}

export interface IPostComment {
    _id: string;
    author: string;
    text: string;
    date: string;
    comments: string[];
    likes: string[];
}
