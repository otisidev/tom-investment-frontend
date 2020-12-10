import React, { useState } from "react";
import { authService } from "./../../../services/Authentication.Service";
import { X, Image } from "@styled-icons/feather";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CleanMessage } from "./../../../context/App";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_IMAGE } from "../../../queries/user.query";
import { LoadingIcon } from "../../../components/Button";
import { imageService } from "../../../services/Image.service";

const UpdateImage = () => {
    const { image, firstname } = authService.GetUser();
    const { t } = useTranslation();
    const [dp, setDp] = useState(image);
    const [uploading, setUploading] = useState(false);

    const [updateImageFunc, { loading }] = useMutation(UPDATE_IMAGE, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (data) => {
            if (data.UpdateProfile) {
                toast.success(data.UpdateProfile.message);

                const token = authService.GetToken();
                // update local storage
                authService.Login(data.UpdateProfile.doc, token);
                setDp(data.UpdateProfile.doc.image);
                // document.location.href = "/app/profile/change-image";
            }
        },
    });
    return (
        <div className="intro-y box lg:mt-5" style={{ minHeight: "65vh" }}>
            <div className="flex items-center p-5 border-b border-gray-200">
                <h2 className="font-medium text-base mr-auto">
                    <Image className="w-4 h-4 mr-2 text-theme-1" /> {t("change_image")}
                </h2>
            </div>
            <div className="p-5">
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 xl:col-span-12">
                        <div className="border border-gray-200 rounded-md p-5">
                            <div className="w-40 h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                                <img className="rounded-md" alt={firstname} src={dp || "dist/images/profile.png"} />
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
                                            if (data) await updateImageFunc({ variables: { path: data } });
                                            else toast.error("Unable to upload image!");
                                        } else {
                                            toast.info("No file selected!");
                                        }
                                    }}
                                    className="w-full h-full top-0 left-0 absolute opacity-0"
                                />
                            </div>
                            <LoadingIcon loading={loading || uploading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateImage;
