import React, { FC, useState } from "react";
import { Redirect, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AppName, CleanDate, DefaultImage } from "../../../context/App";
import { User } from "./../../../model/user.model";
import { Mail, Call, Planet, Person, Copy, ArrowBack, Trash, Close, CheckmarkDone } from "@styled-icons/ionicons-outline";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { ADMIN_UPDATE_ACCOUNT, GET_SINGLE, REMOVE_USER, UPDATE_ACCOUNT_TYPE } from "../../../queries/user.query";
import PrimaryButton, { ButtonType, LoadingIcon } from "./../../../components/Button/index";
import { Edit, UserX } from "@styled-icons/feather";
import { authService } from "./../../../services/Authentication.Service";
import { setTimeout } from "timers";
import AccountTypes from "../../../data/account-type.json";
import Select from "react-select";
import countries from "../../../data/country.json";
import walletNames from "../../../data/wallet-name.json";

interface iProp {
    match?: any;
    history?: any;
}

const UserProfile: FC<iProp> = ({ match, history }) => {
    const { id } = match.params;
    const [user, setUser] = useState<User>();
    const [stats, setStats] = useState({
        investment: 0,
        referral: 0
    });
    // account type
    const [edit, setEdit] = useState(false);
    const [update, setUpdate] = useState(false);
    const [accountType, setAccountType] = useState(user?.accountType);
    const { t } = useTranslation();

    const { loading } = useQuery(GET_SINGLE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            setUser(d.GetUser.doc);
            setStats({ ...stats, investment: d.CountInvestment, referral: d.CountReferral });
        },
        variables: { id }
    });

    //   Remove user
    const [deleteFunc, { loading: deleteLoading }] = useMutation(REMOVE_USER, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            toast.success(d.DeleteAccount.message);
            setTimeout(() => {
                document.location.href = "/app/users";
            }, 500);
        }
    });

    const [accountUpdateFunc, { loading: updating }] = useMutation(ADMIN_UPDATE_ACCOUNT, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            toast.success(d.AdminAccountUpdate.message);
            setUpdate(false);
        }
    });
    //   change account type
    const [changeTypeFunc, { loading: changing }] = useMutation(UPDATE_ACCOUNT_TYPE, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            toast.success(d.ChangeAccountType.message);
            setTimeout(() => {
                document.location.reload();
            }, 500);
        }
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
                <h2 className="text-lg font-bold mr-auto uppercase">Profile</h2>
                <button onClick={() => setUpdate(!update)} className="button bg-green-600 text-white">
                    <Edit className="w-5" />
                </button>
            </div>
            {user && !update && (
                <>
                    <div className="intro-y box lg:mt-5">
                        <div className="p-5">
                            <div className="flex flex-col lg:flex-row border-b border-gray-200 pb-5 -mx-5">
                                <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                        <img alt={user.firstname} className="rounded-full" src={user.image || "/dist/images/profile.png"} />
                                    </div>
                                    <div className="ml-5">
                                        <div className=" uppercase font-medium text-lg">
                                            {user.firstname} {user.lastname}
                                        </div>
                                        <div className="text-gray-600">Investor</div>
                                        <div className="text-gray-600 font-semibold">
                                            Duration: <span className="text-yellow-600">{user.duration}</span>{" "}
                                        </div>
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
                    {user.referrer && (
                        <div className="my-4 intro-y flex items-center box px-4 py-8">
                            <div className="w-16 h-16 sm:w-18 sm:h-18 flex-none lg:w-20 lg:h-20 image-fit relative mr-3 bg-yellow-200 border-2 rounded-full">
                                <img alt={user.firstname} className="rounded-full" src={user.referrer.image || DefaultImage} />
                            </div>
                            <div className="mr-auto">
                                <h2 className="font-bold text-lg uppercase">{user.referrer.name}</h2>
                                <span className="text-gray-600 text-xs">{user.referrer.email}</span>
                            </div>
                            <span className="text-teal-600 font-bold uppercase p-2 bg-teal-100 rounded-lg">Referrer</span>
                        </div>
                    )}
                    <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="intro-y box col-span-12 lg:col-span-6 xxl:col-span-4">
                            <div className="p-5">
                                <div className="relative flex items-center">
                                    <div className="ml-4 mr-auto">
                                        <span className="font-medium">{user.walletName || t("wallet.label")}</span>
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
                                <div className="relative flex items-center mt-5">
                                    <div className="ml-4 mr-auto">
                                        <span className="font-medium">Account Type</span>
                                        <div className="w-full text-gray-700 mr-5 sm:mr-5">
                                            {edit ? (
                                                <div className="intro-x">
                                                    <div className="flex items-center justify-between">
                                                        {AccountTypes.map((item, idx) => (
                                                            <label key={idx} htmlFor={idx + ""} className="flex items-center">
                                                                <input
                                                                    checked={accountType === item.value}
                                                                    type="radio"
                                                                    onChange={() => setAccountType(item.value)}
                                                                    className="input border border-gray-300"
                                                                />
                                                                <span className="ml-2">{item.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {/* buttons */}
                                                    <div className="flex items-center my-2">
                                                        <button
                                                            onClick={async () => {
                                                                await changeTypeFunc({ variables: { id: user.id, accountType } });
                                                            }}
                                                            className="mr-4 text-green-600"
                                                        >
                                                            <CheckmarkDone className="w-5" />
                                                        </button>
                                                        <button onClick={() => setEdit(false)} className="text-red-600">
                                                            <Close className="w-5" />
                                                        </button>
                                                    </div>
                                                    <LoadingIcon loading={changing} />
                                                </div>
                                            ) : (
                                                <div className="intro-x">
                                                    <span className="mr-8 text-yellow-600">{user.accountType}</span>
                                                    <Edit
                                                        className="w-4 cursor-pointer text-green-600"
                                                        onClick={() => {
                                                            setAccountType(user.accountType);
                                                            setEdit(true);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="intro-y box col-span-12 lg:col-span-4 xxl:col-span-4">
                            <div className="p-5">
                                <h4 className="font-medium">{t("general.referral")}</h4>
                                <div className="intro-y col-span-12 md:col-span-6">
                                    {user.referred.map((u, i) => (
                                        <div key={i} className="flex flex-col lg:flex-row items-center p-3">
                                            <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                                <img alt={u.firstname} className="rounded-full" src={u.image || DefaultImage} />
                                            </div>
                                            <div className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                                <NavLink to={{ pathname: `/app/user/${u.id}` }} className="font-medium">
                                                    {u.firstname} {u.lastname}
                                                </NavLink>
                                                <div className="text-gray-600 text-xs">{u.email}</div>
                                            </div>
                                            <div className="flex mt-4 lg:mt-0">
                                                <NavLink
                                                    to={{ pathname: `/app/user/${u.id}` }}
                                                    className="button button--sm text-theme-1 border border-theme-1"
                                                >
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
                            <div className="intro-y col-span-12 lg:col-span-2 xxl:col-span-4">
                                <div className="p-5">
                                    <a
                                        href="javascript:;"
                                        data-toggle="modal"
                                        data-target="#delete-box"
                                        className="button w-full mr-2 mb-2 flex items-center justify-center bg-theme-6 text-white"
                                    >
                                        <Trash className="w-4 h-4 mr-2" /> Delete Account
                                    </a>
                                    <NavLink
                                        to="/app/load-investment"
                                        onClick={() => localStorage.setItem("load", user.email)}
                                        className="button w-full mr-2 mb-2 flex items-center justify-center bg-theme-9 text-white"
                                    >
                                        <Copy className="w-4 h-4 mr-2" /> Load Investment
                                    </NavLink>
                                    <button
                                        onClick={() => history.goBack()}
                                        className="button w-full mr-2 mb-2 flex items-center justify-center border-theme-1 text-theme-1 mt-5"
                                    >
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
                                                id
                                            }
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
            {user && update && (
                <div className="intro-y box p-4 my-4">
                    <div className="my-4">
                        <h2 className="font-bold text-lg uppercase">Update Account</h2>
                        <div className="w-6 h-1 bg-yellow-600"></div>
                    </div>
                    <form
                        onSubmit={async (event) => {
                            event.preventDefault();
                            await accountUpdateFunc({
                                variables: {
                                    id: user.id,
                                    model: {
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        email: user.email,
                                        dob: user.dob,
                                        walletAddress: user.dob,
                                        nationality: user.nationality,
                                        phone: user.phone,
                                        gender: user.gender,
                                        duration: user.duration,
                                        walletName: user.walletName
                                    }
                                }
                            });
                        }}
                    >
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                            <div>
                                <label htmlFor="fn">Firstname</label>
                                <input
                                    required
                                    type="text"
                                    id="fn"
                                    defaultValue={user?.firstname}
                                    className="intro-x input w-full input--lg border-2 border-gray-300 hover:border-yellow-600"
                                    onChange={({ currentTarget }) =>
                                        setUser({
                                            ...user,
                                            firstname: currentTarget.value
                                        })
                                    }
                                    placeholder="Enter firstname"
                                />
                            </div>
                            <div>
                                <label htmlFor="ln">Lastname</label>
                                <input
                                    required
                                    type="text"
                                    id="ln"
                                    defaultValue={user.lastname}
                                    className="intro-x input w-full input--lg border-2 border-gray-300 hover:border-yellow-600"
                                    onChange={({ currentTarget }) =>
                                        setUser({
                                            ...user,
                                            lastname: currentTarget.value
                                        })
                                    }
                                    placeholder="Enter lastname"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone">Phone number</label>
                                <input
                                    required
                                    type="text"
                                    id="phone"
                                    defaultValue={user.phone}
                                    className="intro-x input w-full input--lg border-2 border-gray-300 hover:border-yellow-600"
                                    onChange={({ currentTarget }) =>
                                        setUser({
                                            ...user,
                                            phone: currentTarget.value
                                        })
                                    }
                                    placeholder="Enter phone"
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email address</label>
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    defaultValue={user.email}
                                    className="intro-x input w-full input--lg border-2 border-gray-300 hover:border-yellow-600"
                                    onChange={({ currentTarget }) =>
                                        setUser({
                                            ...user,
                                            email: currentTarget.value
                                        })
                                    }
                                    placeholder="Enter email"
                                />
                            </div>
                            <div>
                                <label htmlFor="dob">Date of birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    defaultValue={user.dob}
                                    className="intro-x input w-full input--lg border-2 border-gray-300 hover:border-yellow-600"
                                    onChange={({ currentTarget }) =>
                                        setUser({
                                            ...user,
                                            dob: currentTarget.value
                                        })
                                    }
                                />
                                <span>{CleanDate(user.dob, true, true)}</span>
                            </div>
                            <div>
                                <label htmlFor="wallet">Wallet name</label>
                                <Select
                                    id="wallet"
                                    isMulti={false}
                                    defaultValue={{ value: user.walletName, label: user.walletName }}
                                    onChange={(item: any) =>
                                        setUser({
                                            ...user,
                                            walletName: item.value
                                        })
                                    }
                                    placeholder="Select wallet"
                                    options={walletNames}
                                />
                            </div>
                            <div>
                                <label htmlFor="wallet">Wallet address</label>
                                <input
                                    required
                                    type="text"
                                    id="wallet"
                                    defaultValue={user.wallet_address}
                                    className="intro-x input w-full input--lg border-2 border-gray-300 hover:border-yellow-600"
                                    onChange={({ currentTarget }) =>
                                        setUser({
                                            ...user,
                                            wallet_address: currentTarget.value
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="gender">Gender</label>
                                <Select
                                    id="gender"
                                    isMulti={false}
                                    defaultValue={{ value: user.gender, label: user.gender }}
                                    onChange={(item: any) =>
                                        setUser({
                                            ...user,
                                            gender: item.value
                                        })
                                    }
                                    placeholder="Select Gender"
                                    options={[
                                        { value: "Male", label: "Male" },
                                        { value: "Female", label: "Female" },
                                        { value: "Others", label: "Others" }
                                    ]}
                                />
                            </div>

                            <div>
                                <label htmlFor="nation">Country</label>
                                <Select
                                    onChange={(item: any) =>
                                        setUser({
                                            ...user,
                                            nationality: item.value
                                        })
                                    }
                                    className="border-theme-1"
                                    isMulti={false}
                                    id="nation"
                                    defaultValue={{ value: user.nationality, label: user.nationality }}
                                    placeholder="Select country"
                                    options={countries.map((item) => ({
                                        value: item.name,
                                        label: item.name
                                    }))}
                                />
                            </div>
                            <div>
                                <label htmlFor="duration">Duration</label>
                                <Select
                                    id="duration"
                                    isMulti={false}
                                    defaultValue={{ value: user.duration, label: user.duration }}
                                    onChange={(item: any) =>
                                        setUser({
                                            ...user,
                                            duration: item.value
                                        })
                                    }
                                    placeholder="Select Duration"
                                    options={[
                                        { value: "1 Year", label: "1 Year" },
                                        { value: "6 Months", label: "6 Months" }
                                    ]}
                                />
                            </div>
                            <div className="col-span-2">
                                <PrimaryButton
                                    onClick={() => {}}
                                    type={ButtonType.submit}
                                    loading={updating}
                                    className="button button--lg text-white bg-theme-1 mr-4"
                                >
                                    <CheckmarkDone className="ml-3 h-6" /> Update account
                                </PrimaryButton>
                                <PrimaryButton
                                    onClick={() => setUpdate(false)}
                                    type={ButtonType.button}
                                    loading={false}
                                    className="button button--lg text-red-600 bg-red-100"
                                >
                                    Cancel
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            <LoadingIcon loading={loading} />
        </>
    );
};

export default UserProfile;
