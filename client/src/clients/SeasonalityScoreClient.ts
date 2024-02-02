import axios from "axios";
import { logAxiosError } from "./axiosErrorLogger";
import {
    SEASONALITY_UPDATE_ENDPOINT,
} from "./endpoints";

export class SeasonalityScoreClient {
  public async updateSeasonality(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios
        .get(import.meta.env.VITE_APP_ROOT_API + SEASONALITY_UPDATE_ENDPOINT, {})
        .then(() => {
          resolve();
        })
        .catch((error) => {
          const errorTxt = logAxiosError(error);
          reject(errorTxt);
        });
    });
  }
}
