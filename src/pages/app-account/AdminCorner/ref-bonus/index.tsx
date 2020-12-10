import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import { useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { PAYABLE_REFERRALS } from "../../../../queries/referral.query";
import ReferralItems from "./items";
import { LoadingIcon } from "../../../../components/Button";

const ReferralBonus = () => {
    const title = "Referral Bonus";
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(25);

    const { loading, data, fetchMore } = useQuery(PAYABLE_REFERRALS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        variables: {
            page,
            limit,
        },
    });

    return (
        <>
            <Helmet>
                <title>
                    {title} | {AppName}
                </title>
            </Helmet>
            <div className="intro-y flex items-center mt-8 mb-8">
                <h2 className="text-lg font-medium mr-auto">{title}</h2>
            </div>

            <LoadingIcon loading={loading} />
            {data && <ReferralItems items={data.GetPayableReferrals.docs} />}
        </>
    );
};
export default ReferralBonus;
