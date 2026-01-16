import type { Product } from '@/types/Product'

const products: Product[] = [
  {
    id: '1',
    name: 'Tênis Nike Revolution 6 Next Nature Masculino',
    image: '/tenis-test.png',
    price: 299.9,
    priceDiscount: 219.9,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    // category duplicada removida
    brand: 'Nike',
    gender: 'male',
    reference: '38416711',
    stars: 4.7,
    rating: 90
  },
  {
    id: '2',
    name: 'Tênis Nike Air Max AP Masculino',
    image: '/tenis-test.png',
    price: 449.9,
    priceDiscount: 399.9,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    // category duplicada removida
    brand: 'Nike',
    gender: 'male',
    reference: '38416712',
    stars: 4.5,
    rating: 120
  },
  {
    id: '3',
    name: 'Tênis Adidas Ultraboost 22',
    image: '/tenis-test.png',
    price: 599.9,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus.',
    // category duplicada removida
    brand: 'Adidas',
    gender: 'unisex',
    reference: '38416713',
    stars: 4.8,
    rating: 85
  },
  {
    id: '4',
    name: 'Tênis Puma RS-X',
    image: '/tenis-test.png',
    price: 349.9,
    priceDiscount: 279.9,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero sed cursus ante dapibus diam.',
    category: 'Tênis',
    brand: 'Puma',
    gender: 'female',
    reference: '38416714',
    stars: 4.3,
    rating: 65
  },
  {
    id: '5',
    name: 'Tênis New Balance 574',
    image: '/tenis-test.png',
    price: 499.9,
    priceDiscount: 429.9,
    // category duplicada removida
    brand: 'New Balance',
    gender: 'unisex',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.',
    category: 'Tênis',
    reference: '38416715',
    stars: 4.6,
    rating: 110
  },
  {
    id: '6',
    name: 'Tênis Asics Gel-Kayano 29',
    image: '/tenis-test.png',
    price: 799.9,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu erat, accumsan id imperdiet et.',
    category: 'Tênis',
    reference: '38416716',
    stars: 4.9,
    rating: 95
  },
  {
    id: '7',
    name: 'Tênis Reebok Classic Leather',
    image: '/tenis-test.png',
    price: 379.9,
    priceDiscount: 299.9,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin molestie malesuada proin eget tortor risus.',
    category: 'Tênis',
    reference: '38416717',
    stars: 4.4,
    rating: 75
  },
  {
    id: '8',
    name: 'Tênis Mizuno Wave Prophecy',
    image: '/tenis-test.png',
    price: 899.9,
    priceDiscount: 749.9,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.',
    category: 'Tênis',
    reference: '38416718',
    stars: 4.7,
    rating: 100
  }
]

export const getProducts = (): Promise<Product[]> => {
  return Promise.resolve(products)
}

export const getProductById = (id: string): Promise<Product | undefined> => {
  const product = products.find((p) => p.id === id)
  return Promise.resolve(product)
}
