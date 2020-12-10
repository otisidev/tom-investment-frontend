import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ACTIVE, CLOSE_INVESTMENT } from "../../../../queries/investment.query";
import { Refresh, Search } from "@styled-icons/ionicons-outline";
import { LoadingIcon } from "../../../../components/Button";
import PaginationSummary from "../../../../components/Paging/Summary";
import PageNumber from "../../../../components/Paging/Number";
import ActiveInvestmentItems from "./items";

const ActiveInvestment = () => {
    const title = "Active Investments";
    const [limit] = useState<number>(25);
    const [page, setPage] = useState<number>(1);
    const [user, setUser] = useState<any>(null);

    const { loading, data, fetchMore, refetch } = useQuery(GET_ACTIVE, {
        variables: { page, limit, user },
        onError: (er) => toast.error(CleanMessage(er.message)),
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit, user },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return { GetActiveInvestment: fetchMoreResult.GetActiveInvestment };
            },
        });
    }, [page, user, limit, fetchMore]);

    const [closeFunc, { loading: cLoading }] = useMutation(CLOSE_INVESTMENT, {
        update: (caches, { data }) => {
            // read
            let d: any = caches.readQuery({
                query: GET_ACTIVE,
                variables: {
                    page,
                    limit,
                    user,
                },
            });
            // update
            const docs = d.GetActiveInvestment.docs;
            d.GetActiveInvestment.docs.splice(
                docs.findIndex((x: any) => data.CloseInvestment.doc.id === x.id),
                1
            );
            //   reduce totalDocs count by 1
            d.GetActiveInvestment.totalDocs--;
            //   write the new content back
            caches.writeQuery({
                query: GET_ACTIVE,
                variables: {
                    page,
                    limit,
                    user,
                },
                data: {
                    GetActiveInvestment: d.GetActiveInvestment,
                },
            });
        },
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.CloseInvestment) {
                toast.success(data.CloseInvestment.message);
            }
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
            <LoadingIcon loading={loading || cLoading} />
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                    {user && (
                        <button title="Reset Filter" onClick={async () => {}} className="intro-y button px-2 box mt-4 text-gray-700">
                            <span className="w-5 h-5 flex items-center justify-center">
                                <Refresh className="w-4 h-4" />
                            </span>
                        </button>
                    )}
                    {data && <PaginationSummary {...data.GetActiveInvestment} length={data.GetActiveInvestment.docs.length} />}
                    <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
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
            <div className="mt-8">{data && <ActiveInvestmentItems onClose={async (item: any) => await closeFunc({ variables: { id: item.id } })} items={data.GetActiveInvestment.docs} />}</div>
            <div className="mt-5 intro-x">{data && <PageNumber onPageClicked={(page: number) => setPage(page)} {...data.GetActiveInvestment} length={data.GetActiveInvestment.docs.length} />}</div>
        </>
    );
};

export default ActiveInvestment;
