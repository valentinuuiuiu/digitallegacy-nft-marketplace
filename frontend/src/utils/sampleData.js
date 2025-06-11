// Sample NFT data extracted from ui.html for demo purposes
class SampleDataService {
    constructor() {
        this.sampleNFTs = [
            {
                tokenId: '1001',
                name: 'Cyberpunk Cityscape',
                description: 'Futuristic city visualization perfect for game backgrounds, book covers, and tech branding.',
                image: 'https://picsum.photos/400/400?random=1001',
                fallbackImage: 'https://source.unsplash.com/400x400/?digital-art',
                patternClass: 'nft-pattern-1',
                price: '2.1',
                creator: '0x742d35Cc6634C0532925a3b8D5C9E3608d34b2Ac',
                owner: '0x742d35Cc6634C0532925a3b8D5C9E3608d34b2Ac',
                creatorName: '@neon_artist',
                creatorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                category: 'digital-art',
                licensessold: 12,
                totalEarnings: '$1,450',
                attributes: [
                    { trait_type: 'Category', value: 'Digital Art' },
                    { trait_type: 'Style', value: 'Cyberpunk' },
                    { trait_type: 'Resolution', value: '4K' },
                    { trait_type: 'License Type', value: 'Commercial' }
                ],
                isForSale: true,
                mintedAt: new Date(2024, 5, 1),
                metadata: {
                    external_url: 'https://digitalllegacy.com/nft/1001',
                    animation_url: null,
                    youtube_url: null
                }
            },
            {
                tokenId: '1002',
                name: 'Abstract Vibrance',
                description: 'Bold abstract piece ideal for magazine features, wall art prints, and home decor.',
                image: 'https://picsum.photos/400/400?random=1002',
                fallbackImage: 'https://source.unsplash.com/400x400/?abstract-art',
                patternClass: 'nft-pattern-2',
                price: '1.5',
                creator: '0x8ba1f109551bD432803012645Hac136c5c00f3c7',
                owner: '0x8ba1f109551bD432803012645Hac136c5c00f3c7',
                creatorName: '@abstractvision',
                creatorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                category: 'abstract',
                licensesold: 8,
                totalEarnings: '$890',
                attributes: [
                    { trait_type: 'Category', value: 'Abstract Art' },
                    { trait_type: 'Style', value: 'Modern' },
                    { trait_type: 'Color Palette', value: 'Vibrant' },
                    { trait_type: 'Medium', value: 'Digital' }
                ],
                isForSale: true,
                mintedAt: new Date(2024, 4, 15),
                metadata: {
                    external_url: 'https://digitalllegacy.com/nft/1002',
                    animation_url: null,
                    youtube_url: null
                }
            },
            {
                tokenId: '1003',
                name: 'Cosmic Harmony',
                description: 'Celestial artwork used by meditation apps, album covers, and spiritual brands.',
                image: 'https://picsum.photos/400/400?random=1003',
                patternClass: 'nft-pattern-3',
                price: '3.7',
                creator: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
                owner: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
                creatorName: '@stella_art',
                creatorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
                category: 'cosmic',
                licensesold: 21,
                totalEarnings: '$2,730',
                attributes: [
                    { trait_type: 'Category', value: 'Cosmic Art' },
                    { trait_type: 'Style', value: 'Surreal' },
                    { trait_type: 'Theme', value: 'Spiritual' },
                    { trait_type: 'Usage', value: 'Meditation' }
                ],
                isForSale: true,
                mintedAt: new Date(2024, 3, 20),
                metadata: {
                    external_url: 'https://digitalllegacy.com/nft/1003',
                    animation_url: null,
                    youtube_url: null
                }
            },
            {
                tokenId: '1004',
                name: 'Digital Dreamscape',
                description: 'Ethereal digital landscape perfect for fantasy games, book illustrations, and immersive experiences.',
                image: 'https://picsum.photos/400/400?random=1004',
                patternClass: 'nft-pattern-4',
                price: '4.2',
                creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                creatorName: '@dream_weaver',
                creatorAvatar: 'https://randomuser.me/api/portraits/women/12.jpg',
                category: 'fantasy',
                licensesold: 15,
                totalEarnings: '$3,200',
                attributes: [
                    { trait_type: 'Category', value: 'Fantasy Art' },
                    { trait_type: 'Style', value: 'Dreamlike' },
                    { trait_type: 'Environment', value: 'Landscape' },
                    { trait_type: 'Mood', value: 'Ethereal' }
                ],
                isForSale: true,
                mintedAt: new Date(2024, 2, 10),
                metadata: {
                    external_url: 'https://digitalllegacy.com/nft/1004',
                    animation_url: null,
                    youtube_url: null
                }
            },
            {
                tokenId: '1005',
                name: 'Neon Genesis',
                description: 'High-energy digital art with vibrant neon colors, perfect for music videos, club visuals, and tech startups.',
                image: 'https://picsum.photos/400/400?random=1005',
                patternClass: 'nft-pattern-5',
                price: '2.8',
                creator: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                owner: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                creatorName: '@neon_prophet',
                creatorAvatar: 'https://randomuser.me/api/portraits/men/12.jpg',
                category: 'neon',
                licensesold: 18,
                totalEarnings: '$1,980',
                attributes: [
                    { trait_type: 'Category', value: 'Neon Art' },
                    { trait_type: 'Style', value: 'Futuristic' },
                    { trait_type: 'Energy', value: 'High' },
                    { trait_type: 'Usage', value: 'Music Industry' }
                ],
                isForSale: true,
                mintedAt: new Date(2024, 1, 5),
                metadata: {
                    external_url: 'https://digitalllegacy.com/nft/1005',
                    animation_url: null,
                    youtube_url: null
                }
            },
            {
                tokenId: '1006',
                name: 'Minimalist Zen',
                description: 'Clean, minimalist artwork ideal for wellness brands, meditation apps, and modern interior design.',
                image: 'https://picsum.photos/400/400?random=1006',
                patternClass: 'nft-pattern-6',
                price: '1.2',
                creator: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
                owner: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
                creatorName: '@zen_creator',
                creatorAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
                category: 'minimalist',
                licensesold: 25,
                totalEarnings: '$2,100',
                attributes: [
                    { trait_type: 'Category', value: 'Minimalist Art' },
                    { trait_type: 'Style', value: 'Clean' },
                    { trait_type: 'Mood', value: 'Peaceful' },
                    { trait_type: 'Application', value: 'Wellness' }
                ],
                isForSale: true,
                mintedAt: new Date(2024, 0, 20),
                metadata: {
                    external_url: 'https://digitalllegacy.com/nft/1006',
                    animation_url: null,
                    youtube_url: null
                }
            }
        ];
    }

    // Get all sample NFTs
    getAllSampleNFTs() {
        return [...this.sampleNFTs];
    }

    // Get NFTs for sale (marketplace)
    getSampleNFTsForSale() {
        return this.sampleNFTs.filter(nft => nft.isForSale);
    }

    // Get NFTs owned by a specific address (profile)
    getSampleNFTsByOwner(ownerAddress) {
        if (!ownerAddress) return [];
        return this.sampleNFTs.filter(nft => 
            nft.owner.toLowerCase() === ownerAddress.toLowerCase() ||
            nft.creator.toLowerCase() === ownerAddress.toLowerCase()
        );
    }

    // Get a specific NFT by token ID
    getSampleNFTById(tokenId) {
        return this.sampleNFTs.find(nft => nft.tokenId === tokenId);
    }

    // Simulate buying an NFT
    buySampleNFT(tokenId, buyerAddress) {
        const nft = this.getSampleNFTById(tokenId);
        if (nft && nft.isForSale) {
            nft.owner = buyerAddress;
            nft.isForSale = false;
            return true;
        }
        return false;
    }

    // Get sample statistics
    getSampleStats() {
        const totalNFTs = this.sampleNFTs.length;
        const totalValue = this.sampleNFTs.reduce((sum, nft) => sum + parseFloat(nft.price), 0);
        const uniqueCreators = new Set(this.sampleNFTs.map(nft => nft.creator)).size;
        
        return {
            totalNFTs,
            totalValue: totalValue.toFixed(2),
            uniqueCreators,
            categories: [...new Set(this.sampleNFTs.map(nft => nft.category))]
        };
    }

    // Demo user functionality
    setDemoUser(address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266') {
        // Simulate connecting a demo wallet
        window.userAddress = address;
        window.isDemoMode = true;
        
        // Update UI to show connected state
        const connectButton = document.querySelector('.connect-wallet-btn');
        if (connectButton) {
            connectButton.textContent = 'Demo Wallet Connected';
            connectButton.classList.add('bg-green-600');
        }
        
        // Trigger wallet connection event
        if (window.onWalletConnected) {
            window.onWalletConnected(address);
        }
        
        return address;
    }

    // Get demo user's NFTs (mix of owned and created)
    getDemoUserNFTs() {
        const demoAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        return this.getSampleNFTsByOwner(demoAddress);
    }
}

// Create global instance
window.sampleDataService = new SampleDataService();
