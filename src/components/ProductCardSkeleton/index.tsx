import { Skeleton } from '@/components/ui/skeleton'

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full h-full bg-white rounded-lg flex flex-col gap-2 relative">
      <div className="rounded-lg mb-2 relative flex items-center justify-center p-4">
        {/* Placeholder image shape */}
        <Skeleton className="w-[100%] h-[200px] lg:h-[250px] rounded-lg" />
      </div>

      <div className="flex flex-col gap-1 px-1">
        <Skeleton className="h-4 w-1/3 mb-1" />
        <Skeleton className="h-6 w-5/6 mb-2" />
        
        <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
        </div>
      </div>
    </div>
  )
}
