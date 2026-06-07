import { env } from '$env/dynamic/public';
import { normalizeApiBaseUrl } from './api-url';

export const API_BASE_URL = normalizeApiBaseUrl(env.PUBLIC_API_BASE_URL);
