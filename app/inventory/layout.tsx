import SideNav from '@/app/ui/inventory/sidenav'; 
import {verifySession} from '@/app/lib/sessions'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
//this will verify the user before showing them anything within the app need to add logout button
    const session = await verifySession()

    if(!session){
        redirect('/login')
    }

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            
        </div>
    );
}
