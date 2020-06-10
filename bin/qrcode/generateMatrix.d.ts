import { QRCodeErrorCorrectionLevel } from 'qrcode';
export default function generateMatrix(
  value: string,
  errorCorrectionLevel: QRCodeErrorCorrectionLevel
): number[][];
