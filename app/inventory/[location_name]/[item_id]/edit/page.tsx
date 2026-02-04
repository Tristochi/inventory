import Form from '@/app/ui/inventory/edit-form';
import Breadcrumbs from '@/app/ui/inventory/breadcrumbs';
import { fetchItemById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ item_id: string, location_name: string }> }) {
    const params = await props.params;
    const item_id = params.item_id;
    const location_name = params.location_name;
    console.log(`location name: ${location_name}`);
    const [item] = await Promise.all([fetchItemById(item_id, location_name)]);
    
    if (!item) {
        notFound();
    }
    return(
        <main>
            <Breadcrumbs 
                breadcrumbs={[
                    { label: 'Main Office', href: '/inventory/main-office' },
                    {
                        label: 'Edit Item',
                        href: `/inventory/${location_name}/${item_id}/edit`,
                        active: true,
                    }
                ]}
            />
            <Form item={item} />
        </main>
    )
}

