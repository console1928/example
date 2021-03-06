import { IUserInfo, IUserPublicInfo, IPost, IPostComment } from "../types";

class Api {
    signUp: ( userName: string, password: string, firstName: string, lastName: string ) => Promise<string | void> =
        (userName, password, firstName, lastName) => {
            const url: string = `/users/create`;
            return fetch(url, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userName, password, firstName, lastName })
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

    getUserPublicInfo: (userId: string) => Promise<IUserPublicInfo> = (userId) => {
        const url: string = `/users/userPublicInfo?userId=${userId}`;
        return fetch(url, { method: "get" })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
            .catch(error => console.error(error));
    }

    queryPosts: (skip: number, limit: number, startDate: string | null, searchValue: string) => Promise<IPost[]> =
        (skip, limit, startDate, searchValue) => {
            const queryStartDate: string = startDate ? `&startDate=${startDate}` : ``;
            const searchValues: string = searchValue.trim() !== ""
                ? `&searchValue=${searchValue.trim().split(" ").filter(value => value !== "").join("&searchValue=")}`
                : "";
            const url: string = `/posts/queryPage?skip=${skip}&limit=${limit}${queryStartDate}${searchValues}`;
            return fetch(url, { method: "get" })
                .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    });
        }

    createPost: (postName: string, postContent: string, postPreviewPicture: string) => Promise<string | void> =
        (postName, postContent, postPreviewPicture) => {
            const url: string = `/posts/create`;
            return fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ postName, postContent, postPreviewPicture }) })
                .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.text();
                    });
        }

    togglePostLike: (postId: string) => Promise<string | void> = (postId) => {
        const url: string = `/posts/toggleLike?postId=${postId}`;
        return fetch(url, { method: "post" })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.text();
                });
    }

    queryComments: (parentType: "post" | "comment", parentId: string) => Promise<IPostComment[] | null> =
        (parentType, parentId) => {
            const url: string = `/posts/queryComments?parentType=${parentType}&parentId=${parentId}`;
            return fetch(url, { method: "get" })
                .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    });
        }

    createComment: (parentType: "post" | "comment", parentId: string, commentText: string) => Promise<string | void> =
        (parentType, parentId, commentText) => {
            const url: string = `/posts/createComment?parentType=${parentType}&parentId=${parentId}`;
            return fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ commentText }) })
                .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.text();
                    });
        }

    toggleCommentLike: (commentId: string) => Promise<string | void> = (commentId) => {
        const url: string = `/posts/toggleCommentLike?commentId=${commentId}`;
        return fetch(url, { method: "post" })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.text();
                });
    }

    sendFeedback: (feedbackText: string) => Promise<string | void> = (feedbackText) => {
        const url: string = `/utils/feedback`;
        return fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ feedbackText }) })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.text();
                });
    }

    setUserPicture: (userPicture: string) => Promise<IUserInfo> = (userPicture) => {
        const url: string = `/users/setPicture`;
        return fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userPicture }) })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                });
    }

    setUserInfo: (userInfo: string) => Promise<IUserInfo> = (userInfo) => {
        const url: string = `/users/setInfo`;
        return fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userInfo }) })
            .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                });
    }
}

export default Api;
