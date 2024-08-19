import { errorMessageLoginRegisterPage } from "./error.ts";
import { Users, getUsers } from "./db.ts";

export function clearUserProfilePicChoice(): void {
    const imageIds = ["profile-images-one", "profile-images-two", "profile-images-three"];
    const images = imageIds.map(id => document.getElementById(id) as HTMLImageElement);
    modifyClassOnElements("remove", "user-choice", ...images);
}

export function modifyClassOnElements(action: "add" | "remove", className: string, ...elements: HTMLElement[]): void {
    elements.forEach(element => {
        if (element) {
            element.classList[action](className);
        }
    });
}

export function setCookie(name: string, value: string, days: number): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`;
}

export function getCookie(name: string): string | null {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(c => c.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

export function deleteCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

export async function registerChecker(user: string, password: string, confirmPassword: string): Promise<boolean> {
    const imageIds = ["profile-images-one", "profile-images-two", "profile-images-three"];
    const images = imageIds.map(id => document.getElementById(id) as HTMLImageElement);

    if (!images.some(img => img.classList.contains("user-choice"))) {
        errorMessageLoginRegisterPage("Choose a profile picture!");
        return false;
    }

    const users = await getUsers();
    const usernameExists = Object.values(users).some((currUser: Users) => currUser.username === user);
    if (usernameExists) {
        errorMessageLoginRegisterPage("Username already exists!");
        return false;
    }

    if (password !== confirmPassword) {
        errorMessageLoginRegisterPage("Passwords need to match!");
        return false;
    }

    const errorMsgEl = document.getElementById("error-message") as HTMLParagraphElement;
    if (errorMsgEl) errorMsgEl.remove();

    return true;
}

function generateToken(): string {
    return Math.random().toString(36).substr(2);
}
