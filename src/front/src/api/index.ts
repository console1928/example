import { IUserInfo, IPost } from "../types";

export default class Api {
    getUserInfo: () => Promise<IUserInfo> = () => {
        const url: string = `/users/userInfo`;
        return fetch(url, { method: "get" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
                })
            .catch(error => console.error(error));
    }

    getPosts: (skip: number, limit: number) => Promise<IPost[]> = (skip, limit) => {
        const url: string = `/posts/queryPage?skip=${skip}&limit=${limit}`;
        return fetch(url, { method: "get" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
                })
            .catch(error => console.error(error));
    }

    togglePostLike: () => void = () => {
        console.log("post like toggled");
    }
}