import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AppName, CleanMessage } from "../../../../context/App";
import { PlusCircle } from "@styled-icons/feather";
import { Category } from "./../../../../model/category.model";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { GET_CATEGORIES } from "../../../../queries/category.query";
import { toast } from "react-toastify";
import { LoadingIcon } from "../../../../components/Button";
import { GET_CONTACT_PERSONS } from "../../../../queries/contact-person.query";
import { ContactPersonModel } from "../../../../model/contact-person.model";
import ContactPersonList from "./items";
import NewContactPerson from "./NewContactPerson";
import UpdateContactPerson from "./UpdateContactPerson";

const ContactPerson = () => {
    const title = "Contact Person";
    const [newItem, setNewItem] = useState(false);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [category, setCategory] = useState<string>("");
    const [persons, setPersons] = useState<Array<ContactPersonModel>>([]);
    const [person, setPerson] = useState<ContactPersonModel>();

    const { loading: getting } = useQuery(GET_CATEGORIES, {
        onError: (ee) => toast.error(CleanMessage(ee.message)),
        onCompleted: (d) => {
            setCategories(d.GetCategories.docs);
        }
    });

    const [getPersonFunc, { loading }] = useLazyQuery(GET_CONTACT_PERSONS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setPersons(d.GetContactPersons.docs);
        }
    });
    // get contact persons
    useEffect(() => {
        if (category) getPersonFunc({ variables: { category } });
    }, [category, getPersonFunc]);

    return (
        <>
            <Helmet>
                <title>
                    {title} | {AppName}
                </title>
            </Helmet>
            <div className="intro-y box flex md:justify-between items-center mt-8 p-4 shadow-lg">
                <div className="col-span-12 sm:col-span-6">
                    <h2 className="text-lg font-medium mr-auto">{title}</h2>
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <select
                        onChange={({ currentTarget: { value } }) => {
                            setCategory(value);
                        }}
                        name="Category"
                        className="appearance-none bg-white border shadow-lg font-medium border-purple-600 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-purple-100 focus:border-gray-500"
                        id="category"
                    >
                        <option selected value="">
                            Select Category
                        </option>
                        {categories.map((i) => (
                            <option title={i.desc} key={i.id} value={i.id}>
                                {i.title}
                            </option>
                        ))}
                    </select>
                </div>
                {category && (
                    <div className="col-span-12 sm:col-span-6 ">
                        <button
                            onClick={() => setNewItem(!newItem)}
                            className="button text-white bg-theme-1 flex justify-center items-center shadow-md mr-2"
                        >
                            Add Contact Person <PlusCircle className="ml-2 h-6" />
                        </button>
                    </div>
                )}
            </div>
            <LoadingIcon loading={getting || loading} />

            {!newItem && !person && (
                <div className="intro-y mt-8">
                    <ContactPersonList
                        onDeleted={(item: any) => {
                            const _items = [...persons];
                            const idx = _items.findIndex((c) => c.id === item.id);
                            if (idx !== -1) {
                                _items.splice(idx, 1);
                                setPersons(_items);
                            }
                        }}
                        items={persons}
                        onUpdate={(item: any) => {
                            setPerson(item);
                            setNewItem(false);
                        }}
                    />
                </div>
            )}

            {newItem && !person && (
                <div className="intro-y mt-8">
                    <NewContactPerson
                        category={category}
                        onCompleted={(item: ContactPersonModel) => {
                            const _items = [...persons]; // create a new list from existing one
                            _items.unshift(item); // add newly created person to new list
                            setPersons(_items); // update list
                            setNewItem(false); // close form
                        }}
                        onCancel={() => setNewItem(false)}
                    />
                </div>
            )}

            {person && !newItem && (
                <UpdateContactPerson
                    category={category}
                    person={person}
                    onCompleted={(item: ContactPersonModel) => {
                        const _items = [...persons];
                        const idx = _items.findIndex((c) => c.id === item.id);
                        if (idx !== -1) {
                            _items[idx].name = item.name;
                            _items[idx].email = item.email;
                            _items[idx].phone = item.phone;
                            _items[idx].position = item.position;
                        }
                        setNewItem(false);
                        setPerson(undefined);
                    }}
                    onCancel={() => {
                        setNewItem(false);
                        setPerson(undefined);
                    }}
                />
            )}
        </>
    );
};

export default ContactPerson;
