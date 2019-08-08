import { IUserInfo, IPost } from "../types";

export default class Api {
    login: (userName: string, password: string) => Promise<string | void> = (userName, password) => {
        const url: string = `/authentication/login?userName=${userName}&password=${password}`;
        return fetch(url, { method: "get" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
                });
    }

    logout: () => Promise<string | void> = () => {
        const url: string = `/authentication/logout`;
        return fetch(url, { method: "get" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
                })
            .catch(error => console.error(error));
    }

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

    togglePostLike: (postId: string) => Promise<string | void> = (postId) => {
        const url: string = `/posts/toggleLike?postId=${postId}`;
        return fetch(url, { method: "post" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
                })
            .catch(error => console.error(error));
    }
}