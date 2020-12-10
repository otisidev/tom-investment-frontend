import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../context/App";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { LoadingIcon } from "../../../components/Button";
import { Copy } from "@styled-icons/feather";
import { authService } from "./../../../services/Authentication.Service";
import { GET_REFERRALS } from "../../../queries/referral.query";
import ReferrerItems from "./items";
import { GET_COUNT_USER } from "../../../queries/statistics.query";

const YourReferral = () => {
    const { t } = useTranslation();
    const [invest, setInvest] = useState(0);
    const { referralCode } = authService.GetUser();
    useQuery(GET_COUNT_USER, {
        onCompleted: (d) => {
            setInvest(d.CountReferral);
        },
    });

    const { loading, data } = useQuery(GET_REFERRALS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
    });
    return (
        <>
            <Helmet>
                <title>
                    {t("referrer")} | {AppName}
                </title>
            </Helmet>
            <h2 className="intro-y text-lg font-medium mt-10">{t("referrer")}</h2>
            <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                <div className="mr-2 mx-auto text-gray-600 sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">Invite a friend to invest using your referral code</div>
                <div className="hidden md:block mx-auto text-gray-600 ">{t("referral.message")}</div>
                <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                    <div className="w-56 relative text-gray-700">
                        <input title="referral code" defaultValue={referralCode} disabled={true} type="text" className="input w-56 box pr-10 placeholder-theme-13" placeholder="Search..." />
                        <Copy className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
                        {/* <i className="" data-feather="search"></i> */}
                    </div>
                </div>
            </div>

            <LoadingIcon className="text-theme-1" loading={loading} />

            {data && !loading && <ReferrerItems items={data.GetReferrals.docs} />}
            <div className="mt-8">
                <span className="button w-56 rounded-full mr-1 mb-2 bg-theme-14 text-theme-10 font-medium">
                    {t("general.referral")}: {invest}
                </span>
            </div>
        </>
    );
};

export default YourReferral;
