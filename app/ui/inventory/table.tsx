import { fetchFilteredInventory } from '@/app/lib/data';
import { Item, Inventory } from '@/app/lib/definitions';

export default async function InventoryTable({
    query,
    currentPage,
    location,
}: {
    query: string;
    currentPage: number;
    location: string;
}) {
    const inventory = await fetchFilteredInventory(query, currentPage, location);
    console.log(inventory);
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {inventory?.map((item) => (
                            <div key={item.item_id} className="mb-2 w-full rounded-md bg-white p-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p>{item.item_id}</p>
                                        <p>{item.item_name}</p>
                                        <p>{item.qty_units_on_hand}</p>
                                        <p>{item.unit_name}</p>
                                    </div>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Item ID 
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Item Name 
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Item Qty 
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Units 
                                </th>                                
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {inventory?.map((item) => (
                                <tr key={item.item_id}
                                className="w-full boreder-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <p>{item.item_id}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <p>{item.item_name}</p>
                                    </td>   
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <p>{item.qty_units_on_hand}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <p>{item.unit_name}</p>
                                    </td>                                                                          
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}