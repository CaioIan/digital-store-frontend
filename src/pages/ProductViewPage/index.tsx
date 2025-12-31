import RouterLink from "@/components/RouterLink";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

export default function ProductViewPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <h1>Você está na Product View Page</h1>
            {id && <p>ID do Produto: {id}</p>}
            <Button>Voltar para {''} <RouterLink to='/'>Home</RouterLink></Button>
        </>
    )
}