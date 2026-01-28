import Table from '@/app/ui/inventory/table';
import Pagination from '@/app/ui/inventory/pagination';
import { InventoryTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInventoryPages } from '@/app/lib/data';

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
    }) {
    
        const searchParams = await props.searchParams;
        const query = searchParams?.query || '';
        const currentPage = Number(searchParams?.page) || 1;
        const totalPages = await fetchInventoryPages(query);
        const location = "Main Office";
    
        return(
            <main>
                <div>
                    <h1 className="mb-4 text-xl md:text-2xl">Main Office Inventory</h1>
                </div>
                <Suspense key={query + currentPage} fallback={<InventoryTableSkeleton />}>
                    <Table query={query} currentPage={currentPage} location={location} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </main>
        );
    }