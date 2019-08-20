import { IUserInfo, IPost } from "../types";

export default class Api {
    signUp: (
        userName: string,
        password: string,
        firstName: string,
        lastName: string,
        userPicture: string | null
    ) => Promise<string | void> = (userName, password, firstName, lastName, userPicture) => {
        const url: string = `/users/create`;
        return fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                        userPicture
                            ? { userName, password, firstName, lastName, userPicture }
                            : { userName, password, firstName, lastName }
                    )
            })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.text();
                });
    }

    login: (userName: string, password: string) => Promise<string | void> = (userName, password) => {
        const url: string = `/authentication/login`;
        return fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userName, password })
            })
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

    queryPosts: (skip: number, limit: number, startDate: string | null) => Promise<IPost[]> = (skip, limit, startDate) => {
        const queryStartDate: string = startDate ? `&startDate=${startDate}` : ``;
        const url: string = `/posts/queryPage?skip=${skip}&limit=${limit}${queryStartDate}`;
        return fetch(url, { method: "get" })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                });
    }

    createPost: (postName: string, postContent: string) => Promise<string | void> = (postName, postContent) => {
        const url: string = `/posts/create`;
        return fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postName, postContent }) })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.text();
                })
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
