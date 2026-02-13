import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RouterLink from '@/components/RouterLink'
import { BuyBox } from '@/components/BuyBox'
import { Gallery } from '@/components/Gallery'
import ProductCard from '@/components/ProductCard'
import { ProductOptions } from '@/components/ProductOptions'
import Section from '@/components/Section'
import type { CarouselApi } from '@/components/ui/carousel'
import { getProductById, getProducts } from '@/services/productService'
import type { Product } from '@/types/Product'

// Cores de fundo para as variações da galeria (as cores que aparecem nas thumbs e no seletor)
const colorOptions = ['#E2E3FF', '#FFE8BC', '#DEC699', '#E8DFCF']

// Mapeamento de cor hex → nome legível para exibição no carrinho
const colorNames: Record<string, string> = {
  '#E2E3FF': 'Vermelho / Branco',
  '#FFE8BC': 'Laranja / Branco',
  '#DEC699': 'Bege / Marrom',
  '#E8DFCF': 'Cinza / Branco'
}

export default function ProductViewPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [galleryApi, setGalleryApi] = useState<CarouselApi | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined
  )
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      // Reseta seleções ao trocar de produto
      setSelectedSize(undefined)
      setSelectedColor(undefined)
      setGalleryApi(null)

      try {
        const [productData, allProducts] = await Promise.all([
          getProductById(id),
          getProducts()
        ])

        if (productData) {
          setProduct(productData)
          // Filtra produtos relacionados (exclui o atual e pega até 4)
          const related = allProducts.filter((p) => p.id !== id).slice(0, 4)
          setRelatedProducts(related)
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
      }
    }

    fetchData()
  }, [id])

  // Gera variações da mesma imagem com diferentes backgrounds na ordem das cores
  const getProductImages = (productName: string) => {
    const imageUrl = '/tenis-nike.png' // Imagem fixa

    return colorOptions.map((color, index) => ({
      src: imageUrl,
      alt: `${productName} - Variação ${index + 1}`,
      style: { backgroundColor: color }
    }))
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(colorNames[color] || color)
    const index = colorOptions.indexOf(color)
    if (index !== -1 && galleryApi) {
      // Navega para o slide correspondente
      galleryApi.scrollTo(index)
    }
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-center min-h-150">
        <p className="text-lg text-dark-gray-2">Produto não encontrado</p>
      </div>
    )
  }

  const productImages = getProductImages(product.name)

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12 space-y-6 lg:space-y-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-xs lg:text-sm text-dark-gray-3 overflow-x-auto"
      >
        <ol className="flex items-center gap-2 whitespace-nowrap">
          <li>
            <RouterLink to="/" className="hover:text-primary transition-colors">
              Home
            </RouterLink>
          </li>
          <li>/</li>
          <li>
            <RouterLink
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Produtos
            </RouterLink>
          </li>
          <li>/</li>
          <li className="text-dark-gray-2 font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Área do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Gallery com Thumbnails - Modo Produto (Seção 7.1) */}
        <Gallery
          slides={productImages}
          showThumbs={true}
          width="100%"
          height="auto"
          radius="4px"
          className="w-full"
          onApiReady={(api) => setGalleryApi(api)}
          objectFit="contain"
          imagePadding="p-4 lg:p-8"
        />

        {/* BuyBox com ProductOptions integrados */}
        <BuyBox
          productId={product.id}
          name={product.name}
          image={product.image}
          reference={product.reference || 'N/A'}
          stars={product.stars || 0}
          rating={product.rating || 0}
          price={product.price}
          priceDiscount={product.priceDiscount}
          description={product.description || 'Descrição não disponível'}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
        >
          {/* Seletor de Tamanho */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-dark-gray-2">Tamanho</h3>
            <ProductOptions
              options={['39', '40', '41', '42', '43']}
              radius="4px"
              shape="square"
              type="text"
              selected={selectedSize}
              onSelect={handleSizeChange}
            />
          </div>

          {/* Seletor de Cor */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-dark-gray-2">Cor</h3>
            <ProductOptions
              options={colorOptions}
              shape="circle"
              type="color"
              selected={
                selectedColor
                  ? colorOptions.find((c) => colorNames[c] === selectedColor)
                  : undefined
              }
              onSelect={handleColorChange}
            />
          </div>
        </BuyBox>
      </div>

      {/* Produtos Recomendados (Seção 7.4) */}
      <Section
        title="Produtos relacionados"
        titleAlign="left"
        link={{ text: 'Ver todos', href: '/products' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-x-8 lg:gap-y-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              id={relatedProduct.id}
              name={relatedProduct.name}
              image={relatedProduct.image}
              price={relatedProduct.price}
              priceDiscount={relatedProduct.priceDiscount}
              category={relatedProduct.category}
            />
          ))}
        </div>
      </Section>
    </div>
  )
}
