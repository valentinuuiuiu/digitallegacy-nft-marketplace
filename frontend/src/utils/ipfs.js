// IPFS Integration Service
class IPFSService {
    constructor() {
        // Using Pinata as IPFS provider (you can replace with your preferred service)
        this.pinataApiKey = ''; // Add your Pinata API key
        this.pinataSecretKey = ''; // Add your Pinata secret key
        this.ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
        
        // For demo purposes, we'll use a mock upload service
        this.useMockService = true;
    }

    async uploadFile(file) {
        if (this.useMockService) {
            return this.mockUpload(file);
        }
        
        if (!this.pinataApiKey || !this.pinataSecretKey) {
            throw new Error('IPFS service not configured. Please add your Pinata API credentials.');
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: {
                    'pinata_api_key': this.pinataApiKey,
                    'pinata_secret_api_key': this.pinataSecretKey
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`IPFS upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result.IpfsHash;
        } catch (error) {
            console.error('IPFS upload error:', error);
            throw new Error('Failed to upload file to IPFS: ' + error.message);
        }
    }

    async uploadJSON(jsonData) {
        if (this.useMockService) {
            return this.mockUploadJSON(jsonData);
        }

        if (!this.pinataApiKey || !this.pinataSecretKey) {
            throw new Error('IPFS service not configured. Please add your Pinata API credentials.');
        }

        try {
            const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': this.pinataApiKey,
                    'pinata_secret_api_key': this.pinataSecretKey
                },
                body: JSON.stringify({
                    pinataContent: jsonData
                })
            });

            if (!response.ok) {
                throw new Error(`IPFS metadata upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            return result.IpfsHash;
        } catch (error) {
            console.error('IPFS JSON upload error:', error);
            throw new Error('Failed to upload metadata to IPFS: ' + error.message);
        }
    }

    // Mock service for demo purposes
    async mockUpload(file) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate a mock IPFS hash
        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 47);
        console.log('Mock IPFS upload:', file.name, '-> Hash:', mockHash);
        
        return mockHash;
    }

    async mockUploadJSON(jsonData) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate a mock IPFS hash for metadata
        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 47);
        console.log('Mock IPFS metadata upload:', JSON.stringify(jsonData, null, 2), '-> Hash:', mockHash);
        
        return mockHash;
    }

    // Convert IPFS hash to HTTP URL
    getHttpUrl(ipfsHash) {
        if (ipfsHash.startsWith('ipfs://')) {
            return ipfsHash.replace('ipfs://', this.ipfsGateway);
        }
        return this.ipfsGateway + ipfsHash;
    }

    // Fetch metadata from IPFS
    async fetchMetadata(ipfsHash) {
        try {
            const url = this.getHttpUrl(ipfsHash);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch metadata: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching metadata from IPFS:', error);
            throw error;
        }
    }
}

// Global IPFS service instance
window.ipfsService = new IPFSService();

// Metadata Schema for NFTs
class NFTMetadata {
    constructor({
        name,
        description,
        image,
        external_url = '',
        attributes = [],
        background_color = '',
        animation_url = '',
        youtube_url = ''
    }) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.external_url = external_url;
        this.attributes = attributes;
        this.background_color = background_color;
        this.animation_url = animation_url;
        this.youtube_url = youtube_url;
        
        // Add creation timestamp
        this.created_date = new Date().toISOString();
    }

    // Add attribute to metadata
    addAttribute(trait_type, value, display_type = null) {
        const attribute = { trait_type, value };
        if (display_type) {
            attribute.display_type = display_type;
        }
        this.attributes.push(attribute);
    }

    // Convert to JSON for IPFS upload
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            image: this.image,
            external_url: this.external_url,
            attributes: this.attributes,
            background_color: this.background_color,
            animation_url: this.animation_url,
            youtube_url: this.youtube_url,
            created_date: this.created_date
        };
    }

    // Validate metadata structure
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim() === '') {
            errors.push('Name is required');
        }
        
        if (!this.description || this.description.trim() === '') {
            errors.push('Description is required');
        }
        
        if (!this.image || this.image.trim() === '') {
            errors.push('Image is required');
        }
        
        // Validate attributes format
        this.attributes.forEach((attr, index) => {
            if (!attr.trait_type || !attr.value) {
                errors.push(`Attribute ${index + 1} must have trait_type and value`);
            }
        });
        
        return errors;
    }
}

// Export for use in other modules
window.NFTMetadata = NFTMetadata;
