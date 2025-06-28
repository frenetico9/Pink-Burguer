// api/admin/update-app-data.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import type { MenuItem, Coupon } from '../../types'; // Ajuste o caminho

const APP_DATA_BLOB_FILENAME = 'app_data.json';

interface AppDataPayload {
  menuItems: MenuItem[];
  coupons: Coupon[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[update-app-data] Received request. Method: ${req.method}, Headers: ${JSON.stringify(req.headers)}`);
  
  // Set CORS headers for all responses to be safe
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or your specific frontend origin
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-API-Secret');

  if (req.method === 'OPTIONS') {
    console.log('[update-app-data] Handling OPTIONS preflight request.');
    res.status(204).end();
    return;
  }

  if (req.method === 'POST') {
    console.log('[update-app-data] Handling POST request.');
    // 1. Autenticação (Simples - Chave Secreta)
    const clientSecret = req.headers['x-admin-api-secret'];
    const serverSecret = process.env.ADMIN_API_SECRET;

    if (!serverSecret) {
      console.error("[update-app-data] ADMIN_API_SECRET is not set in environment variables.");
      return res.status(500).json({ message: "Configuration error on server." });
    }
    if (!clientSecret || clientSecret !== serverSecret) {
      console.warn(`[update-app-data] Unauthorized access attempt. Client secret was ${clientSecret ? 'provided but incorrect' : 'missing'}.`);
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid API secret.' });
    }

    const { menuItems, coupons } = req.body as AppDataPayload;

    if (!Array.isArray(menuItems) || !Array.isArray(coupons)) {
      console.warn('[update-app-data] Invalid payload: menuItems and coupons must be arrays.');
      return res.status(400).json({ message: 'Invalid payload: menuItems and coupons must be arrays.' });
    }

    try {
      const dataToStore: AppDataPayload = {
        menuItems,
        coupons,
      };
      const jsonDataString = JSON.stringify(dataToStore, null, 2);

      console.log('[update-app-data] Attempting to save data to Blob...');
      const blob = await put(APP_DATA_BLOB_FILENAME, jsonDataString, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });

      console.log(`[update-app-data] App data successfully saved to Blob: ${blob.url}`);
      return res.status(200).json({ message: 'App data updated successfully.', url: blob.url });

    } catch (error: any) {
      console.error('[update-app-data] Error saving app data to Vercel Blob:', error);
      return res.status(500).json({ message: 'Failed to save app data.', error: error.message });
    }
  } else {
    console.warn(`[update-app-data] Method ${req.method} not allowed. This request will receive a 405.`);
    // The Allow header is already set at the top
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
