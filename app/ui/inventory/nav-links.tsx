'use client';
import { 
    HomeIcon,
    DocumentDuplicateIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { logout } from '@/app/actions/auth';

const navLinks = [
    {name: 'Home', href: '/inventory', icon: HomeIcon},
    {name: 'Main Office', href: '/inventory/main-office', icon: DocumentDuplicateIcon},
    {name: 'Hospice House', href: '/inventory/hospice-house', icon: DocumentDuplicateIcon},
    {name: 'Hospice Overflow', href: '/inventory/hospice-overflow', icon: DocumentDuplicateIcon},
    {name: 'User Management', href:'/inventory/user-management', icon: DocumentDuplicateIcon},
    {name: 'Logout', href: '', icon: ArrowLeftOnRectangleIcon},
];

export default function NavLinks() {
    const pathname = usePathname();//track active link
    const router = useRouter();//to redirect

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <>
            {navLinks.map((link) => {
                const LinkIcon = link.icon;
                const className = clsx(
                    'flex h-12 grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-red-400 md:flex-none md:justify-start md:p-2 md:px-3',
                    { 'bg-sky-100 text-red-400': pathname === link.href }
                );

                if (link.name === 'Logout') {//check pathname === logout then handle logout otherwise render regular Link comp
                    return (
                        <button key={link.name} onClick={handleLogout} className={className}>
                            <LinkIcon className="w-6"/>
                            <p className="hidden md:block">{link.name}</p>
                        </button>
                    );
                }

                return (
                    <Link 
                        key={link.name} 
                        href={link.href}
                        className={className}
                    >
                        <LinkIcon className="w-6"/>
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}