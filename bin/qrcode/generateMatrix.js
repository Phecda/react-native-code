import qrcode from 'qrcode';
export default function generateMatrix(value, errorCorrectionLevel) {
  const data = qrcode.create(value, { errorCorrectionLevel }).modules.data;
  data.slice(0);
  const arr = data;
  const sqrt = Math.sqrt(arr.length);
  const matrix = [];
  arr.forEach((v, index) => {
    if (index % sqrt === 0) {
      matrix.push([v]);
    } else {
      matrix[matrix.length - 1].push(v);
    }
  });
  return matrix;
}
