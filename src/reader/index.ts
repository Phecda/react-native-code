import { NativeModules } from 'react-native';

const { PSCode } = NativeModules;

export function readCodeFromUri(uri: string): Promise<string> {
  return PSCode.readFromUrl(uri);
}
