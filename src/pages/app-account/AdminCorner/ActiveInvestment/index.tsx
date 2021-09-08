import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AppName } from "../../../../context/App";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../../context/App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ACTIVE, CLOSE_INVESTMENT, CREDIT_INVESTMENT, ADMIN_TOP_UP_INVESTMENT } from "../../../../queries/investment.query";
import { Refresh, Search } from "@styled-icons/ionicons-outline";
import { LoadingIcon } from "../../../../components/Button";
import PaginationSummary from "../../../../components/Paging/Summary";
import PageNumber from "../../../../components/Paging/Number";
import ActiveInvestmentItems from "./items";

const ActiveInvestment = () => {
    const title = "Active Investments";
    const [limit] = useState<number>(25);
    const [page, setPage] = useState<number>(parseInt(localStorage.getItem("_page") || "1"));
    const [user, setUser] = useState<any>(null);
    const [search, setSearch] = useState<any>(null);
    const [items, setItems] = useState<Array<any>>([]);
    const [pageProps, setPageProps] = useState<any>();

    const { loading, data, fetchMore } = useQuery(GET_ACTIVE, {
        variables: { page, limit, user },
        onError: (er) => toast.error(CleanMessage(er.message)),
        notifyOnNetworkStatusChange: true,
        onCompleted: (d) => {
            if (d.GetActiveInvestment) {
                const { docs, ...props } = d.GetActiveInvestment;
                setItems(docs);
                setPageProps(props);
            }
        }
    });

    const [creditFunc, { loading: __loading }] = useMutation(CREDIT_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            document.location.reload();
        }
    });
    const [topUpFunc, { loading: top__loading }] = useMutation(ADMIN_TOP_UP_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            document.location.reload();
        }
    });
    useEffect(() => {
        fetchMore({
            variables: { page, limit, user },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                const { docs, ...props } = fetchMoreResult.GetActiveInvestment;
                setItems(docs);
                setPageProps(props);
                return { GetActiveInvestment: fetchMoreResult.GetActiveInvestment };
            }
        });
    }, [page, user, limit, fetchMore]);

    const [closeFunc, { loading: cLoading }] = useMutation(CLOSE_INVESTMENT, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.CloseInvestment) {
                const { message, doc } = data.CloseInvestment;
                const idx = items.findIndex((x) => x.id === doc.id);
                const _items = [...items];
                _items.splice(idx, 1);
                setItems(_items);
                toast.success(message);
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
            <div className="intro-y flex items-center mt-8 mb-8">
                <h2 className="text-lg font-medium mr-auto">{title}</h2>
            </div>
            <LoadingIcon loading={loading || cLoading || __loading || top__loading} />
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                    {user && (
                        <button title="Reset Filter" onClick={async () => {}} className="intro-y button px-2 box mt-4 text-gray-700">
                            <span className="w-5 h-5 flex items-center justify-center">
                                <Refresh className="w-4 h-4" />
                            </span>
                        </button>
                    )}
                    {data && <PaginationSummary {...pageProps} length={items.length} />}
                    <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                setUser(search);
                            }}
                        >
                            <div className="w-56 relative text-gray-700">
                                <input
                                    defaultValue={search}
                                    onChange={({ currentTarget: { value } }) => setSearch(value)}
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
            <div className="mt-8">
                {data && (
                    <ActiveInvestmentItems
                        onClose={async (item: any) => await closeFunc({ variables: { id: item.id } })}
                        items={items}
                        onCredit={async (model: any) => await creditFunc({ variables: { model } })}
                        onTopUp={async (model: any) => await topUpFunc({ variables: { ...model } })}
                    />
                )}
            </div>
            <div className="mt-5 intro-x">
                {data && (
                    <PageNumber
                        onPageClicked={(page: number) => {
                            setPage(page);
                            localStorage.setItem("_page", page + "");
                        }}
                        {...pageProps}
                        length={items.length}
                    />
                )}
            </div>
        </>
    );
};

export default ActiveInvestment;
