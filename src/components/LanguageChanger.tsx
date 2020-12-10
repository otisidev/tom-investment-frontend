import React from "react";
import { useTranslation } from "react-i18next";
import lang from "../data/lang.json";

interface iProp {
    showLabel?: boolean;
}
const LanguageChanger: React.FC<iProp> = ({ showLabel = false }) => {
    const { t, i18n } = useTranslation();
    return (
        <div>
            {showLabel && <label htmlFor="lang">{t("currentLang")}</label>}
            <select
                defaultValue={i18n.language}
                onChange={(ev) => {
                    i18n.changeLanguage(ev.target.value);
                    localStorage.setItem("lang", ev.target.value);
                }}
                name="lang"
                className="appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="lang"
            >
                {lang.map((i) => (
                    <option key={i.code} value={i.code}>
                    {i.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageChanger;
