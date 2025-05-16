import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as QRCode from 'qrcode';
import sharp from 'sharp';
import { promises as fs } from 'fs';

@Injectable()
export class QrService {
  async generateQrWithLogo(url: string, fileName: string): Promise<string> {
    const qrSize = 500;
    const logoSize = 100;

    // 1. Generar QR
    const qrBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'H',
      type: 'png',
      scale: 10,
      width: qrSize,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // 2. Preparar logo con fondo blanco (padding)
    const logoPath = join(process.cwd(), 'assets', 'logo.jpeg');
    const logoPadded = await sharp(logoPath)
      .resize(logoSize - 20, logoSize - 20)
      .extend({
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
        background: '#FFFFFF',
      })
      .trim()
      .png()
      .toBuffer();

    // 3. Posición centrada exacta
    const top = Math.floor((qrSize - logoSize) / 2);
    const left = Math.floor((qrSize - logoSize) / 2);

    const finalImage = await sharp(qrBuffer)
      .composite([{ input: logoPadded, top, left }])
      .png()
      .toBuffer();

    // 4. Guardar
    const outputPath = join(process.cwd(), 'public', `${fileName}.png`);
    await fs.writeFile(outputPath, finalImage);

    return `/${fileName}.png`;
  }
}
