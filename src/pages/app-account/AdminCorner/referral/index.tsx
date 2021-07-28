import { useMutation, useQuery } from "@apollo/react-hooks";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { LoadingIcon } from "../../../../components/Button";
import { AppName, CleanMessage, DefaultImage } from "../../../../context/App";
import { IUser } from "../../../../model/user.model";
import { GET_USERS, NEW_REFERRAL } from "../../../../queries/user.query";

export function UserReferral() {
    const title = "User Referral";
    const [users, setUsers] = useState<Array<IUser>>([]);
    const [referrer, setReferrer] = useState<IUser>();
    const [referred, setReferred] = useState<IUser>();

    const { loading } = useQuery(GET_USERS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setUsers(d.GetUsers.docs);
        },
        variables: { page: 1, limit: 10000 }
    });

    const [addFunc, { loading: __loading }] = useMutation(NEW_REFERRAL, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            toast.success(d.NewReferral.message);
            setReferred(undefined);
            setReferrer(undefined);
        }
    });

    return (
        <>
            <Helmet>
                <title>
                    {title} | {AppName}
                </title>
            </Helmet>

            <div className="intro-y">
                {/* HEADER */}
                <div className="my-6">
                    <h2 className="text-lg uppercase font-semibold">User Referral Linking</h2>
                    <div className="w-6 h-1 bg-yellow-600"></div>
                </div>

                {/* LIST */}
                <LoadingIcon loading={loading} className="my-4" />
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <div className="box p-4">
                        <div>
                            <h3 className="text-base uppercase font-semibold">Referrer</h3>
                            <div className="h-1 w-6 bg-yellow-500"></div>
                        </div>

                        <div className="my-4">
                            <select
                                value={referrer?.id}
                                name="referrer"
                                id="referrer"
                                onChange={({ currentTarget: { value } }) => {
                                    const item = users.find((c) => c.id === value);
                                    if (item) setReferrer(item);
                                }}
                                className="w-full login__input input rounded-lg border-2 border-gray-300 hover:border-yellow-600 mb-2"
                            >
                                <option>Please User</option>
                                {users.map((item, idx) => (
                                    <option key={idx} value={item.id}>
                                        {item.name} ({item.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {referrer && <UserInfo user={referrer} />}
                    </div>
                    <div className="box p-4">
                        <div>
                            <h3 className="text-base uppercase font-semibold">Referred</h3>
                            <div className="h-1 w-6 bg-yellow-500"></div>
                        </div>
                        <div className="my-4">
                            <select
                                value={referred?.id}
                                name="referred"
                                id="referred"
                                onChange={({ currentTarget: { value } }) => {
                                    const item = users.find((c) => c.id === value);
                                    if (item) setReferred(item);
                                }}
                                className="w-full login__input input rounded-lg border-2 border-gray-300 hover:border-yellow-600 mb-2"
                            >
                                <option>Please User</option>
                                {users.map((item, idx) => (
                                    <option key={idx} value={item.id}>
                                        {item.name} ({item.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {referred && <UserInfo user={referred} />}
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (referred && referrer && referrer.id !== referred.id) {
                            await addFunc({ variables: { referrer: referrer.id, referred: referred.id } });
                        }
                    }}
                    className="button button--lg my-4 shadow bg-green-600 text-white transition duration-500 ease-in-out p-2 uppercase hover:bg-green-400"
                >
                    Assign Referrer
                </button>
                <LoadingIcon loading={__loading} className="my-2" />
            </div>
        </>
    );
}

type IPops = {
    user: IUser;
};

function UserInfo({ user }: IPops) {
    return (
        <div className="intro-y flex items-center px-4">
            <img
                className="w-16 h-16 object-cover rounded-full border-2 border-yellow-600 shadow  mr-4"
                src={user.image || DefaultImage}
                alt={user.name}
            />
            <div className="mr-auto">
                <h2 className="font-bold text-lg">{user.name}</h2>
                <span className="text-gray-600">{user.email}</span>
            </div>
        </div>
    );
}
