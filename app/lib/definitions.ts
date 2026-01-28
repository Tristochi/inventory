export type InventoryTable = {
    item_id: string;
    item_name: string;
    category: string;
    unit: string;
    vendor: string;
    quantity: number;
}

export type UserTable = {
    user_id: number;
    username: string;
    password: string;
    created_at: String;
    email: string;
    last_modified_date?: Date;
    last_successful_login?: Date;
    last_unsuccessful_login?: Date;
}