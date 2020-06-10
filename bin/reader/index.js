import { NativeModules } from 'react-native';
const { PSCode } = NativeModules;
export function readCodeFromUri(uri) {
  return PSCode.readFromUrl(uri);
}
