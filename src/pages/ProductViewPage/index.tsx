import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

export default function ProductViewPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [galleryApi, setGalleryApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

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
      } finally {
        setLoading(false)
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
    const index = colorOptions.indexOf(color)
    if (index !== -1 && galleryApi) {
      // Navega para o slide correspondente
      galleryApi.scrollTo(index)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-center min-h-150">
        <p className="text-lg text-light-gray">Carregando produto...</p>
      </div>
    )
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
    <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-dark-gray-3">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Produtos
            </Link>
          </li>
          <li>/</li>
          <li className="text-dark-gray-2 font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Área do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery com Thumbnails - Modo Produto (Seção 7.1) */}
        <Gallery
          slides={productImages}
          showThumbs={true}
          width="701px"
          height="571px"
          radius="4px"
          className="w-full"
          onApiReady={(api) => setGalleryApi(api)}
          objectFit="contain"
          imagePadding="p-8"
        />

        {/* BuyBox com ProductOptions integrados */}
        <BuyBox
          name={product.name}
          reference={product.reference || 'N/A'}
          stars={product.stars || 0}
          rating={product.rating || 0}
          price={product.price}
          priceDiscount={product.priceDiscount}
          description={product.description || 'Descrição não disponível'}
        >
          {/* Seletor de Tamanho */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-dark-gray-2">Tamanho</h3>
            <ProductOptions
              options={['39', '40', '41', '42', '43']}
              radius="4px"
              shape="square"
              type="text"
            />
          </div>

          {/* Seletor de Cor */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-dark-gray-2">Cor</h3>
            <ProductOptions
              options={colorOptions}
              shape="circle"
              type="color"
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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-8 gap-y-6">
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
