import { User } from "../model/user.model";
import { plainToClass } from "class-transformer";
import { Base64 } from "js-base64";

class AuthenticationService {
    /**
     * Checks if the user is logged in
     */
    key = "investment_bot_124@45";
    IsAuthenticated(): Boolean {
        return localStorage.getItem(this.key) ? true : false;
    }

    /**
     * Saves user object and token to localStorage
     * @param user user object to save
     * @param token generated token from server
     */
    Login(user: any, token: string): boolean {
        if (user && token) {
            // convert to string
            const objJson = JSON.stringify({ user, token });
            //encrypt json string
            const encrypted = Base64.encode(objJson);
            // write data
            localStorage.setItem(this.key, encrypted);
            return true;
        }
        return false;
    }

    Logout(): boolean {
        if (localStorage.getItem(this.key)) {
            localStorage.removeItem(this.key);
            return true;
        }
        return false;
    }

    GetUser(): User {
        // get encrypted data
        const encrypted = localStorage.getItem(this.key);
        // decrypt data
        const rawString = Base64.decode(encrypted || "");
        if (rawString) {
            const { user } = JSON.parse(rawString);
            const _user = plainToClass(User, user);
            return _user;
        }
        return new User();
    }

    GetToken(): string {
        // get encrypted data
        const encrypted = localStorage.getItem(this.key);
        // decrypt data
        const rawString = Base64.decode(encrypted || "");
        if (rawString) {
            const { token } = JSON.parse(rawString);
            return token;
        }
        return "";
    }
}
export const authService = new AuthenticationService();
