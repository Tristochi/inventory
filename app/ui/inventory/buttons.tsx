import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { UpdateItemProps } from '@/app/lib/definitions'


export function UpdateItem({ id, location }: UpdateItemProps) {
    type ItemLocations = {
        [key: string]: string;
    }
    const itemLocation: ItemLocations = {
        "Main Office": "main-office",
        "Hospice House": "hospice-house",
        "Hospice Overflow": "hospice-overflow"
    } 
    const locationSlug: string = itemLocation[location];


    return(
        <Link
            href={`/inventory/${locationSlug}/${id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    )
}
