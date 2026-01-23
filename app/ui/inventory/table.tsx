import { fetchFilteredInventory } from '@/app/lib/data';

export default async function InventoryTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const inventory = await fetchFilteredInventory(query, currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {inventory?.map((item) => (
                            <div key={item.item_id} className="mb-2 w-full rounded-md bg-white p-4">
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}