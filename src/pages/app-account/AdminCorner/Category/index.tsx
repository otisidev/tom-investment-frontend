import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import { Category } from "./../../../../model/category.model";
import { useQuery } from "@apollo/react-hooks";
import { GET_CATEGORIES } from "./../../../../queries/category.query";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { LoadingIcon } from "./../../../../components/Button/index";
import CategoryItems from "./Items";
import { PlusCircle } from "@styled-icons/feather";
import NewCategory from "./NewCategory";

const CategoryApp = () => {
    const [items, setItems] = useState<Array<Category>>([]);
    const title = "Manage Category";
    const [newItem, setNewItem] = useState(false);

    const { loading } = useQuery(GET_CATEGORIES, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setItems(d.GetCategories.docs);
        }
    });

    return (
        <>
            <Helmet>
                <title>
                    {title}| {AppName}
                </title>
            </Helmet>

            <div className="intro-y flex justify-between mt-8">
                <div className="col-span-12 sm:col-span-6">
                    <h2 className="text-lg font-medium mr-auto">{title}</h2>
                </div>
                <div className="col-span-12 sm:col-span-6 ">
                    <button
                        onClick={() => setNewItem(!newItem)}
                        className="button text-white bg-theme-1 flex justify-center items-center shadow-md mr-2"
                    >
                        Add Category <PlusCircle className="ml-2 h-6" />
                    </button>
                </div>
            </div>

            <LoadingIcon loading={loading} />
            {!newItem && <CategoryItems items={items} />}
            {newItem && (
                <NewCategory
                    onCompleted={(item: Category) => {
                        const _items = [...items];
                        _items.unshift(item);
                        setItems(_items);
                        setNewItem(false);
                    }}
                    onCancel={() => setNewItem(false)}
                />
            )}
        </>
    );
};

export default CategoryApp;
