import { Configuration } from "../../rest/configuration";

export const clientConfiguration = new Configuration({
  basePath: process.env.VUE_APP_ROOT_API,
});
