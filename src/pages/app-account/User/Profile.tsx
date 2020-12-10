import React, { FC, useState } from "react";
import { Redirect, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AppName, CleanDate } from "../../../context/App";
import { User } from "./../../../model/user.model";
import { Mail, Call, Planet, Person, Copy, ArrowBack, Trash } from "@styled-icons/ionicons-outline";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { GET_SINGLE, REMOVE_USER } from "../../../queries/user.query";
import { LoadingIcon } from "./../../../components/Button/index";
import { UserX } from "@styled-icons/feather";
import { authService } from "./../../../services/Authentication.Service";
import { setTimeout } from "timers";

interface iProp {
    match?: any;
    history?: any;
}

const UserProfile: FC<iProp> = ({ match, history }) => {
    const { id } = match.params;
    const [user, setUser] = useState<User>();
    const [stats, setStats] = useState({
        investment: 0,
        referral: 0,
    });
    const { t } = useTranslation();

    const { loading } = useQuery(GET_SINGLE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setUser(d.GetUser.doc);
            setStats({ ...stats, investment: d.CountInvestment, referral: d.CountReferral });
        },
        variables: { id },
    });

    //   Remove user
    const [deleteFunc, { loading: deleteLoading }] = useMutation(REMOVE_USER, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            toast.success(d.DeleteAccount.message);
            setTimeout(() => {
                document.location.href = "/app/users";
            }, 500);
        },
    });

    const { admin } = authService.GetUser();

    if (!id) return <Redirect to="/app/users" />;

    return (
        <>
            <Helmet>
                <title>
                    {user?.firstname || "Profile"} | {AppName}
                </title>
            </Helmet>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Profile</h2>
            </div>
            {user && (
                <>
                    <div className="intro-y box lg:mt-5">
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
                                        <Mail className="w-4 h-4 mr-2 text-theme-1" />
                                        {user.email}
                                    </div>
                                    <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                        <Call className="w-4 h-4 mr-2 text-theme-1" />
                                        {user.phone}
                                    </div>
                                    <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                        <Planet className="w-4 h-4 mr-2 text-theme-1" />
                                        {user.nationality}
                                    </div>
                                    <div className="truncate sm:whitespace-normal flex items-center mt-3">
                                        <Person className="w-4 h-4 mr-2 text-theme-1" />
                                        {user.gender}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="intro-y box col-span-12 lg:col-span-6">
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
                                <div className="relative flex items-center mt-5">
                                    <div className="ml-4 mr-auto">
                                        <span className="font-medium">{t("date.joining")}</span>
                                        <div className="text-gray-700 mr-5 sm:mr-5">{CleanDate(user.created_at, true)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="intro-y box col-span-12 lg:col-span-4">
                            <div className="p-5">
                                <h4 className="font-medium">{t("general.referral")}</h4>
                                <div className="intro-y col-span-12 md:col-span-6">
                                    {user.referred.map((u, i) => (
                                        <div key={i} className="flex flex-col lg:flex-row items-center p-3">
                                            <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                                <img alt={u.firstname} className="rounded-full" src={u.image || "/dist/images/profile-5.jpg"} />
                                            </div>
                                            <div className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                                <NavLink to={{ pathname: `/app/user/${u.id}` }} className="font-medium">
                                                    {u.firstname} {u.lastname}
                                                </NavLink>
                                                <div className="text-gray-600 text-xs">{u.email}</div>
                                            </div>
                                            <div className="flex mt-4 lg:mt-0">
                                                <NavLink to={{ pathname: `/app/user/${u.id}` }} className="button button--sm text-theme-1 border border-theme-1">
                                                    Profile
                                                </NavLink>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {user.referred.length === 0 && (
                                    <div className="intro-y col-span-12 md:col-span-6 text-center">
                                        <h6 className="font-medium mt-16">{t("referral.message")}</h6>
                                    </div>
                                )}
                            </div>
                        </div>
                        {admin && (
                            <div className="intro-y col-span-12 lg:col-span-2">
                                <div className="p-5">
                                    <a href="javascript:;" data-toggle="modal" data-target="#delete-box" className="button w-full mr-2 mb-2 flex items-center justify-center bg-theme-6 text-white">
                                        <Trash className="w-4 h-4 mr-2" /> Delete Account
                                    </a>
                                    <NavLink
                                        to="/app/load-investment"
                                        onClick={() => localStorage.setItem("load", user.email)}
                                        className="button w-full mr-2 mb-2 flex items-center justify-center bg-theme-9 text-white"
                                    >
                                        <Copy className="w-4 h-4 mr-2" /> Load Investment
                                    </NavLink>
                                    <button onClick={() => history.goBack()} className="button w-full mr-2 mb-2 flex items-center justify-center border-theme-1 text-theme-1 mt-5">
                                        <ArrowBack className="w-4 h-4 mr-2" /> Go Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal" id="delete-box">
                        <div className="modal__content">
                            <div className="p-5 text-center">
                                <UserX className="w-16 h-16 text-theme-6 mx-auto mt-3" />
                                <div className="text-3xl mt-5">Delete User? </div>
                                <div className="text-gray-600 mt-2">Are you sure you want to delete this {user.firstname}?</div>
                            </div>
                            <div className="px-5 pb-8 text-center">
                                <LoadingIcon loading={deleteLoading} />
                                <button type="button" data-dismiss="modal" className="button w-24 border text-gray-700 mr-1">
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await deleteFunc({
                                            variables: {
                                                id,
                                            },
                                        });
                                    }}
                                    className="button w-24 bg-theme-6 text-white"
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <LoadingIcon loading={loading} />
        </>
    );
};

export default UserProfile;
