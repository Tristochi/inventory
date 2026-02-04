'use client';

import { ItemForm } from '@/app/lib/definitions';
import {
    CheckIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { UpdateItem } from '@/app/ui/inventory/buttons';
import { updateItem, State } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function EditItemForm({
    item,
}: {
    item: ItemForm;
}) {
    const initialState: State = { message: null, errors: {} };
    const updateItemWithID = updateItem.bind(null,item.item_id);
    const [state, formAction] = useActionState(updateItemWithID, initialState);
    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="item_name" className="mb-2 block text-sm font-medium">
                        Item Name 
                    </label>
                    <div className="relative">
                        <input 
                            id="item_name"
                            name="item_name"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue={item.item_name}
                        />
                    </div>
                </div>
            </div>

        </form>
    );
}
