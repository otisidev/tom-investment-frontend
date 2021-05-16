import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import { useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../../context/App";
import { LoadingIcon } from "../../../../components/Button/index";
import CurrencyItems from "./Items";
import NewCurrency from "./NewCurrency";
import { Currency } from "../../../../model/currency.model";
import { GET_CURRENCIES } from "../../../../queries/currency.query";
import { PlusCircle } from "@styled-icons/feather";

const CurrencyApp = () => {
    const [items, setItems] = useState<Array<Currency>>([]);
    const title = "Manage Currency";
    const [newItem, setNewItem] = useState(false);

    const { loading } = useQuery(GET_CURRENCIES, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setItems(d.GetCurrencies.docs);
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
                        Add Currency <PlusCircle className="ml-2 h-6" />
                    </button>
                </div>
            </div>

            <LoadingIcon loading={loading} />
            {!newItem && <CurrencyItems items={items} />}
            {newItem && (
                <NewCurrency
                    onCompleted={(item: Currency) => {
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

export default CurrencyApp;
