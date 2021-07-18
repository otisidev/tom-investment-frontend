import { useMutation, useQuery } from "@apollo/react-hooks";
import { RefreshCcw } from "@styled-icons/feather";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import PaginationSummary from "../../../../components/Paging/Summary";
import { AppName, CleanMessage } from "../../../../context/App";
import { toast } from "react-toastify";
import PageNumber from "../../../../components/Paging/Number";
import { APPROVE_TOP_UP, GET_TOP_UP_REQUEST } from "../../../../queries/investment.query";
import { LoadingIcon } from "../../../../components/Button";
import PendingInvestmentList from "./items";
import { Wallet } from "@styled-icons/ionicons-outline";
import { CANCEL_TOP_UP } from "./../../../../queries/investment.query";

const TopUpRequest = () => {
    const title = "Investment Top-up Request";
    const [page, setPage] = useState<number>(1);
    const [items, setItems] = useState<Array<any>>([]);
    const [pageProps, setPageProps] = useState<any>();
    const limit = 25;

    const { loading, refetch } = useQuery(GET_TOP_UP_REQUEST, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            if (d) {
                const { docs, ...props } = d.GetTopUpForApproval;
                setItems(docs);
                setPageProps(props);
            }
        },
        variables: { page, limit },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "network-only"
    });

    // APPROVE_TOP_UP
    const [approveFunc, { loading: __loading }] = useMutation(APPROVE_TOP_UP, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            const { message, doc } = d.ApproveTopUp;
            toast.success(message);
            const index = items.findIndex((x) => x.id === doc.id);
            if (index !== -1) {
                const _items = [...items];
                _items.splice(index, 1);
                setItems(_items);
            }
        }
    });

    // CANCEL_TOP_UP
    const [cancelFunc, { loading: c__loading }] = useMutation(CANCEL_TOP_UP, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            const { message, doc } = d.CancelTopUp;
            toast.success(message);
            const index = items.findIndex((x) => x.id === doc.id);
            if (index !== -1) {
                const _items = [...items];
                _items.splice(index, 1);
                setItems(_items);
            }
        }
    });

    return (
        <>
            <Helmet>
                <title>
                    {title} | {AppName}
                </title>
            </Helmet>
            <div className="flex items-center  mt-6 gap-4">
                <h2 className="text-lg intro-y font-bold mb-4 xl:mb-0 uppercase tracking-wider mr-auto">
                    <span className="p-2 bg-theme-1 text-white mr-2 item-center rounded-full hidden sm:inline">
                        <Wallet className="w-6 h-6" />
                    </span>
                    {title}
                </h2>
                {!loading && pageProps && (
                    <div className="mr-4">
                        <PaginationSummary {...pageProps} length={items.length} />
                    </div>
                )}

                <button onClick={() => refetch()} className="w-12 bg-white text-gray-600 p-3 rounded-lg shadow">
                    <RefreshCcw className="w-6 h-6" />
                </button>
            </div>
            <LoadingIcon loading={loading || __loading || c__loading} />
            {/* LIST GOES HERE */}
            {!loading && (
                <PendingInvestmentList
                    items={items}
                    onApprove={async (idx: number) => {
                        if (idx !== -1 && window.confirm("Are you sure you want to confirm this top-up?")) {
                            await approveFunc({ variables: { id: items[idx].id } });
                        }
                    }}
                    onCancel={async (idx: number) => {
                        if (idx !== -1 && window.confirm("Are you sure you want to cancel this top-up?")) {
                            await cancelFunc({ variables: { id: items[idx].id } });
                        }
                    }}
                />
            )}
            {!loading && pageProps && (
                <div className="mt-8">
                    <PageNumber onPageClicked={(page: number) => setPage(page)} {...pageProps} length={items.length} />
                </div>
            )}
        </>
    );
};

export default TopUpRequest;
