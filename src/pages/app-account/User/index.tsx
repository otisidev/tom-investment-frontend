import React, { useState, useEffect } from "react";
import { AppName } from "../../../context/App";
import { Helmet } from "react-helmet";
import { useQuery } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { GET_USERS } from "../../../queries/user.query";
import { LoadingIcon } from "../../../components/Button";
import { Search, Refresh } from "@styled-icons/ionicons-outline";
import PaginationSummary from "../../../components/Paging/Summary";
import PageNumber from "./../../../components/Paging/Number";
import UserItems from "./Items";
// import Select from "react-select";
// import countries from "../../../data/country.json";

const UserManagement = () => {
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(25);
    const [nationality] = useState<any>(null);
    const [user, setUser] = useState<any>(null);

    // get user list
    const { loading, data, refetch, fetchMore } = useQuery(GET_USERS, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        variables: {
            page: page,
            limit: limit,
            nationality: nationality,
            user,
        },
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit, user, nationality },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return { GetUsers: fetchMoreResult.GetUsers };
            },
        });
    }, [page, limit, fetchMore]);

    return (
        <>
            <Helmet>
                <title>User Management | {AppName}</title>
            </Helmet>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">User Management</h2>
            </div>
            <LoadingIcon loading={loading} />
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                    {(user || nationality) && (
                        <button
                            onClick={async () => {
                                setPage(1);
                                setUser(null);
                                await refetch({
                                    page,
                                    limit,
                                    nationality: null,
                                    user: null,
                                });
                            }}
                            className="intro-y button px-2 box mt-4 text-gray-700"
                        >
                            <span className="w-5 h-5 flex items-center justify-center">
                                <Refresh className="w-4 h-4" />
                            </span>
                        </button>
                    )}
                    {data && <PaginationSummary {...data.GetUsers} length={data.GetUsers.docs.length} />}
                    <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                await refetch({
                                    page,
                                    limit,
                                    nationality,
                                    user,
                                });
                            }}
                        >
                            <div className="w-56 relative text-gray-700">
                                <input
                                    defaultValue={user}
                                    onChange={({ currentTarget: { value } }) => setUser(value)}
                                    type="search"
                                    className="input w-56 box pr-10 placeholder-theme-13"
                                    placeholder="Search..."
                                />
                                <Search className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {data && <UserItems items={data.GetUsers.docs} />}
            <div className="mt-5 intro-y">{data && <PageNumber onPageClicked={(page: number) => setPage(page)} {...data.GetUsers} length={data.GetUsers.docs.length} />}</div>
        </>
    );
};

export default UserManagement;
