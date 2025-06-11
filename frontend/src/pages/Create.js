class CreateNFTPage {
    constructor() {
        this.fileInput = null;
        this.previewImage = null;
        this.uploadedFile = null;
    }

    render() {
        const content = `
        <div class="min-h-screen bg-gray-900 pt-20 pb-12">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-gray-800 rounded-lg shadow-xl p-6">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-2xl font-bold text-white">Create New NFT</h2>
                        <div class="flex items-center space-x-4">
                            ${!userAddress ? `
                                <div class="flex items-center space-x-2 text-yellow-400">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <span class="text-sm">Connect wallet to continue</span>
                                </div>
                            ` : `
                                <div class="flex items-center space-x-2 text-green-400">
                                    <i class="fas fa-check-circle"></i>
                                    <span class="text-sm">Wallet connected</span>
                                </div>
                            `}
                        </div>
                    </div>
                    
                    ${!userAddress ? `
                        <div class="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg p-4 mb-6">
                            <div class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-yellow-400 mr-3"></i>
                                <div>
                                    <h3 class="text-yellow-300 font-medium">Wallet Connection Required</h3>
                                    <p class="text-yellow-200 text-sm">Please connect your wallet to create NFTs. Click the "Connect Wallet" button in the navigation bar.</p>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <form id="createNFTForm" class="space-y-6" ${!userAddress ? 'style="pointer-events: none; opacity: 0.6;"' : ''}>
                        <!-- File Upload -->
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">
                                NFT File *
                            </label>
                            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md hover:border-purple-500 transition-colors">
                                <div class="space-y-1 text-center">
                                    <div id="previewContainer" class="hidden mb-4">
                                        <img id="preview" src="" alt="Preview" class="mx-auto h-32 w-32 object-cover rounded-lg">
                                    </div>
                                    <div class="flex text-sm text-gray-400">
                                        <label for="file-upload" class="relative cursor-pointer bg-gray-900 rounded-md font-medium text-purple-500 hover:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*,video/*,audio/*">
                                        </label>
                                        <p class="pl-1">or drag and drop</p>
                                    </div>
                                    <p class="text-xs text-gray-500">
                                        PNG, JPG, GIF, MP4, MP3, WAV up to 10MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Name -->
                        <div>
                            <label for="nftName" class="block text-sm font-medium text-gray-300 mb-2">
                                Name *
                            </label>
                            <input type="text" id="nftName" required minlength="3" maxlength="100"
                                placeholder="Enter NFT name (at least 3 characters)"
                                class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                        </div>

                        <!-- Description -->
                        <div>
                            <label for="nftDescription" class="block text-sm font-medium text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea id="nftDescription" rows="4" required minlength="10" maxlength="1000"
                                placeholder="Describe your NFT (at least 10 characters)"
                                class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-none"></textarea>
                            <p class="text-xs text-gray-500 mt-1">Characters: <span id="descriptionCount">0</span>/1000</p>
                        </div>

                        <!-- Category -->
                        <div>
                            <label for="nftCategory" class="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <select id="nftCategory" required
                                class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                                <option value="">Select a category</option>
                                <option value="art">Art</option>
                                <option value="music">Music</option>
                                <option value="video">Video</option>
                                <option value="document">Document</option>
                                <option value="collectible">Collectible</option>
                                <option value="utility">Utility</option>
                            </select>
                        </div>

                        <!-- Price -->
                        <div>
                            <label for="nftPrice" class="block text-sm font-medium text-gray-300 mb-2">
                                Price (ETH) *
                            </label>
                            <div class="relative">
                                <input type="number" id="nftPrice" step="0.001" min="0.001" required
                                    placeholder="0.001"
                                    class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span class="text-gray-400 text-sm">ETH</span>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Minimum price: 0.001 ETH</p>
                        </div>

                        <!-- Royalty -->
                        <div>
                            <label for="nftRoyalty" class="block text-sm font-medium text-gray-300 mb-2">
                                Royalty Percentage (%)
                            </label>
                            <input type="number" id="nftRoyalty" min="0" max="10" step="0.1" placeholder="0"
                                class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                            <p class="text-xs text-gray-500 mt-1">Royalty you'll receive from future sales (0-10%)</p>
                        </div>

                        <!-- Submit Button -->
                        <div class="pt-4">
                            <button type="submit" ${!userAddress ? 'disabled' : ''}
                                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <i class="fas fa-plus mr-2"></i>
                                Create NFT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;

        document.getElementById('main').innerHTML = content;
        this.attachEventListeners();
        this.setupFormValidation();
    }

    setupFormValidation() {
        // Character counter for description
        const descriptionInput = document.getElementById('nftDescription');
        const descriptionCount = document.getElementById('descriptionCount');
        
        if (descriptionInput && descriptionCount) {
            descriptionInput.addEventListener('input', () => {
                descriptionCount.textContent = descriptionInput.value.length;
                
                // Color coding for character count
                if (descriptionInput.value.length < 10) {
                    descriptionCount.classList.add('text-red-400');
                    descriptionCount.classList.remove('text-green-400', 'text-gray-500');
                } else if (descriptionInput.value.length > 900) {
                    descriptionCount.classList.add('text-yellow-400');
                    descriptionCount.classList.remove('text-green-400', 'text-gray-500');
                } else {
                    descriptionCount.classList.add('text-green-400');
                    descriptionCount.classList.remove('text-red-400', 'text-yellow-400', 'text-gray-500');
                }
            });
        }
        
        // Real-time name validation
        const nameInput = document.getElementById('nftName');
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                if (nameInput.value.length > 0 && nameInput.value.length < 3) {
                    nameInput.classList.add('border-red-500');
                    nameInput.classList.remove('border-gray-600', 'border-green-500');
                } else if (nameInput.value.length >= 3) {
                    nameInput.classList.add('border-green-500');
                    nameInput.classList.remove('border-gray-600', 'border-red-500');
                } else {
                    nameInput.classList.add('border-gray-600');
                    nameInput.classList.remove('border-red-500', 'border-green-500');
                }
            });
        }
        
        // Price validation
        const priceInput = document.getElementById('nftPrice');
        if (priceInput) {
            priceInput.addEventListener('input', () => {
                const value = parseFloat(priceInput.value);
                if (priceInput.value && (isNaN(value) || value < 0.001)) {
                    priceInput.classList.add('border-red-500');
                    priceInput.classList.remove('border-gray-600', 'border-green-500');
                } else if (value >= 0.001) {
                    priceInput.classList.add('border-green-500');
                    priceInput.classList.remove('border-gray-600', 'border-red-500');
                } else {
                    priceInput.classList.add('border-gray-600');
                    priceInput.classList.remove('border-red-500', 'border-green-500');
                }
            });
        }
    }

    attachEventListeners() {
        const form = document.getElementById('createNFTForm');
        const fileInput = document.getElementById('file-upload');
        const preview = document.getElementById('preview');
        const previewContainer = document.getElementById('previewContainer');
        const uploadArea = document.querySelector('.border-dashed');

        // File upload preview
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            this.handleFileSelection(file);
        });

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-purple-500', 'bg-purple-900', 'bg-opacity-10');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-purple-500', 'bg-purple-900', 'bg-opacity-10');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-purple-500', 'bg-purple-900', 'bg-opacity-10');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelection(files[0]);
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    }

    handleFileSelection(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'audio/mp3', 'audio/wav'];
        if (!allowedTypes.includes(file.type)) {
            showError('Please select a valid file type (JPG, PNG, GIF, MP4, MP3, WAV)');
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showError('File size must be less than 10MB');
            return;
        }

        this.uploadedFile = file;
        const preview = document.getElementById('preview');
        const previewContainer = document.getElementById('previewContainer');

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                previewContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            // For non-image files, show file info
            preview.src = '';
            previewContainer.innerHTML = `
                <div class="text-center p-4 bg-gray-700 rounded-lg mb-4">
                    <i class="fas fa-file text-4xl text-purple-500 mb-2"></i>
                    <p class="text-white font-medium">${file.name}</p>
                    <p class="text-gray-400 text-sm">${this.formatFileSize(file.size)}</p>
                    <p class="text-gray-400 text-sm">${file.type}</p>
                </div>
            `;
            previewContainer.classList.remove('hidden');
        }
    }

    async handleSubmit() {
        try {
            // Check if wallet is connected first
            if (!userAddress) {
                showError('Please connect your wallet first');
                return;
            }

            // Check if contract is ready
            if (!window.NFTManager || !window.NFTManager.isContractReady()) {
                showError('Contract not ready. Please make sure you are connected to the correct network');
                return;
            }

            const name = document.getElementById('nftName').value.trim();
            const description = document.getElementById('nftDescription').value.trim();
            const category = document.getElementById('nftCategory').value;
            const price = parseFloat(document.getElementById('nftPrice').value);
            const royalty = parseInt(document.getElementById('nftRoyalty').value) || 0;

            // Enhanced validation
            if (!this.uploadedFile) {
                throw new Error('Please upload a file');
            }
            
            if (!name || !description) {
                throw new Error('Please fill in all required fields');
            }
            
            if (name.length < 3) {
                throw new Error('Name must be at least 3 characters long');
            }

            if (description.length < 10) {
                throw new Error('Description must be at least 10 characters long');
            }
            
            if (isNaN(price) || price <= 0) {
                throw new Error('Please enter a valid price greater than 0');
            }

            if (royalty < 0 || royalty > 10) {
                throw new Error('Royalty must be between 0 and 10 percent');
            }

            // File size validation (10MB limit)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (this.uploadedFile.size > maxSize) {
                throw new Error('File size must be less than 10MB');
            }

            // Show loading state
            const submitButton = document.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;

            try {
                // 1. Upload file to IPFS
                this.showProgress('Uploading file to IPFS', 1, 4);
                const ipfsHash = await this.uploadToIPFS(this.uploadedFile);

                // 2. Create metadata using proper schema
                this.showProgress('Creating metadata', 2, 4);
                const metadata = new NFTMetadata({
                    name: name,
                    description: description,
                    image: `ipfs://${ipfsHash}`,
                    external_url: window.location.origin,
                    attributes: [
                        { trait_type: 'Category', value: category },
                        { trait_type: 'Creator', value: userAddress || 'Unknown' },
                        { trait_type: 'Royalty', value: royalty, display_type: 'boost_percentage' },
                        { trait_type: 'File Type', value: this.uploadedFile.type },
                        { trait_type: 'File Size', value: this.formatFileSize(this.uploadedFile.size) }
                    ]
                });

                // Validate metadata
                const validationErrors = metadata.validate();
                if (validationErrors.length > 0) {
                    throw new Error('Metadata validation failed: ' + validationErrors.join(', '));
                }

                // 3. Upload metadata to IPFS
                this.showProgress('Uploading metadata to IPFS', 3, 4);
                const metadataHash = await window.ipfsService.uploadJSON(metadata.toJSON());

                // 4. Mint NFT on blockchain
                this.showProgress('Minting NFT on blockchain', 4, 4);
                await NFTManager.mintNFT(
                    `ipfs://${metadataHash}`,
                    price,
                    category,
                    royalty
                );

                // Show success message
                this.showSuccess();

                // Reset form
                this.resetForm();

                // Redirect to marketplace after delay
                setTimeout(() => {
                    if (window.router) {
                        window.router.navigate('/marketplace');
                    } else {
                        window.location.hash = '#/marketplace';
                    }
                }, 2000);

            } finally {
                // Restore button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }

        } catch (error) {
            console.error('Error creating NFT:', error);
            showError('Failed to create NFT: ' + error.message);
        }
    }

    showProgress(message, step, totalSteps) {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                    <span>${message}</span>
                    <span class="ml-2 text-xs">(${step}/${totalSteps})</span>
                </div>
            `;
        }
    }

    showSuccess() {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check mr-2"></i>
                    <span>NFT Created Successfully!</span>
                </div>
            `;
            submitButton.classList.remove('bg-purple-600', 'hover:bg-purple-700');
            submitButton.classList.add('bg-green-600', 'hover:bg-green-700');
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    resetForm() {
        document.getElementById('createNFTForm').reset();
        this.uploadedFile = null;
        this.previewImage = null;
        
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer) {
            previewContainer.classList.add('hidden');
        }
        
        const preview = document.getElementById('preview');
        if (preview) {
            preview.src = '';
        }
    }

    async uploadToIPFS(file) {
        // Use the global IPFS service
        return await window.ipfsService.uploadFile(file);
    }
}
