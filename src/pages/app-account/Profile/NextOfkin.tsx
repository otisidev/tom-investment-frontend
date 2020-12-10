import React, { useState } from "react";
import { authService } from "./../../../services/Authentication.Service";
import { PersonAdd } from "@styled-icons/ionicons-outline";
import { useTranslation } from "react-i18next";
import { LoadingIcon } from "../../../components/Button";
import { Save } from "@styled-icons/feather";
import { imageService } from "../../../services/Image.service";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_KIN } from "../../../queries/user.query";
import { CleanMessage } from "./../../../context/App";
import { UPDATE_KIN } from "./../../../queries/user.query";

const NextOfKinPage = () => {
    const { t } = useTranslation();
    const { next_of_kin } = authService.GetUser();

    const [model, setModel] = useState<any>(next_of_kin);
    const [dp, setDp] = useState<any>(model?.image || "/dist/images/profile.png");

    const [uploading, setUploading] = useState(false);

    const [createFunc, { loading }] = useMutation(CREATE_KIN, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            if (d) {
                toast.success("Next of kin updated successfully!");
                setModel(d);

                const token = authService.GetToken();
                let user = authService.GetUser();
                user.next_of_kin = d;
                authService.Login(user, token);
            }
        },
    });

    const [updateFunc, { loading: uLoading }] = useMutation(UPDATE_KIN, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            if (d) {
                toast.success("Next of kin updated successfully!");
                setModel(d);
                const token = authService.GetToken();
                let user = authService.GetUser();
                user.next_of_kin = d;
                authService.Login(user, token);
            }
        },
    });

    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                if (!next_of_kin) {
                    await createFunc({ variables: { model } });
                } else {
                    const { id, ...update } = model;
                    await updateFunc({ variables: { id, update } });
                }
            }}
        >
            <div className="intro-y box lg:mt-5" style={{ minHeight: "66vh" }}>
                <div className="flex items-center p-5 border-b border-gray-200">
                    <h2 className="font-medium text-base mr-auto">
                        <PersonAdd className="w-4 h-4 mr-2 text-theme-1" /> {t("next_heading")}
                    </h2>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 xl:col-span-8">
                            <div>
                                <label>{t("name.label")}</label>
                                <input
                                    onChange={({ currentTarget: { value } }) => setModel({ ...model, name: value })}
                                    type="text"
                                    required
                                    className="input w-full border mt-2"
                                    placeholder={t("name.placeholder")}
                                    defaultValue={model?.name}
                                />
                            </div>
                            <div className="mt-3">
                                <label>{t("email.label")}</label>
                                <input
                                    type="email"
                                    onChange={({ currentTarget: { value } }) => setModel({ ...model, email: value })}
                                    defaultValue={model?.email}
                                    required
                                    className="input w-full border mt-2"
                                    placeholder={t("email.placeholder")}
                                />
                            </div>
                            <div className="mt-3">
                                <label>{t("relationship.label")}</label>
                                <select
                                    defaultValue={model?.relationship}
                                    required
                                    placeholder={t("relationship.label")}
                                    onChange={({ currentTarget: { value } }) => setModel({ ...model, relationship: value })}
                                    className="input w-full border mt-2"
                                >
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Brother">Brother</option>
                                    <option value="Sister">Sister</option>
                                    <option value="Son">Son</option>
                                    <option value="Daughter">Daughter</option>
                                    <option value="Relation">Relation</option>
                                </select>
                            </div>
                            <div className="mt-3">
                                <label>{t("phone.label")}</label>
                                <input
                                    type="text"
                                    onChange={({ currentTarget: { value } }) => setModel({ ...model, phone: value })}
                                    defaultValue={model?.phone}
                                    required
                                    className="input w-full border mt-2"
                                    placeholder={t("phone.placeholder")}
                                />
                            </div>
                        </div>
                        <div className="col-span-12 xl:col-span-4">
                            <div>
                                <div className="grid grid-cols-12 gap-5">
                                    <div className="col-span-12 xl:col-span-12">
                                        <div className="border border-gray-200 rounded-md p-5">
                                            <div className="w-40 h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                                                <img className="rounded-md" alt={"next"} src={dp} />
                                            </div>
                                            <div className="w-40 mx-auto cursor-pointer relative mt-5">
                                                <button disabled={loading} type="button" className="button w-full bg-theme-1 text-white">
                                                    {uploading || loading ? "Please wait .." : <span>{t("edit_image")}</span>}
                                                </button>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (event) => {
                                                        if (event.currentTarget.validity.valid && event.target.files?.length) {
                                                            // upload service
                                                            setUploading(true);
                                                            const data = await imageService.Upload(event.target.files[0]);
                                                            setUploading(false);
                                                            setModel({ ...model, image: data });
                                                            setDp(data);
                                                        } else toast.info("No file selected!");
                                                    }}
                                                    className="w-full h-full top-0 left-0 absolute opacity-0"
                                                />
                                            </div>
                                            <LoadingIcon loading={uploading} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3"></div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button disabled={false} type="submit" className="button  mr-2 mb-2 flex items-center justify-center bg-theme-1 text-white">
                            <Save className="w-4 h-4 mr-2" /> {t("save_changes")}
                        </button>
                    </div>
                    <LoadingIcon loading={loading || uLoading} />
                </div>
            </div>
        </form>
    );
};

export default NextOfKinPage;
