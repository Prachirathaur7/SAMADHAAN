import { createRoot } from 'react-dom/client';

import App from './App';
import { setBaseUrl } from '@workspace/api-client-react';

import './index.css';

// In production the SPA is hosted separately from the API. Leave this unset
// for same-origin local development and allow Netlify to supply it at build time.
setBaseUrl(import.meta.env.VITE_API_BASE_URL?.trim() || null);

createRoot(document.getElementById('root')!).render(<App />);
