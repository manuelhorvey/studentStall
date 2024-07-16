export interface Image {
  _id: string;
  url: string;
  altText: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: Image[];
  user: {
    _id: string;
    name: string;
  };
}
