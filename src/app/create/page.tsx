import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { EventForm } from "@/components/events/event-form";

export default function CreateEventPage() {
    return (
        <AppLayout>
            <div className="flex-1">
                <Header title="Create a New Event" description="Fill in the details below to get started."/>
                <main className="p-4 md:p-6">
                    <EventForm />
                </main>
            </div>
        </AppLayout>
    )
}
