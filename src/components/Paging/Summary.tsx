import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface iProp {
    page: number;
    limit: number;
    length: number;
    totalDocs: number;
}

const PaginationSummary: FC<iProp> = (props) => {
    const getPageNumber = () => (props.page - 1) * props.limit + 1;
    const { t } = useTranslation();

    return (
        <div className="hidden md:block mx-auto text-gray-600">
            {t("pagination.showing")} <strong>{getPageNumber()}</strong> {t("pagination.to")} <strong>{getPageNumber() + props.length - 1}</strong> {t("pagination.from")}{" "}
            <strong>{props.totalDocs}</strong> {t("pagination.entires")}
        </div>
    );
};

export default PaginationSummary;
