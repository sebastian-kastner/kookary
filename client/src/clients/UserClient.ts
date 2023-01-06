import { User } from '../types'
import axios from "axios";

export class UserClient {

  public async getLoggedInUser(): Promise<User | null> {
    // the token is not required here because it will be set by an axios interceptor
    return new Promise<User | null>((resolve, reject) => {
      axios
        .get(process.env.VUE_APP_ROOT_API + "/api/me", {})
        .then((response) => {
          const data = response.data;
          resolve({
            id: data["id"],
            roles: new Set(data["roles"]),
            email: data["email"],
            displayName: data["displayname"],
          });
        })
        .catch((error) => {
          const retCode = this.getReturnCode(error);
          if (retCode == 401) {
            reject("Ungültige Login Daten");
          } else if (retCode == 404) {
            reject("Login nicht verfügbar");
          } else {
            reject("Unbekannter Fehler");
          }
        });
    });
  }

  public async getUserToken(email: string, password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios
        .post(process.env.VUE_APP_ROOT_API + "/api/auth_token", {
          email: email,
          password: password,
        })
        .then((response) => {
          const token = response.data["token"];
          if (!token) {
            reject("Received unexpected return value from authorization endpoint.")
          }
          resolve(token);
        })
        .catch((error) => {
          const retCode = this.getReturnCode(error);
          if (retCode == 401) {
            reject("Ungültige Login Daten");
          } else if (retCode == 404) {
            reject("Login nicht verfügbar");
          } else {
            reject("Unbekannter Fehler");
          }
        });
    });
  }

  public async changePassword(oldPassword: string, newPassword: string, userId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios
        .post(process.env.VUE_APP_ROOT_API + "/api/change_password", {
          oldPassword: oldPassword,
          newPassword: newPassword,
          userId: userId,
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          const errorTxt = this.getErrorMessage(error);
          if (!errorTxt) {
            reject("Unbekannter Fehler beim Ändern des Passworts");
          } else {
            reject(errorTxt);
          } 
        });
    });
  }

  // eslint-disable-next-line
  private getReturnCode(err: any): number | null {
    if (err.response) {
      if (err.response.status) {
        return err.response.status;
      }
    }
    return null;
  }

  // eslint-disable-next-line
  private getErrorMessage(err: any): string | null {
    if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.detail) {
          return data.detail;
        }
    }
    return null;
  }

}