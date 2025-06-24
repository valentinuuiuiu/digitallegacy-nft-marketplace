import { NFT_METADATA_SCHEMA_VERSION } from '../constants/metadata';

/**
 * NFTMetadata class for creating and validating NFT metadata
 */
class NFTMetadata {
    static DEFAULT_SCHEMA = 'https://schema.org/NonFungibleToken';
    static DEFAULT_ATTRIBUTES_DISPLAY_TYPES = {
        number: 'number',
        boost_number: 'boost_number',
        date: 'date',
        ratio: 'ratio',
        boost_percentage: 'boost_percentage',
        level: 'level',
        step_count: 'step_count'
    };

    /**
     * Create a new NFTMetadata instance
     * @param {Object} metadata - The NFT metadata object
     */
    constructor(metadata = {}) {
        this.name = metadata.name || '';
        this.description = metadata.description || '';
        this.image = metadata.image || '';
        this.image_data = metadata.image_data || null;
        this.animation_url = metadata.animation_url || null;
        this.external_url = metadata.external_url || '';
        this.attributes = metadata.attributes || [];
        this.background_color = metadata.background_color || null;
        this.youtube_url = metadata.youtube_url || null;
        this.schema_version = metadata.schema_version || NFTMetadata.DEFAULT_SCHEMA;
    }

    /**
     * Validate the metadata against the NFT metadata standard
     * @returns {Array} An array of validation errors
     */
    validate() {
        const errors = [];
        
        // Required fields validation
        if (!this.name || typeof this.name !== 'string') {
            errors.push('Name is required and must be a string');
        }
        
        if (!this.description || typeof this.description !== 'string') {
            errors.push('Description is required and must be a string');
        }
        
        if (!this.image || typeof this.image !== 'string') {
            errors.push('Image URL is required and must be a string');
        }
        
        // Attributes validation
        if (!Array.isArray(this.attributes)) {
            errors.push('Attributes must be an array');
        } else {
            this.attributes.forEach((attr, index) => {
                if (typeof attr !== 'object' || attr === null) {
                    errors.push(`Attribute at index ${index} must be an object`);
                    return;
                }
                
                if (!attr.trait_type) {
                    errors.push(`Attribute at index ${index} must have a 'trait_type' field`);
                }
                
                if (attr.display_type && !Object.values(NFTMetadata.DEFAULT_ATTRIBUTES_DISPLAY_TYPES).includes(attr.display_type)) {
                    errors.push(`Attribute at index ${index} has an invalid display_type: ${attr.display_type}`);
                }
                
                // Validate numerical attributes
                if (attr.display_type && ['number', 'boost_number', 'ratio', 'level', 'step_count'].includes(attr.display_type)) {
                    if (typeof attr.value !== 'number') {
                        errors.push(`Attribute at index ${index} with display_type '${attr.display_type}' must have a numerical value`);
                    }
                }
                
                // Validate date attributes
                if (attr.display_type === 'date' && !(attr.value instanceof Date)) {
                    errors.push(`Attribute at index ${index} with display_type 'date' must have a Date value`);
                }
            });
        }
        
        // Optional fields validation
        if (this.animation_url && typeof this.animation_url !== 'string') {
            errors.push('Animation URL must be a string if provided');
        }
        
        if (this.external_url && typeof this.external_url !== 'string') {
            errors.push('External URL must be a string if provided');
        }
        
        if (this.background_color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this.background_color)) {
            errors.push('Background color must be a valid hex color code if provided');
        }
        
        if (this.youtube_url && typeof this.youtube_url !== 'string') {
            errors.push('YouTube URL must be a string if provided');
        }
        
        if (this.schema_version && typeof this.schema_version !== 'string') {
            errors.push('Schema version must be a string if provided');
        }
        
        return errors;
    }

    /**
     * Convert the metadata to a JSON object
     * @returns {Object} JSON representation of the metadata
     */
    toJSON() {
        const json = {
            name: this.name,
            description: this.description,
            image: this.image,
            attributes: this.attributes
        };
        
        // Add optional fields if they exist
        if (this.image_data) json.image_data = this.image_data;
        if (this.animation_url) json.animation_url = this.animation_url;
        if (this.external_url) json.external_url = this.external_url;
        if (this.background_color) json.background_color = this.background_color;
        if (this.youtube_url) json.youtube_url = this.youtube_url;
        if (this.schema_version) json.schema_version = this.schema_version;
        
        return json;
    }

    /**
     * Create a new NFTMetadata instance from a JSON object
     * @param {Object} json - JSON object to parse
     * @returns {NFTMetadata} A new NFTMetadata instance
     */
    static fromJSON(json) {
        return new NFTMetadata(json);
    }

    /**
     * Create a metadata template for a specific NFT type
     * @param {string} type - Type of NFT ('art', 'music', 'video', 'document', 'collectible', 'utility')
     * @returns {NFTMetadata} A new NFTMetadata instance with template data
     */
    static createTemplate(type) {
        const templates = {
            art: {
                name: 'Untitled Artwork',
                description: 'A unique piece of digital art',
                attributes: [
                    { trait_type: 'Medium', value: 'Digital' },
                    { trait_type: 'Style', value: 'Abstract' },
                    { trait_type: 'Resolution', value: '4K' }
                ]
            },
            music: {
                name: 'Untitled Track',
                description: 'A unique music composition',
                attributes: [
                    { trait_type: 'Genre', value: 'Electronic' },
                    { trait_type: 'Duration', value: '3:30', display_type: 'ratio' },
                    { trait_type: 'Format', value: 'MP3' }
                ]
            },
            video: {
                name: 'Untitled Video',
                description: 'A unique video creation',
                attributes: [
                    { trait_type: 'Type', value: 'Animation' },
                    { trait_type: 'Duration', value: '1:30', display_type: 'ratio' },
                    { trait_type: 'Resolution', value: '1080p' }
                ]
            },
            document: {
                name: 'Untitled Document',
                description: 'A unique digital document',
                attributes: [
                    { trait_type: 'Type', value: 'PDF' },
                    { trait_type: 'Pages', value: 10, display_type: 'number' },
                    { trait_type: 'Format', value: 'A4' }
                ]
            },
            collectible: {
                name: 'Untitled Collectible',
                description: 'A unique collectible item',
                attributes: [
                    { trait_type: 'Type', value: 'Digital Collectible' },
                    { trait_type: 'Rarity', value: 'Common' },
                    { trait_type: 'Edition', value: '1/1', display_type: 'boost_percentage' }
                ]
            },
            utility: {
                name: 'Untitled Utility',
                description: 'A unique utility token',
                attributes: [
                    { trait_type: 'Type', value: 'Access Pass' },
                    { trait_type: 'Validity', value: '1 year', display_type: 'boost_percentage' },
                    { trait_type: 'Features', value: 5, display_type: 'number' }
                ]
            }
        };
        
        const template = templates[type] || templates.art;
        return new NFTMetadata(template);
    }

    /**
     * Add an attribute to the metadata
     * @param {Object} attribute - The attribute to add
     */
    addAttribute(attribute) {
        this.attributes.push(attribute);
    }

    /**
     * Remove an attribute by trait type
     * @param {string} traitType - The trait type to remove
     */
    removeAttribute(traitType) {
        this.attributes = this.attributes.filter(attr => attr.trait_type !== traitType);
    }

    /**
     * Get an attribute by trait type
     * @param {string} traitType - The trait type to find
     * @returns {Object|null} The attribute or null if not found
     */
    getAttribute(traitType) {
        return this.attributes.find(attr => attr.trait_type === traitType) || null;
    }
}

export { NFTMetadata };