import RouterLink from "@/components/RouterLink";
import { Button } from "@/components/ui/button";

export default function ProductListingPage() {
    return (
        <>
            <h1>Você está na Product Listing Page</h1>
            <Button>Vá para <RouterLink to="/product/1">Product View</RouterLink></Button>
        </>
    )
}