import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
    title: string;
    description?: string;
}

export function Header({ title, description }: HeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div className="flex-1">
                <h1 className="font-headline text-xl font-semibold md:text-2xl">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
        </header>
    );
}
