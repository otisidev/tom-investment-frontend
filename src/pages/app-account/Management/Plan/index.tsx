import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import PlanItems from "./Items";
import { useQuery } from "@apollo/react-hooks";
import { GET_PLANS } from "../../../../queries/plan.query";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { LoadingIcon } from "../../../../components/Button";
import { PlusCircle } from "@styled-icons/feather";
import NewPlan from "./NewPlan";

const Plan = () => {
    const title = "Plan Management";
    const [newItem, setNewItem] = useState(false);

    const { loading, data } = useQuery(GET_PLANS, {
        onError: (e) => toast.error(CleanMessage(e.message)),
    });

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
            <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                <button onClick={() => setNewItem(!newItem)} className="button text-white bg-theme-1 flex justify-center items-center shadow-md mr-2">
                    Add Plan <PlusCircle className="ml-2 h-6" />
                </button>
            </div>
            <LoadingIcon loading={loading} />
            {data && !newItem && <PlanItems items={data.GetPlans.docs} />}
            {newItem && <NewPlan />}
        </>
    );
};

export default Plan;
