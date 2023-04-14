// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(err: any): string {
  if (err.isAxiosError) {
    const response = err.response;
    if (response) {
      const errorDetails = response.data['hydra:description'];
      const statusCode = response.status;
      if (errorDetails && statusCode) {
        return errorDetails + "(Status: " + statusCode + ")";
      } else if (errorDetails) {
        return errorDetails;
      } else if (statusCode) {
        return "Unbekannter Fehler (Status: " + statusCode + ")";
      }
    }
    const errorDetails = err.response?.data['hydra:description'];
    if (errorDetails) {
      return errorDetails;
    }
  } else if (typeof err === 'string') {
    return err;
  }

  return "Unbekannter Fehler";
}