// api/admin/upload-image.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, del } from '@vercel/blob';
import { Buffer } from 'buffer'; // Import Buffer

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: IMPLEMENTAR AUTENTICAÇÃO E AUTORIZAÇÃO AQUI!
  // Verifique se o usuário é um administrador antes de permitir o upload.
  // Ex:
  // const isAdmin = await checkAdminAuth(req.headers.authorization);
  // if (!isAdmin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  if (req.method === 'POST') {
    try {
      const { filename, contentType, body: base64ImageData } = req.body;

      if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ error: 'Filename (string) is required.' });
      }
      if (!contentType || typeof contentType !== 'string') {
        return res.status(400).json({ error: 'ContentType (string) is required.' });
      }
      if (!base64ImageData || typeof base64ImageData !== 'string') {
        return res.status(400).json({ error: 'Image data (base64 string) is required in body.' });
      }

      // Remove o prefixo "data:image/...;base64," se estiver presente
      const base64Data = base64ImageData.startsWith('data:')
        ? base64ImageData.substring(base64ImageData.indexOf(',') + 1)
        : base64ImageData;

      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      // Sanitize filename or create a unique one.
      // Example: 'menu-items/my-image.png'. folder/filename.extension
      // Vercel Blob `put` by default adds a random suffix to the path to avoid collisions.
      // So, a simple path like `menu-items/${filename}` is generally fine.
      const blobPath = `menu-items/${Date.now()}-${filename.replace(/\s+/g, '-')}`;

      const blob = await put(blobPath, imageBuffer, {
        access: 'public', // Para que as imagens sejam publicamente acessíveis
        contentType: contentType, // O tipo MIME da imagem, ex: 'image/jpeg', 'image/png'
        // addRandomSuffix: true, // Padrão é true, o que é bom para evitar sobrescritas.
      });

      // `blob.url` será a URL pública da imagem no Vercel Blob
      return res.status(200).json({ url: blob.url, pathname: blob.pathname });

    } catch (error: any) {
      console.error('Error uploading to Vercel Blob:', error);
      return res.status(500).json({ error: error.message || 'Failed to upload image.' });
    }
  } else if (req.method === 'DELETE') {
    // TODO: Implementar autenticação e autorização para delete também
    try {
      const { url } = req.body; // Espera a URL completa do blob a ser deletado
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Blob URL (string) is required for deletion.' });
      }
      await del(url);
      return res.status(200).json({ message: 'Blob deleted successfully.' });
    } catch (error: any) {
      console.error('Error deleting from Vercel Blob:', error);
      return res.status(500).json({ error: error.message || 'Failed to delete image.' });
    }

  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}