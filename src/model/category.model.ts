export interface Category {
    id: string;
    title: string;
    desc?: string;
}

export interface CategoryInput {
    title: string;
    desc: string;
}
