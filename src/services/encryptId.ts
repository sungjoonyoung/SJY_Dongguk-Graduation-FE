import CryptoJS from 'crypto-js';

/**
 * 학번을 SHA256으로 암호화하여 앞 12자리를 반환합니다.
 * @param studentId 원본 학번
 * @returns 암호화된 ID (12자)
 */
export function encryptId(studentId: string): string {
  const hash = CryptoJS.SHA256(studentId).toString(CryptoJS.enc.Hex);
  return hash.substring(0, 12);
}
