import { Configuration } from "../../rest/configuration";

export const clientConfiguration = new Configuration({
  basePath: import.meta.env.VITE_APP_ROOT_API
});
