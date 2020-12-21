import React, { FC, useState } from "react";
import { InformationCircle, CloseCircle, ArrowForward } from "@styled-icons/ionicons-outline";
import { CleanMessage } from "./../../../../context/App";
import { Edit3, Trash, X } from "@styled-icons/feather";
import { LoadingIcon } from "../../../../components/Button";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { Category } from "./../../../../model/category.model";
import { UPDATE_CATEGORY } from "../../../../queries/category.query";
import { DELETE_CATEGORY } from "./../../../../queries/category.query";

interface iProps {
    items: Array<Category>;
}

const CategoryItems: FC<iProps> = ({ items }) => {
    const [active, setActive] = useState<number>(-1);
    const [current, setCurrent] = useState<Category>();

    // Update Plan function
    const [updateFunc, { loading: uploading }] = useMutation(UPDATE_CATEGORY, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: (d) => {
            setActive(-1);
            toast.success(d.UpdateCategory.message);
        }
    });

    // delete plan function
    const [deleteFunc, { loading: deleteLoading }] = useMutation(DELETE_CATEGORY, {
        onError: (er) => toast.error(CleanMessage(er.message)),
        onCompleted: () => {
            window.document.location.reload(true);
        }
    });

    if (items.length)
        return (
            <>
                <LoadingIcon loading={deleteLoading || uploading} />
                <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                    <table className="table table-report -mt-2">
                        <thead className="uppercase font-bold">
                            <tr>
                                <th className="text-center whitespace-no-wrap">#</th>
                                <th className="whitespace-no-wrap">Title</th>
                                <th className="whitespace-no-wrap">Description</th>
                                <th className="text-center whitespace-no-wrap">actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx} className="intro-x">
                                    <td className="text-center">
                                        <strong>{idx + 1}</strong>
                                    </td>
                                    <td className="font-bold">
                                        {active === idx ? (
                                            <input
                                                onChange={({ currentTarget: { value, validity } }) => {
                                                    if (validity.valid) {
                                                        items[idx].title = value;
                                                    }
                                                }}
                                                type="text"
                                                name="title"
                                                className="input w-full border mt-2 flex-1"
                                                required
                                                defaultValue={item.title}
                                            />
                                        ) : (
                                            item.title
                                        )}
                                    </td>
                                    <td>
                                        {active === idx ? (
                                            <input
                                                onChange={({ currentTarget: { value, validity } }) => {
                                                    if (validity.valid) {
                                                        items[idx].desc = value;
                                                    }
                                                }}
                                                type="text"
                                                name="desc"
                                                className="input w-full border mt-2 flex-1"
                                                required
                                                defaultValue={item.desc}
                                            />
                                        ) : (
                                            item.desc
                                        )}
                                    </td>
                                    <td className="table-report__action w-56">
                                        {active !== idx ? (
                                            <div className="flex justify-center items-center">
                                                <a
                                                    href="javascript:;"
                                                    onClick={() => {
                                                        setActive(idx);
                                                    }}
                                                    className="flex items-center mr-3 text-theme-9 zoom-in shadow-md p-2"
                                                >
                                                    <Edit3 className="w-4 h-4 mr-1" /> Edit
                                                </a>
                                                <a
                                                    href="javascript:;"
                                                    onClick={() => {
                                                        setActive(-1);
                                                        setCurrent(item);
                                                    }}
                                                    data-toggle="modal"
                                                    data-target="#delete-box"
                                                    className="flex items-center mr-3 text-theme-6 zoom-in shadow-md p-2"
                                                >
                                                    <Trash className="w-4 h-4 mr-1" /> Delete
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActive(-1);
                                                    }}
                                                    className="flex items-center mr-3 text-theme-6 zoom-in shadow-md p-2"
                                                >
                                                    <X className="w-4 h-4 mr-1" /> Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        if (!item?.title || !item?.desc) {
                                                            toast.info("All fields are required!");
                                                        } else {
                                                            await updateFunc({
                                                                variables: {
                                                                    id: item?.id,
                                                                    update: {
                                                                        title: item?.title,
                                                                        desc: item?.desc
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    className="flex items-center mr-3 text-theme-9 zoom-in shadow-md p-2"
                                                >
                                                    <ArrowForward className="w-4 h-4 mr-1" /> Submit
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="modal" id="delete-box">
                    <div className="modal__content">
                        <div className="p-5 text-center">
                            <CloseCircle className="w-16 h-16 text-theme-6 mx-auto mt-3" />
                            <div className="text-3xl mt-5">Delete Plan</div>
                            <div className="text-gray-600 mt-2">Are you sure you want to delete this category?</div>
                        </div>
                        <div className="px-5 pb-8 text-center">
                            <LoadingIcon loading={deleteLoading} />
                            <button type="button" data-dismiss="modal" className="button w-24 border text-gray-700 mr-1">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => await deleteFunc({ variables: { id: current?.id } })}
                                className="button w-24 bg-theme-6 text-white"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    return (
        <div className="flex flex-col items-center py-16" style={{ minHeight: "60vh", alignItems: "center" }}>
            <InformationCircle className="w-16 h-16 text-theme-1 mx-auto mt-5" />
            <p className="text-gray-600 text-2xl mx-auto mt-5">No Category is added yet!</p>
        </div>
    );
};
export default CategoryItems;
