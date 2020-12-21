import React, { useState, FC } from "react";
import { Save } from "@styled-icons/ionicons-outline";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { CleanMessage } from "../../../../context/App";
import { LoadingIcon } from "../../../../components/Button";
import { X } from "@styled-icons/feather";
import { CategoryInput } from "./../../../../model/category.model";
import { CREATE_CATEGORY } from "./../../../../queries/category.query";

interface _ {
    onCancel?: any;
    onCompleted: any;
}

const NewCategory: FC<_> = ({ onCancel, onCompleted }) => {
    const [model, setModel] = useState<CategoryInput>({
        title: "",
        desc: ""
    });

    const [createFunc, { loading }] = useMutation(CREATE_CATEGORY, {
        onCompleted: (data) => {
            if (data.NewCategory) {
                onCompleted(data.NewCategory.doc);
                toast.success(data.NewCategory.message);
            }
        },
        onError: (er) => toast.error(CleanMessage(er.message))
    });

    return (
        <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="intro-y col-span-12 flex flex-col flex-1 sm:px-10 lg:px-5 pb-10 lg:pb-0">
                <div className="intro-y flex-1 box p-16 lg:ml-5 mb-5 lg:mb-0">
                    <h4 className="text-2xl font-medium">New Category</h4>
                    <div className="p-5">
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                if (!model?.title || !model?.desc) {
                                    toast.info("All fields are required!");
                                } else {
                                    await createFunc({
                                        variables: {
                                            model
                                        }
                                    });
                                }
                            }}
                        >
                            <div className="grid grid-cols-12 gap-5">
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label htmlFor="title">Title</label>
                                        <input
                                            onChange={({ currentTarget: { value } }) => setModel({ ...model, title: value })}
                                            type="text"
                                            id="title"
                                            name="title"
                                            required
                                            className="input w-full border mt-2"
                                            placeholder="Enter title"
                                            defaultValue={model?.title}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-6">
                                    <div>
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            required
                                            name="description"
                                            placeholder="Enter description"
                                            onChange={({ currentTarget: { value } }) => setModel({ ...model, desc: value })}
                                            defaultValue={model?.desc}
                                            className="input w-full border mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={onCancel}
                                    type="button"
                                    className="button  mr-4 mb-2  flex items-center justify-center bg-gray-100 shadow-lg text-red-600"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    disabled={false}
                                    type="submit"
                                    className="button  mr-2 mb-2 flex items-center shadow-lg justify-center bg-theme-1 text-white"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Submit
                                </button>
                            </div>
                        </form>
                        <LoadingIcon loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default NewCategory;
