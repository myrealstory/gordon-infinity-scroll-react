export interface ProductProps {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: reviewProps[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: {
      createdAt: string;
      updatedAt: string;
      barcode: string;
      qrCode: string;
    };
    thumbnail: string;
    images: string[];
  }

  export interface ProductResponse {
    products: ProductProps[];
    total: number;
    skip: number;
    limit: number;
  }

  export interface reviewProps {
    rating: number;
      comment: string;
      date: string;
      reviewerName: string;
      reviewerEmail: string;
  }
  