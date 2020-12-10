import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../context/App";
import { useTranslation } from "react-i18next";
import Investments from "./Investments";
import { Plus } from "@styled-icons/feather";
import { useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { LoadingIcon } from "../../../components/Button";
import { GET_YOUR_INVESTMENT } from "../../../queries/investment.query";
import NewInvestment from "./NewInvestment";

const YourInvestment = () => {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const [newItem, setNewItem] = useState(false);

    const { loading, data, fetchMore } = useQuery(GET_YOUR_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        variables: { page, limit },
    });

    return (
        <>
            <Helmet>
                <title>
                    {t("investment")} | {AppName}
                </title>
            </Helmet>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">{t("investment")}</h2>
            </div>
            <div className="flex justify-end">
                <button onClick={() => setNewItem(!newItem)} className="button mr-2 mb-2 flex items-center border justify-center bg-theme-14 text-theme-10">
                    {t("investment.new")}
                    <Plus className="w-4 h-4 ml-2" />
                </button>
            </div>

            <LoadingIcon loading={loading} />

            {!newItem && !loading && data && <Investments items={data.GetUserInvestments.docs} />}
            {newItem && <NewInvestment onCancel={() => setNewItem(!newItem)} />}

            
        </>
    );
};
export default YourInvestment;
