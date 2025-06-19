
// End-to-End Encryption utilities using WebCrypto API
export class E2EECrypto {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;

  // Generate a new encryption key pair
  static async generateKeyPair(): Promise<CryptoKeyPair> {
    return await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey', 'deriveBits']
    );
  }

  // Generate a symmetric key for message encryption
  static async generateSymmetricKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Derive shared secret from key exchange
  static async deriveSharedKey(
    privateKey: CryptoKey,
    publicKey: CryptoKey
  ): Promise<CryptoKey> {
    const sharedSecret = await crypto.subtle.deriveBits(
      {
        name: 'ECDH',
        public: publicKey
      },
      privateKey,
      256
    );

    return await crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: this.ALGORITHM },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt message with symmetric key
  static async encryptMessage(
    message: string,
    key: CryptoKey
  ): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv: iv
      },
      key,
      data
    );

    return { encryptedData, iv };
  }

  // Decrypt message with symmetric key
  static async decryptMessage(
    encryptedData: ArrayBuffer,
    key: CryptoKey,
    iv: Uint8Array
  ): Promise<string> {
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv: iv
      },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }

  // Export key to raw format for storage
  static async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return await crypto.subtle.exportKey('raw', key);
  }

  // Import key from raw format
  static async importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: this.ALGORITHM },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Export public key for sharing
  static async exportPublicKey(keyPair: CryptoKeyPair): Promise<ArrayBuffer> {
    return await crypto.subtle.exportKey('raw', keyPair.publicKey);
  }

  // Import public key from raw format
  static async importPublicKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      false,
      []
    );
  }

  // Generate message authentication code
  static async generateMAC(message: string, key: CryptoKey): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const macKey = await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: new Uint8Array(),
        info: encoder.encode('MAC')
      },
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    return await crypto.subtle.sign('HMAC', macKey, data);
  }
}
