import React, { FC } from "react";
import { ChevronLeft, ChevronRight } from "@styled-icons/feather";

interface iProp {
    page: number;
    limit: number;
    length: number;
    totalDocs: number;
    totalPages: number;
    nextPage: any;
    prevPage: any;
    onPageClicked: any;
}

const PageNumber: FC<iProp> = (props) => {
    const maxPage = 6;

    const makeArrayFromDocs = () => {
        let newList = [];
        for (let i = 0; i < props.totalPages; i++) {
            newList.push(i);
        }
        return newList;
    };

    if (props.totalPages)
        return (
            <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-no-wrap items-center">
                <ul className="pagination">
                    <li>
                        <a
                            onClick={() => {
                                if (props.prevPage) {
                                    props.onPageClicked(props.prevPage);
                                }
                                return;
                            }}
                            className="pagination__link"
                            href="#"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </a>
                    </li>

                    {makeArrayFromDocs()
                        .slice(0, maxPage)
                        .map((item) => (
                            <li key={item}>
                                <a
                                    className={`pagination__link ${props.page === item + 1 && "pagination__link--active"}`}
                                    onClick={() => {
                                        if (item + 1 !== props.page) {
                                            props.onPageClicked(item + 1);
                                        }
                                        return;
                                    }}
                                    tabIndex={0}
                                    href="#"
                                >
                                    {item + 1}
                                </a>
                            </li>
                        ))}
                    {makeArrayFromDocs().length > maxPage && (
                        <li>
                            <a className="pagination__link" href="#">
                                ...
                            </a>
                        </li>
                    )}

                    <li>
                        <a
                            onClick={() => {
                                if (props.nextPage) {
                                    props.onPageClicked(props.nextPage);
                                }
                                return;
                            }}
                            tabIndex={0}
                            className="pagination__link"
                            href="#"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </li>
                </ul>
            </div>
        );

    return null;
};

export default PageNumber;
