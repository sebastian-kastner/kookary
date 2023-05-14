import { User } from "../types";
import axios from "axios";
import { UserApi } from "../../rest/api/user-api";
import { clientConfiguration } from "./clientConfiguration";
import { convertUser, convertUsers } from "./ToViewModelConverter";
import { convertUserWrite } from "./ToRestModelConverter";
import { logAxiosError } from "./axiosErrorLogger";
import {
  AUTH_TOKEN_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
  ME_ENDPOINT,
} from "./endpoints";

export class UserClient {
  client = new UserApi(clientConfiguration);

  public async getUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      this.client
        .getUserCollection()
        .then((response) => {
          const apiUsers = response.data["hydra:member"];
          resolve(convertUsers(apiUsers));
        })
        .catch((e) => {
          logAxiosError(e);
          reject(e);
        });
    });
  }

  public async updateUser(user: User): Promise<void> {
    const apiUser = convertUserWrite(user);
    return new Promise<void>((resolve, reject) => {
      if (!user.id) {
        reject("Benutzer ID muss gesetzt sein");
        return;
      }
      const apiId = user.id.toString();

      this.client
        .patchUserItem(apiId, apiUser)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          logAxiosError(err);
          reject(err);
        });
    });
  }

  public async createUser(
    email: string,
    name: string,
    password: string
  ): Promise<User> {
    const user = convertUserWrite({
      email: email,
      displayName: name,
    });
    user.password = password;

    return new Promise<User>((resolve, reject) => {
      this.client
        .postUserCollection(user)
        .then((response) => {
          resolve(convertUser(response.data));
        })
        .catch((err) => {
          logAxiosError(err);
          reject(err);
        });
    });
  }

  public async deleteUser(userId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client
        .deleteUserItem(userId.toString())
        .then(() => {
          resolve();
        })
        .catch((err) => {
          logAxiosError(err);
          reject(err);
        });
    });
  }

  public async getLoggedInUser(): Promise<User | null> {
    // the token is not required here because it will be set by an axios interceptor
    return new Promise<User | null>((resolve, reject) => {
      axios
        .get(import.meta.env.VITE_APP_ROOT_API + ME_ENDPOINT, {})
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
          const errorTxt = this.logAndGetErrorMessage(error);
          reject(errorTxt);
        });
    });
  }

  public async getUserToken(email: string, password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios
        .post(import.meta.env.VITE_APP_ROOT_API + AUTH_TOKEN_ENDPOINT, {
          email: email,
          password: password,
        })
        .then((response) => {
          const token = response.data["token"];
          if (!token) {
            reject(
              "Received unexpected return value from authorization endpoint."
            );
          }
          resolve(token);
        })
        .catch((error) => {
          const errorTxt = this.logAndGetErrorMessage(error);
          reject(errorTxt);
        });
    });
  }

  public async refreshUserToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios
        .get(import.meta.env.VITE_APP_ROOT_API + REFRESH_TOKEN_ENDPOINT)
        .then((response) => {
          const token = response.data["token"];
          if (!token) {
            reject(
              "Received unexpected return value from authorization endpoint."
            );
          }
          resolve(token);
        })
        .catch((error) => {
          // do not pass on errors for refreshs
          const errorTxt = this.logAndGetErrorMessage(error);
          console.error(errorTxt);
        });
    });
  }

  public async changePassword(
    userId: number,
    newPassword: string,
    oldPassword?: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios
        .post(import.meta.env.VITE_APP_ROOT_API + "/api/change_password", {
          oldPassword: oldPassword,
          newPassword: newPassword,
          userId: userId,
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          const errorTxt = this.logAndGetErrorMessage(error);
          reject(errorTxt);
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
  private logAndGetErrorMessage(err: any): string {
    console.error(err);

    if (err.response && err.response.data) {
      const data = err.response.data;
      if (data.detail) {
        return data.detail;
      }
    }

    const retCode = this.getReturnCode(err);
    if (retCode == 401) {
      return "Ungültige Login Daten";
    } else if (retCode == 404) {
      return "Login nicht verfügbar";
    }

    return "Unerwarteter Fehler";
  }
}
