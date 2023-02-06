import { createModule, mutation, action } from "vuex-class-component";
import axios, { AxiosRequestConfig } from "axios"
import { UserClient } from '../clients/UserClient'
import { User } from '../types'
import { logAxiosError } from "@/clients/axiosErrorLogger";

const VuexModule = createModule({
  namespaced: "user",
  strict: false,
})

type UserLoginData = {
  email: string;
  password: string;
  rememberUser: boolean;
}

const LOCAL_STORAGE_TOKEN_KEY = "token";

export class UserStore extends VuexModule {

  public token: string | null = null;
  public user: User | null = null;
  public userIsAdmin = false;
  public users: User[] = [];
  public userMap: Map<number, User> = new Map<number, User>();

  private userClient = new UserClient();

  @action
  async initUserLogin(): Promise<void> {
    // set axios interceptor
    // TBD: find a more suitable location
    axios.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (this.token) {
          if (!config.headers) {
            config.headers = {}
          }
          config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return new Promise<void>((resolve) => {
      // log in user using token in localStorage if token was found
      const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      if (!storedToken) {
        resolve();
        return;
      }

      this.SET_TOKEN(storedToken);

      this.userClient.getLoggedInUser()
        .then((user: User | null) => {
          if (user === null) {

            this.SET_TOKEN(null);
            this.user = null;
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);

            console.log("Invalid token in local storage. Logged out user.");
          } else {
            this.SET_USER(user);
          }
          resolve();
        })
        .catch(() => {
          this.SET_TOKEN(null);
          localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
          this.user = null;

          console.log("Invalid token in local storage. Logged out user.");
          resolve()
        });
    });
  }

  @action
  async initUsers(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userClient.getUsers()
        .then((users) => {
          const userMap = new Map<number, User>();
          users.forEach((user) => {
            if(user.id && user.displayName) {
              userMap.set(user.id, user);
            }
          });

          this.SET_USERMAP(userMap);
          this.SET_USERS(users);
          resolve();
        })
        .catch((error) => {
          logAxiosError(error);
          reject(error);
        })
    })
  }

  @action
  async checkCredentials(userLoginData: UserLoginData): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.userClient.getUserToken(userLoginData.email, userLoginData.password)
        .then((token: string) => {
          // internally save token
          // this needs to be done before obtaining the logged in user because the internal token will
          // be used by the axios interceptor to set credentials
          this.SET_TOKEN(token);

          // save token in local storage if requested
          if (userLoginData.rememberUser) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
          }

          // query for details about logged in user
          this.userClient.getLoggedInUser()
            .then((user: User | null) => {
              if (user === null) {
                // reject with unknown error if no user was found
                reject("Unbekannter Fehler: Nach dem Login wurde kein gültiger Benutzer gefunden.")
              } else {
                // resolve otherwise
                this.SET_USER(user);
                resolve(user);
              }
            })
        })
        .catch((reason) => {
          reject(reason);
        })
    });
  }

  @action
  async refreshToken(): Promise<void> {
    if (this.user != null) {
      const newToken = await this.userClient.refreshUserToken();
      this.SET_TOKEN(newToken);

      const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      if (storedToken) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, newToken);
      }
    }
  }

  @action
  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    this.SET_TOKEN(null);
    this.SET_USER(null);
  }

  @mutation
  private SET_TOKEN(token: string | null) {
    this.token = token;
  }

  @mutation
  private SET_USER(user: User | null) {
    this.user = user;
    if (user) {
      if (user.roles?.has("ROLE_ADMIN")) {
        this.userIsAdmin = true;
      }
    } else {
      this.userIsAdmin = false;
    }
  }

  @mutation
  private SET_USERS(users: User[]) {
    this.users = users;
  }

  @mutation
  private SET_USERMAP(userMap: Map<number, User>) {
    this.userMap = userMap;
  }
}