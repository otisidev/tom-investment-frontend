import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import PlanItems from "./Items";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_PLANS } from "../../../../queries/plan.query";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { LoadingIcon } from "../../../../components/Button";
import { PlusCircle } from "@styled-icons/feather";
import NewPlan from "./NewPlan";
import { GET_CATEGORIES } from "../../../../queries/category.query";
import { Category } from "../../../../model/category.model";
import { PlanModel } from "./../../../../model/plan.model";

const Plan = () => {
    const title = "Plan Management";
    const [newItem, setNewItem] = useState(false);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [plans, setPlans] = useState<Array<PlanModel>>([]);
    const [category, setCategory] = useState<string>("");

    const [getPlansFunc, { loading }] = useLazyQuery(GET_PLANS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setPlans(d.GetPlans.docs);
        }
    });

    const { loading: getting } = useQuery(GET_CATEGORIES, {
        onError: (ee) => toast.error(CleanMessage(ee.message)),
        onCompleted: (d) => {
            setCategories(d.GetCategories.docs);
        }
    });

    useEffect(() => {
        if (category) getPlansFunc({ variables: { category } });
    }, [category, getPlansFunc]);

    return (
        <>
            <Helmet>
                <title>
                    {title} | {AppName}
                </title>
            </Helmet>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">{title}</h2>
            </div>
            <div className="intro-y box p-8 shadow-lg col-span-12 flex flex-wrap sm:flex-no-wrap items-end mt-2">
                <div className="mr-4">
                    <label htmlFor="category">Select Category</label> <br />
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
                    <button
                        onClick={() => setNewItem(!newItem)}
                        className="button text-white bg-theme-1 flex justify-center items-center shadow-md mr-2"
                    >
                        Add Plan <PlusCircle className="ml-2 h-6" />
                    </button>
                )}
            </div>
            <LoadingIcon loading={loading || getting} />
            {category && !newItem && <PlanItems items={plans} />}
            {newItem && (
                <NewPlan
                    onCompleted={(item: Category) => {
                        const items: any = [...plans, item];
                        setPlans(items);
                        setNewItem(false);
                    }}
                    category={category}
                    onCancel={() => setNewItem(false)}
                />
            )}
        </>
    );
};

export default Plan;
