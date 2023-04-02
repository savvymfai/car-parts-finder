export interface CarPart {
    id: number;
    name: string;
    brand: string;
    price: number;
  }
  
  export const carParts: CarPart[] = [
    {
      id: 1,
      name: 'Brake Pads',
      brand: 'Bosch',
      price: 30,
    },
    // Add more car parts here
  ];
  