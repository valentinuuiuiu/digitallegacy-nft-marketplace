import { create } from 'ipfs-http-client';

// Create IPFS client with environment configuration
const ipfs = create({
  host: process.env.IPFS_HOST || 'ipfs.infura.io',
  port: process.env.IPFS_PORT || 5001,
  protocol: process.env.IPFS_PROTOCOL || 'https',
  headers: {
    authorization: process.env.IPFS_API_KEY 
      ? `Bearer ${process.env.IPFS_API_KEY}` 
      : undefined
  }
});

// Timeout utility for IPFS operations
function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('IPFS operation timed out'));
    }, ms);
    
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Upload data to IPFS with retries and timeout
 * @param {Buffer|string} data - Data to upload
 * @param {number} [timeout=30000] - Timeout in milliseconds
 * @param {number} [retries=3] - Number of retry attempts
 * @returns {Promise<string|null>} - IPFS CID or null on failure
 */
export async function uploadToIPFS(data, timeout = 30000, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { cid } = await timeoutPromise(
        timeout,
        ipfs.add(data)
      );
      
      return cid.toString();
    } catch (error) {
      console.error(`IPFS upload attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        return null;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

/**
 * Pin a CID to ensure persistence on IPFS
 * @param {string} cid - Content Identifier
 * @returns {Promise<boolean>} - Success status
 */
export async function pinToIPFS(cid) {
  try {
    await timeoutPromise(
      20000,
      ipfs.pin.add(cid)
    );
    return true;
  } catch (error) {
    console.error('IPFS pinning error:', error);
    return false;
  }
}