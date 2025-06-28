// api/app-data.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
// Original line: import { head, list, download } from '@vercel/blob';
// FIX: Removed 'download' as it's not an exported member. Content will be fetched via the blob's URL.
import { head, list } from '@vercel/blob';
import { CONST_INITIAL_MENU_ITEMS, CONST_AVAILABLE_BORDAS, CONST_AVAILABLE_COUPONS } from '../constants'; // Ajuste o caminho se necessário
import type { MenuItem, Coupon } from '../types';

const APP_DATA_BLOB_FILENAME = 'app_data.json';
// A URL completa para o blob seria `https://<seu-blob-store-id>.public.blob.vercel-storage.com/${APP_DATA_BLOB_FILENAME}`
// Mas para `list` e `head`, apenas o pathname é necessário.

interface AppData {
  menuItems: MenuItem[];
  coupons: Coupon[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      let blobUrl = '';

      // Tenta encontrar o arquivo no blob store.
      // `list()` pode ser usado se você não souber a URL exata ou para verificar existência
      // `head(pathname)` é mais direto se você sabe o pathname
      const blobList = await list({ prefix: APP_DATA_BLOB_FILENAME, limit: 1 });
      if (blobList.blobs.length > 0 && blobList.blobs[0].pathname === APP_DATA_BLOB_FILENAME) {
         blobUrl = blobList.blobs[0].url;
      }

      if (blobUrl) {
        console.log(`Found ${APP_DATA_BLOB_FILENAME} at ${blobUrl}, attempting to download.`);
        // Se encontrou, faz o download do conteúdo
        // FIX: Replace 'download(blobUrl)' with 'fetch(blobUrl)'
        const response = await fetch(blobUrl);
        if (!response.ok) {
          throw new Error(`Failed to download blob from ${blobUrl}: ${response.status} ${response.statusText}`);
        }
        const blobText = await response.text();
        const appData: AppData = JSON.parse(blobText);
        
        // Validação básica para garantir que os arrays existem
        if (!Array.isArray(appData.menuItems)) appData.menuItems = [];
        if (!Array.isArray(appData.coupons)) appData.coupons = [];

        return res.status(200).json(appData);

      } else {
        // Se não encontrar o arquivo no Blob, retorna os dados mock/padrão de constants.tsx
        console.log(`${APP_DATA_BLOB_FILENAME} not found in Blob store. Returning default constant data.`);
        const defaultData: AppData = {
          menuItems: [...CONST_INITIAL_MENU_ITEMS, ...CONST_AVAILABLE_BORDAS],
          coupons: CONST_AVAILABLE_COUPONS,
        };
        return res.status(200).json(defaultData);
      }
    } catch (error: any) {
      // Se houver um erro específico do Blob (ex: arquivo não encontrado após 'head' ou erro de download)
      // ou erro de parsing do JSON, também retorna os dados padrão.
      console.error(`Error fetching or parsing ${APP_DATA_BLOB_FILENAME} from Blob:`, error.message);
      console.log('Returning default constant data due to error.');
      const defaultData: AppData = {
        menuItems: [...CONST_INITIAL_MENU_ITEMS, ...CONST_AVAILABLE_BORDAS],
        coupons: CONST_AVAILABLE_COUPONS,
      };
      // Não enviar 500 para o cliente se pudermos fornecer dados padrão.
      // Um erro 500 aqui impediria o app de carregar.
      return res.status(200).json(defaultData); 
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}