export class NFTMetadata {
    constructor(data = {}) {
      this.name = data.name || '';
      this.description = data.description || '';
      this.image = data.image || '';
      this.attributes = data.attributes || [];
      this.external_url = data.external_url || '';
      this.contract = data.contract || { name: '', symbol: '' };
      this.createdAt = data.createdAt || new Date().toISOString();
    }
  
    // Add validation method
    validate() {
      const errors = [];
      
      if (!this.name || this.name.length < 3) {
        errors.push('Name must be at least 3 characters long');
      }
      
      if (!this.description || this.description.length < 10) {
        errors.push('Description must be at least 10 characters long');
      }
      
      if (!this.image) {
        errors.push('Image URL is required');
      }
      
      if (!this.attributes || !Array.isArray(this.attributes)) {
        errors.push('Attributes must be an array of objects');
      }
      
      if (this.attributes.some(attr => !attr.trait_type)) {
        errors.push('All attributes must have a trait_type');
      }
      
      return errors;
    }
  
    // Convert to JSON schema compliant format
    toJSON() {
      return {
        name: this.name,
        description: this.description,
        image: this.image,
        attributes: this.attributes,
        external_url: this.external_url,
        contract: {
          name: this.contract.name,
          symbol: this.contract.symbol
        },
        createdAt: this.createdAt
      };
    }
  }
  