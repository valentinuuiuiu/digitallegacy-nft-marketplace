import React from 'react';

class CreateNFTPage {
    constructor() {
        this.fileInput = null;
        this.previewImage = null;
        this.uploadedFile = null;
    }

    render() {
        // Create container element
        const container = document.createElement('div');
        container.className = 'nft-create-container';
        
        // Create React root
        const root = ReactDOM.createRoot(container);
        
        // Render React component
        root.render(
            <React.StrictMode>
                <CreateNFTComponent />
            </React.StrictMode>
        );

        // Replace existing content
        document.getElementById('main').innerHTML = '';
        document.getElementById('main').appendChild(container);
    }
}

// React Component for NFT Creation
function CreateNFTComponent({ onComplete = () => {} }) {
    const [file, setFile] = React.useState(null);
    const [preview, setPreview] = React.useState(null);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [royalty, setRoyalty] = React.useState('');
    const [errors, setErrors] = React.useState({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [currentStep, setCurrentStep] = React.useState(1);
    const [transactionHash, setTransactionHash] = React.useState(null);
    
    // Handle file selection
    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        
        // Validate file
        const newErrors = {};
        if (!selectedFile) {
            newErrors.file = 'Please select a file';
        } else if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'audio/mp3', 'audio/wav'].includes(selectedFile.type)) {
            newErrors.file = 'Invalid file type. Please select an image (JPG, PNG, GIF), video (MP4), or audio (MP3, WAV)';
        } else if (selectedFile.size > 10 * 1024 * 1024) {
            newErrors.file = 'File size must be less than 10MB';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors({...errors, ...newErrors});
            return;
        }
        
        setFile(selectedFile);
        
        // Create preview
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
        
        setErrors({...errors, file: ''});
    };
    
    // Calculate progress messages
    const getProgressMessage = () => {
        switch(currentStep) {
            case 1:
                return "Uploading File to IPFS";
            case 2:
                return "Creating Metadata";
            case 3:
                return "Uploading Metadata to IPFS";
            case 4:
                return "Minting NFT on Blockchain";
            case 5:
                return "Finalizing NFT Creation";
            default:
                return "Processing NFT Creation";
        }
    };
    
    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const newErrors = {};
        if (!name) newErrors.name = 'Name is required';
        if (name.length < 3) newErrors.name = 'Name must be at least 3 characters';
        
        if (!description) newErrors.description = 'Description is required';
        if (description.length < 10) newErrors.description = 'Description must be at least 10 characters';
        
        if (!category) newErrors.category = 'Category is required';
        
        if (!price || parseFloat(price) < 0.001) {
            newErrors.price = 'Price must be at least 0.001 ETH';
        }
        
        if (royalty && (parseInt(royalty) < 0 || parseInt(royalty) > 10)) {
            newErrors.royalty = 'Royalty must be between 0 and 10 percent';
        }
        
        if (!file) newErrors.file = 'Please upload a file';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors({...errors, ...newErrors});
            return;
        }
        
        setIsSubmitting(true);
        setCurrentStep(1);
        setUploadProgress(0);
        
        try {
            // 1. Upload file to IPFS
            setUploadProgress(25);
            setCurrentStep(1);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            
            // 2. Create metadata
            setUploadProgress(50);
            setCurrentStep(2);
            const metadata = {
                name,
                description,
                image: file ? URL.createObjectURL(file) : '',
                attributes: [
                    { trait_type: 'Category', value: category },
                    { trait_type: 'File Type', value: file ? file.type : '' },
                    { trait_type: 'File Size', value: file ? formatFileSize(file.size) : '' }
                ],
                external_url: window.location.origin
            };
            
            // Validate metadata
            if (!metadata.name || !metadata.description) {
                throw new Error('Metadata creation failed');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            
            // 3. Upload metadata to IPFS
            setUploadProgress(75);
            setCurrentStep(3);
            const metadataHash = 'QmMockMetadataHash1234567890';
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            
            // 4. Mint NFT on blockchain
            setUploadProgress(90);
            setCurrentStep(4);
            
            // Mock blockchain transaction
            setTransactionHash('0x1234...def');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Transaction processing time
            
            // 5. Finalize
            setUploadProgress(100);
            setCurrentStep(5);
            
            // Show success message
            setTimeout(() => {
                alert('NFT created successfully!');
                // Reset form
                setFile(null);
                setPreview(null);
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setRoyalty('');
                setIsSubmitting(false);
                setUploadProgress(0);
                setTransactionHash(null);
                
                // Navigate to marketplace
                if (window.router) {
                    window.router.navigate('/marketplace');
                } else {
                    window.location.hash = '#/marketplace';
                }
            }, 1500);
            
        } catch (error) {
            console.error('Error creating NFT:', error);
            alert(`Failed to create NFT: ${error.message}`);
            setIsSubmitting(false);
            setUploadProgress(0);
            setTransactionHash(null);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 pt-20 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Create New NFT</h2>
                        <div className="flex items-center space-x-4">
                            {/* Wallet connection status - would be dynamic in real implementation */}
                            <div className="flex items-center space-x-2 text-green-400">
                                <i className="fas fa-check-circle"></i>
                                <span className="text-sm">Wallet connected</span>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                NFT File *
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md hover:border-purple-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    <div className={`mb-4 ${preview ? 'block' : 'hidden'}`}>
                                        {preview && file?.type.startsWith('image/') ? (
                                            <img 
                                                src={preview} 
                                                alt="Preview" 
                                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="text-center p-4 bg-gray-700 rounded-lg mb-4">
                                                <i className="fas fa-file text-4xl text-purple-500 mb-2"></i>
                                                <p className="text-white font-medium">{file?.name}</p>
                                                <p className="text-gray-400 text-sm">{formatFileSize(file?.size || 0)}</p>
                                                <p className="text-gray-400 text-sm">{file?.type}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex text-sm text-gray-400">
                                        <label 
                                            htmlFor="file-upload" 
                                            className="relative cursor-pointer bg-gray-900 rounded-md font-medium text-purple-500 hover:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                                        >
                                            <span>Upload a file</span>
                                            <input 
                                                id="file-upload" 
                                                name="file-upload" 
                                                type="file" 
                                                className="sr-only" 
                                                accept="image/*,video/*,audio/*"
                                                onChange={handleFileSelect}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF, MP4, MP3, WAV up to 10MB
                                    </p>
                                    {errors.file && (
                                        <p className="text-xs text-red-400 mt-1">{errors.file}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="nftName" className="block text-sm font-medium text-gray-300 mb-2">
                                Name *
                            </label>
                            <input 
                                type="text" 
                                id="nftName" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                minLength={3} 
                                maxLength={100}
                                placeholder="Enter NFT name (at least 3 characters)"
                                className={`mt-1 block w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="nftDescription" className="block text-sm font-medium text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea 
                                id="nftDescription" 
                                rows="4" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                minLength={10} 
                                maxLength={1000}
                                placeholder="Describe your NFT (at least 10 characters)" 
                                className={`mt-1 block w-full bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-none`}
                            ></textarea>
                            {errors.description && (
                                <p className="text-xs text-red-400 mt-1">{errors.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Characters: {description.length}/1000
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="nftCategory" className="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <select 
                                id="nftCategory" 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={`mt-1 block w-full bg-gray-700 border ${errors.category ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                            >
                                <option value="">Select a category</option>
                                <option value="art">Art</option>
                                <option value="music">Music</option>
                                <option value="video">Video</option>
                                <option value="document">Document</option>
                                <option value="collectible">Collectible</option>
                                <option value="utility">Utility</option>
                            </select>
                            {errors.category && (
                                <p className="text-xs text-red-400 mt-1">{errors.category}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="nftPrice" className="block text-sm font-medium text-gray-300 mb-2">
                                Price (ETH) *
                            </label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    id="nftPrice" 
                                    step="0.001" 
                                    min="0.001" 
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.001"
                                    className={`mt-1 block w-full bg-gray-700 border ${errors.price ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 text-sm">ETH</span>
                                </div>
                            </div>
                            {errors.price && (
                                <p className="text-xs text-red-400 mt-1">{errors.price}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Minimum price: 0.001 ETH</p>
                        </div>

                        {/* Royalty */}
                        <div>
                            <label htmlFor="nftRoyalty" className="block text-sm font-medium text-gray-300 mb-2">
                                Royalty Percentage (%)
                            </label>
                            <input 
                                type="number" 
                                id="nftRoyalty" 
                                min="0" 
                                max="10" 
                                step="0.1" 
                                placeholder="0"
                                value={royalty}
                                onChange={(e) => setRoyalty(e.target.value)}
                                className={`mt-1 block w-full bg-gray-700 border ${errors.royalty ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                            />
                            {errors.royalty && (
                                <p className="text-xs text-red-400 mt-1">{errors.royalty}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Royalty you'll receive from future sales (0-10%)
                            </p>
                        </div>

                        {/* Transaction Hash */}
                        {transactionHash && (
                            <div className="bg-gray-700 bg-opacity-50 border border-gray-600 rounded-md p-3">
                                <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                                <p className="text-sm font-mono text-purple-400 break-all">{transactionHash}</p>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {isSubmitting && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-300">
                                    {getProgressMessage()} 
                                    <span className="text-purple-500 ml-2">{uploadProgress}%</span>
                                </p>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div 
                                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
                                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <span className="animate-spin mr-2">🌀</span>
                                        {getProgressMessage()}
                                    </div>
                                ) : (
                                    <>
                                        <i className="fas fa-plus mr-2"></i>
                                        Create NFT
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateNFTPage;