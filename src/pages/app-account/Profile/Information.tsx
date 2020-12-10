import React, { FC, useState } from "react";
import { User } from "./../../../model/user.model";
import { Mail, PhoneCall, Globe, User as UserIcon, Shield } from "@styled-icons/feather";
import { useTranslation } from "react-i18next";
import { CleanDate } from "../../../context/App";
import { useQuery } from "@apollo/react-hooks";
import { GET_COUNT_USER } from "../../../queries/statistics.query";

interface IProps {
    user: User;
}

const UserInformation: FC<IProps> = ({ user }) => {
    const { t } = useTranslation();
    const [invests, setInvest] = useState(0);
    const [refs, setRef] = useState(0);

    useQuery(GET_COUNT_USER, {
        onCompleted: (d) => {
            setInvest(d.CountInvestment);
            setRef(d.CountReferral);
        },
    });
    if (user)
        return (
            <div className="intro-y box lg:mt-5">
                <div className="flex items-center p-5 border-b border-gray-200">
                    <h2 className="font-medium text-base mr-auto">
                        <Shield className="w-4 h-4 mr-2 text-theme-1" /> {t("display")}
                    </h2>
                </div>
                <div className="p-5">
                    <div className="flex flex-col lg:flex-row border-b border-gray-200 pb-5 -mx-5">
                        <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                <img alt={user.firstname} className="rounded-full" src={user.image || "/dist/images/profile.png"} />
                            </div>
                            <div className="ml-5">
                                <div className="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">
                                    {user.firstname} {user.lastname}
                                </div>
                                <div className="text-gray-600">Investor</div>
                            </div>
                        </div>
                        <div className="flex mt-6 lg:mt-0 items-center lg:items-start flex-1 flex-col justify-center text-gray-600 px-5 border-l border-r border-gray-200 border-t lg:border-t-0 pt-5 lg:pt-0">
                            <div className="truncate sm:whitespace-normal flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                {user.email}
                            </div>
                            <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                <PhoneCall className="w-4 h-4 mr-2" />
                                {user.phone}
                            </div>
                            <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                <Globe className="w-4 h-4 mr-2" />
                                {user.nationality}
                            </div>
                            <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                <UserIcon className="w-4 h-4 mr-2" />
                                {user.gender}
                            </div>
                        </div>
                        <div className="mt-6 lg:mt-0 flex-1 flex items-center justify-center px-5 border-t lg:border-0 border-gray-200 pt-5 lg:pt-0">
                            <div className="text-center rounded-md w-20 py-3">
                                <div className="font-semibold text-theme-1 text-lg">{invests}</div>
                                <div className="text-gray-600">{t("side.investment")}</div>
                            </div>
                            <div className="text-center rounded-md w-20 py-3">
                                <div className="font-semibold text-theme-1 text-lg">{refs}</div>
                                <div className="text-gray-600">{t("referrer")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="relative flex items-center">
                        <div className="ml-4 mr-auto">
                            <span className="font-medium">{t("wallet.label")}</span>
                            <div className="text-gray-700 mr-5 sm:mr-5">{user.wallet_address}</div>
                        </div>
                    </div>
                    <div className="relative flex items-center mt-5">
                        <div className="ml-4 mr-auto">
                            <span className="font-medium">{t("address.label")}</span>
                            <div className="text-gray-700 mr-5 sm:mr-5">{user.address}</div>
                        </div>
                    </div>
                    <div className="relative flex items-center mt-5">
                        <div className="ml-4 mr-auto">
                            <span className="font-medium">{t("referral_code")}</span>
                            <div className="text-theme-1 mr-5 sm:mr-5">{user.referralCode}</div>
                        </div>
                    </div>
                    <div className="relative flex items-center mt-5">
                        <div className="ml-4 mr-auto">
                            <span className="font-medium">{t("dob.label")}</span>
                            <div className="text-gray-700 mr-5 sm:mr-5">{CleanDate(user.dob, true, false)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );

    return null;
};

export default UserInformation;
