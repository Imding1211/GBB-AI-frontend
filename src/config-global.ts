import { paths } from 'src/routes/paths';

// AD
// export const AD_CLIENT_ID = '<AD_CLIENT_ID_PLACEHOLDER>';
// export const AD_REDIRECT_URI = '<AD_REDIRECT_URI_PLACEHOLDER>';

export const AD_CLIENT_ID = '90d0dbcf-c94d-4a5f-9220-ddd8219730ae';
export const AD_REDIRECT_URI = 'http://localhost:8080/';

// API
// export const BACKEND_API = '<BACKEND_API_PLACEHOLDER>';

export const BACKEND_API = 'https://app-gbbai-q9b4backend.azurewebsites.net/';

// GPT FUNCTION CALLING
// export const FUNCTION_API = '<FUNCTION_API_PLACEHOLDER>';
// export const TOOL_API = '<TOOL_API_PLACEHOLDER>';

export const FUNCTION_API = 'https://func-gbbai-q9b4funcall.azurewebsites.net/api/HttpExample/';
export const TOOL_API = 'https://ca-gbbai-q9b4-fun-call.calmhill-586fda9c.westus2.azurecontainerapps.io';

// ROOT PATH AFTER LOGIN SUCCESSFUL
// export const DEFAULT_PATH = paths.gbbai.function.root;

export const DEFAULT_PATH = paths.gbbai.workbench.root;