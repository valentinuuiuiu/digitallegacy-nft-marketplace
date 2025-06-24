import { NextResponse } from 'next/server';
import { NFTMetadata } from '@/utils/NFTMetadata';
import { validateApiKey } from '@/utils/auth';


// Helper function to validate metadata
function validateMetadata(metadata) {
  const errors = [];
  
  if (!metadata.name || metadata.name.length < 3) {
    errors.push('Name must be at least 3 characters long');
  }
  
  if (!metadata.description || metadata.description.length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  if (!metadata.attributes || !Array.isArray(metadata.attributes)) {
    errors.push('Attributes must be an array of objects');
  }
  
  return errors;
}

// GET endpoint - fetch NFT metadata
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get('tokenId');
    
    // In production, this would fetch from the blockchain
    // Here we're returning mock data
    const mockMetadata = new NFTMetadata({
      name: `DigitalLegacy NFT #${tokenId || '0000'}`,
      description: 'A unique digital asset on the DigitalLegacy NFT Marketplace',
      image: 'ipfs://QmMockIpfsHash/nft-image.png',
      attributes: [
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Edition', value: '1/1' },
        { trait_type: 'Category', value: 'Digital Art' }
      ],
      external_url: 'https://digitalllegacy.com',
      contract: {
        name: 'DigitalLegacy NFT',
        symbol: 'DLNFT'
      }
    });
    
    const validationErrors = mockMetadata.validate();
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Metadata validation failed', details: validationErrors },
        { status: 500 }
      );
    }
    
    return NextResponse.json(mockMetadata.toJSON());
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFT metadata' },
      { status: 500 }
    );
  }
}

// POST endpoint - create new NFT
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const price = formData.get('price');
    const royalty = formData.get('royalty');
    const file = formData.get('file');
    
    // Validate required fields
    const requiredFields = [
      { name: 'name', value: name, minLength: 3 },
      { name: 'description', value: description, minLength: 10 },
      { name: 'category', value: category },
      { name: 'price', value: price }
    ];
    
    const validationErrors = [];
    
    for (const field of requiredFields) {
      if (!field.value) {
        validationErrors.push(`${field.name} is required`);
      } else if (field.minLength && field.value.length < field.minLength) {
        validationErrors.push(`${field.name} must be at least ${field.minLength} characters`);
      }
    }
    
    // Enhanced numerical validation
    const numericFields = [
      { 
        name: 'price', 
        value: price, 
        min: 0.001,
        max: 1000000,
        pattern: /^\d+(\.\d{1,3})?$/ 
      },
      { 
        name: 'royalty', 
        value: royalty, 
        min: 0, 
        max: 10,
        pattern: /^\d+(\.\d{1,2})?$/
      }
    ];
    
    for (const field of numericFields) {
      if (!field.value.match(field.pattern)) {
        validationErrors.push(`${field.name} has invalid format`);
        continue;
      }
      
      const numValue = parseFloat(field.value);
      if (field.min !== undefined && numValue < field.min) {
        validationErrors.push(`${field.name} must be at least ${field.min}`);
      }
      if (field.max !== undefined && numValue > field.max) {
        validationErrors.push(`${field.name} must be at most ${field.max}`);
      }
      
      // Add decimal precision checks
      if (field.name === 'price' && (field.value.split('.')[1]?.length || 0) > 3) {
        validationErrors.push('Price can have maximum 3 decimal places');
      }
      if (field.name === 'royalty' && (field.value.split('.')[1]?.length || 0) > 2) {
        validationErrors.push('Royalty can have maximum 2 decimal places');
      }
    }
    
    // Validate file
    if (!file) {
      validationErrors.push('No file uploaded');
    } else {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'audio/mp3', 'audio/wav'];
      if (!allowedTypes.includes(file.type)) {
        validationErrors.push('Invalid file type');
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        validationErrors.push('File size must be less than 10MB');
      }
    }
    
    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors,
          fields: {
            name,
            description,
            category,
            price,
            royalty
          }
        },
        { status: 400 }
      );
    }
    
    // Create metadata object
    const metadata = new NFTMetadata({
      name,
      description,
      image: 'ipfs://temp-placeholder', // Will be updated after file upload
      attributes: [
        { trait_type: 'Category', value: category },
        { trait_type: 'File Type', value: file.type },
        { trait_type: 'File Size', value: file.size },
        { trait_type: 'Price', value: price },
        { trait_type: 'Royalty', value: royalty, display_type: 'boost_percentage' }
      ],
      external_url: 'https://digitalllegacy.com',
      contract: {
        name: 'DigitalLegacy NFT',
        symbol: 'DLNFT'
      }
    });
    
    // Validate metadata schema
    const metadataValidationErrors = metadata.validate();
    if (metadataValidationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Metadata schema validation failed', 
          details: metadataValidationErrors
        },
        { status: 500 }
      );
    }
    
    // Upload file to IPFS
    const ipfsFileHash = await uploadToIPFS(file);
    if (!ipfsFileHash) {
      return NextResponse.json(
        { error: 'Failed to upload file to IPFS' },
        { status: 500 }
      );
    }

    // Upload metadata to IPFS
    metadata.image = `ipfs://${ipfsFileHash}`;
    const ipfsMetadataHash = await uploadToIPFS(JSON.stringify(metadata.toJSON()));
    
    if (!ipfsMetadataHash) {
      return NextResponse.json(
        { error: 'Failed to upload metadata to IPFS' },
        { status: 500 }
      );
    }
    
    // Pin both files to IPFS for persistence
    await pinToIPFS(ipfsFileHash);
    await pinToIPFS(ipfsMetadataHash);
    
    // Return response with IPFS hashes and metadata URL
    return NextResponse.json({
      success: true,
      metadata: metadata.toJSON(),
      message: 'NFT created successfully (mock)'
    });
    
  } catch (error) {
    console.error('Error creating NFT:', error);
    return NextResponse.json(
      { error: 'Failed to create NFT', details: error.message },
      { status: 500 }
    );
  }
}
