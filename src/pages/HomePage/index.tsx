import RouterLink from "@/components/RouterLink";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <>
            <h1>Você está na Home Page</h1>
            <Button>Vá para <RouterLink to="/products">Product Listing</RouterLink></Button>
        </>
    )
}