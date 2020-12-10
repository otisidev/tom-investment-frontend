import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import { User } from "./../../../../model/user.model";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { GET_SINGLE_EMAIL } from "../../../../queries/user.query";
import { LoadingIcon } from "../../../../components/Button";
import InvestmentForm from "./Form";
import { LOAD_INVESTMENT } from "../../../../queries/investment.query";

const LoadInvestment = () => {
    const title = "Load Investment";

    const _email = localStorage.getItem("load") || "";
    const [user, setUser] = useState<User>();
    const [email, setEmail] = useState<string>(_email);

    const [search, setSearch] = useState(_email ? true : false);

    const [getUserFunc, { loading }] = useLazyQuery(GET_SINGLE_EMAIL, {
        onError: (err) => toast.error(CleanMessage(err.message)),
        onCompleted: (d) => {
            setUser(d.GetUserByEmail.doc);
            setSearch(false);
        },
    });

    const [loadFunc, { loading: iLoading }] = useMutation(LOAD_INVESTMENT, {
        onCompleted: (data) => {
            if (data.NewInvestmentByAdmin) {
                toast.success(data.NewInvestmentByAdmin.message);
                setTimeout(() => {
                    document.location.reload(true);
                    localStorage.removeItem("load");
                }, 500);
            }
        },
    });

    useEffect(() => {
        if (email && search) getUserFunc({ variables: { email } });
    }, [email, search, getUserFunc]);

    return (
        <>
            <Helmet>
                <title>
                    {title} | {AppName}
                </title>
            </Helmet>
            <div className="box px-8 py-16 mt-8" style={{ minHeight: "70vh" }}>
                <div className="intro-y flex items-center">
                    <h2 className="text-lg font-medium mr-auto">{title}</h2>
                </div>
                <LoadingIcon loading={loading || iLoading} />
                <div className="grid grid-cols-12 gap-5 mt-8">
                    <div className="intro-y col-span-12 xl:col-span-4">
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                if (email) {
                                    setSearch(true);
                                }
                            }}
                        >
                            <label>Enter user's email and press enter</label>
                            <input
                                onChange={({ currentTarget: { value } }) => setEmail(value)}
                                type="email"
                                id="email"
                                required
                                className="input w-full border mt-2 placeholder-theme-13"
                                placeholder="Enter email"
                                defaultValue={email}
                            />
                        </form>
                    </div>
                    {user && (
                        <>
                            <div className="intro-y col-span-12 xl:col-span-4">
                                <div className="flex flex-col lg:flex-row items-center p-5">
                                    <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                        <img alt={user.image} className="rounded-full" src={user.image || "/dist/images/profile-5.jpg"} />
                                    </div>
                                    <div className="lg:ml-2 lg:mr-auto text-center lg:text-left mt-3 lg:mt-0">
                                        <div className="font-medium">
                                            {user.firstname} {user.lastname}
                                        </div>
                                        <div className="text-gray-600 text-xs">{user.email}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="intro-y col-span-12 xl:col-span-12">
                                <InvestmentForm
                                    onSubmit={async (item: any) => {
                                        const model = { ...item, user: user.id };
                                        await loadFunc({
                                            variables: {
                                                model,
                                            },
                                        });
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default LoadInvestment;
