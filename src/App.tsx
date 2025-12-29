import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Separator } from './components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './components/ui/sheet'

export default function App() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div>Testando Componentes do Shadcnui</div>
      <Button variant="default" className="w-[114px] rounded-lg font-bold">
        Botão de Teste
      </Button>

      <Separator />

      <Input placeholder="Input de Teste" className="w-[200px]" />

      <Separator />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" className="w-[114px]">
            Open Sheet
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Input id="sheet-demo-username" defaultValue="@peduarte" />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
