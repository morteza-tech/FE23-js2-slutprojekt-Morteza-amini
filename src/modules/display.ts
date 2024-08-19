import { Users, getUsers, getComments, deleteComment } from "./db.ts";
import { modifyClassOnElements } from "./utilities.ts";

const eSportsDiv = document.getElementById("e-sport-forum") as HTMLDivElement;
const categoryEsports = document.querySelector("#esports-title") as HTMLLIElement;
const esportsCommentDiv = document.querySelector("#e-sport-comments-posted") as HTMLDivElement;
const moviesTVShowsDiv = document.getElementById("movies-tv-shows-forum") as HTMLDivElement;
const categoryMovies = document.querySelector("#movies-title") as HTMLLIElement;
const moviesCommentDiv = document.querySelector("#movies-comments-posted") as HTMLDivElement;
const mobileGamesDiv = document.getElementById("mobile-games-forum") as HTMLDivElement;
const categoryMobileGame = document.querySelector("#mobile-games-title") as HTMLLIElement;
const mobileGameCommentDiv = document.querySelector("#mobile-games-comments-posted") as HTMLDivElement;
const userCommentsMainDiv = document.querySelector("#user-comments") as HTMLDivElement;

function createCommentElement(username: string, context: string): HTMLDivElement {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("forum-container");

    const userH2 = document.createElement("h2");
    userH2.innerText = username;

    const commentP = document.createElement("p");
    commentP.innerText = context;

    commentDiv.append(userH2, commentP);
    return commentDiv;
}

async function fetchUsers(): Promise<Record<string, Users>> {
    try {
        return await getUsers();
    } catch (error) {
        console.error("Error fetching users:", error);
        return {};
    }
}

async function fetchComments(): Promise<Record<string, Comments>> {
    try {
        return await getComments();
    } catch (error) {
        console.error("Error fetching comments:", error);
        return {};
    }
}

export function applyProfilePic(userObj: Record<string, Users>, usernameInput: HTMLInputElement, passwordInput: HTMLInputElement): void {
    const loggedInProfilePicImgElement = document.getElementById("logged-in-profile-pic") as HTMLImageElement;

    const currentUser = Object.values(userObj).find(user => 
        usernameInput.value === user.username && passwordInput.value === user.password
    );

    if (currentUser) {
        loggedInProfilePicImgElement.src = currentUser.profilepic;
        modifyClassOnElements("add", "circle", loggedInProfilePicImgElement);
    }
}

export async function displayProfilePages(user: string, loggedInUser: string): Promise<void> {
    const profilePageImgElement = document.getElementById("profile-page-profile-picture") as HTMLImageElement;
    const profilePageH2Element = document.getElementById("profile-page-username") as HTMLHeadingElement;
    const deleteAccountButton = document.getElementById("delete-button") as HTMLButtonElement;

    const users = await fetchUsers();

    const currentUser = Object.values(users).find(u => u.username === user);

    if (currentUser) {
        // @ts-ignore
        profilePageImgElement.src = window.buildedImagesPath[currentUser.profilepic];
        profilePageH2Element.innerText = currentUser.username;

        modifyClassOnElements("add", "circle", profilePageImgElement);
        if (user === loggedInUser) {
            modifyClassOnElements("remove", "hidden", deleteAccountButton);
        } else {
            modifyClassOnElements("add", "hidden", deleteAccountButton);
        }
    }
}

export async function displayUsersInAside(): Promise<void> {
    const asideDiv = document.querySelector("aside") as HTMLDivElement;
    const usersListH2 = document.createElement("h2");
    usersListH2.innerText = "All Users:";
    asideDiv.append(usersListH2);

    const users = await fetchUsers();

    Object.values(users).forEach(user => {
        const userElP = document.createElement("p");
        userElP.innerText = user.username;
        userElP.classList.add("users");
        asideDiv.append(userElP);
    });
}

export async function displayUserComments(selectedUser: string, loggedInUser: string): Promise<void> {
    const commentsContainer = document.getElementById("user-comments") as HTMLDivElement;
    commentsContainer.innerHTML = "";

    const comments = await fetchComments();
    
    Object.values(comments).forEach(comment => {
        if (comment.username === selectedUser) {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.innerHTML = `
                <p><strong>${comment.username}</strong> (${comment.category}): ${comment.context}</p>
            `;
            commentsContainer.appendChild(commentElement);
        }
    });

    if (commentsContainer.children.length === 0) {
        const noCommentsElement = document.createElement("p");
        noCommentsElement.innerText = "No comments found for this user.";
        commentsContainer.appendChild(noCommentsElement);
    }
}

function displayComments(username: string, context: string, category: string, loggedInUser: string, key: string) {
    const commentDiv = createCommentElement(username, context);

    const categoryMapping = {
        [categoryEsports.innerText]: esportsCommentDiv,
        [categoryMovies.innerText]: moviesCommentDiv,
        [categoryMobileGame.innerText]: mobileGameCommentDiv,
    };

    const targetDiv = categoryMapping[category];
    if (targetDiv && !targetDiv.classList.contains("hidden")) {
        targetDiv.append(commentDiv);
    }

    if (username === loggedInUser) {
        const trashImageUrl = new URL("../images/trash.png", import.meta.url);
        const deleteTrashCan = document.createElement("img");
        deleteTrashCan.src = trashImageUrl.toString();
        deleteTrashCan.classList.add("deleteTrashCanButtonForComments");
        commentDiv.append(deleteTrashCan);

        deleteTrashCan.addEventListener("click", async () => {
            try {
                await deleteComment(key);
                commentDiv.remove();
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        });
    }
}

export async function displayAllComments(loggedInUser: string) {
    const comments = await fetchComments();
    moviesCommentDiv.innerHTML = "";
    esportsCommentDiv.innerHTML = "";
    mobileGameCommentDiv.innerHTML = "";

    Object.entries(comments).forEach(([key, comment]) => {
        displayComments(comment.username, comment.context, comment.category, loggedInUser, key);
    });
}
