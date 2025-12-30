/**
 * Unit tests for UDADigestMessage module
 */

import { UDADigestMessage } from '../UDADigestMessage';

// Mock TextEncoder
class MockTextEncoder {
    encode(text: string): Uint8Array {
        // Simple encoding: convert each character to its char code
        const encoded = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
            encoded[i] = text.charCodeAt(i) & 0xff;
        }
        return encoded;
    }
}

// Mock the crypto.subtle API
const mockDigest = jest.fn();

// Setup global mocks before tests
beforeAll(() => {
    (global as any).TextEncoder = MockTextEncoder;
    Object.defineProperty(global, 'crypto', {
        value: {
            subtle: {
                digest: mockDigest
            }
        },
        configurable: true
    });
});

afterAll(() => {
    delete (global as any).TextEncoder;
});

describe('UDADigestMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should encode text message using TextEncoder', async () => {
        const mockHashBuffer = new Uint8Array([0xab, 0xcd, 0xef]).buffer;
        mockDigest.mockResolvedValue(mockHashBuffer);

        await UDADigestMessage('test message', 'SHA-256');

        expect(mockDigest).toHaveBeenCalledWith(
            'SHA-256',
            expect.any(Uint8Array)
        );
    });

    it('should return a hexadecimal string hash', async () => {
        const mockHashBuffer = new Uint8Array([0xab, 0xcd, 0xef]).buffer;
        mockDigest.mockResolvedValue(mockHashBuffer);

        const result = await UDADigestMessage('test', 'SHA-256');

        expect(result).toBe('abcdef');
    });

    it('should pad single-digit hex values with leading zero', async () => {
        const mockHashBuffer = new Uint8Array([0x01, 0x0a, 0xff]).buffer;
        mockDigest.mockResolvedValue(mockHashBuffer);

        const result = await UDADigestMessage('test', 'SHA-256');

        expect(result).toBe('010aff');
    });

    it('should use SHA-512 algorithm when specified', async () => {
        const mockHashBuffer = new Uint8Array([0x12, 0x34]).buffer;
        mockDigest.mockResolvedValue(mockHashBuffer);

        await UDADigestMessage('password', 'SHA-512');

        expect(mockDigest).toHaveBeenCalledWith(
            'SHA-512',
            expect.any(Uint8Array)
        );
    });

    it('should handle empty string input', async () => {
        const mockHashBuffer = new Uint8Array([0x00]).buffer;
        mockDigest.mockResolvedValue(mockHashBuffer);

        const result = await UDADigestMessage('', 'SHA-256');

        expect(result).toBe('00');
    });

    it('should handle unicode characters in message', async () => {
        const mockHashBuffer = new Uint8Array([0xde, 0xad, 0xbe, 0xef]).buffer;
        mockDigest.mockResolvedValue(mockHashBuffer);

        const result = await UDADigestMessage('こんにちは', 'SHA-256');

        expect(mockDigest).toHaveBeenCalled();
        expect(result).toBe('deadbeef');
    });

    it('should convert non-string input to string', async () => {
        const mockHashBuffer = new Uint8Array([0xaa, 0xbb]).buffer;
        mockDigest.mockResolvedValue(mockHashBuffer);

        const result = await UDADigestMessage(12345, 'SHA-256');

        expect(result).toBe('aabb');
    });

    it('should handle long input strings', async () => {
        const longString = 'a'.repeat(10000);
        const mockHashBuffer = new Uint8Array([0x11, 0x22, 0x33, 0x44]).buffer;
        mockDigest.mockResolvedValue(mockHashBuffer);

        const result = await UDADigestMessage(longString, 'SHA-256');

        expect(mockDigest).toHaveBeenCalled();
        expect(result).toBe('11223344');
    });

    it('should propagate errors from crypto.subtle.digest', async () => {
        const digestError = new Error('Digest failed');
        mockDigest.mockRejectedValue(digestError);

        await expect(UDADigestMessage('test', 'INVALID')).rejects.toThrow('Digest failed');
    });
});
