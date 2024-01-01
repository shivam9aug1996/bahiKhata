"use client";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";
import { customerApi } from "../redux/features/customerSlice";
import { dashboardApi } from "../redux/features/dashboardSlice";
import { supplierApi } from "../redux/features/supplierSlice";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "../redux/features/transactionSlice";
import { isValidData, todayDate } from "../utils/function";
import Loader from "./Loader";

export default function TransactionModal({ isOpen, partyId, setIsOpen }) {
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [images, setImages] = useState([]); // State to store uploaded images
  const [previewImages, setPreviewImages] = useState([]);

  const [
    createTransaction,
    {
      isSuccess: isCreateTransactionSuccess,
      isLoading: isCreateTransactionLoading,
      isError: isCreateTransactionError,
      error: createTransactionError,
      data: createTransactionData,
    },
  ] = useCreateTransactionMutation({
    // businessId: businessIdSelected,
    // partyId: partyId,
  });
  const [
    updateTransaction,
    {
      isSuccess: isUpdateTransactionSuccess,
      isLoading: isUpdateTransactionLoading,
      isError: isUpdateTransactionError,
      error: updateTransactionError,
      data: updateTransactionData,
    },
  ] = useUpdateTransactionMutation({
    // businessId: businessIdSelected,
    // partyId: partyId,
  });
  useErrorNotification(createTransactionError, isCreateTransactionError);
  useErrorNotification(updateTransactionError, isUpdateTransactionError);
  useSuccessNotification(
    "Transaction created successfully",
    null,
    isCreateTransactionSuccess
  );
  useSuccessNotification(
    "Transaction updated successfully",
    null,
    isUpdateTransactionSuccess
  );

  const [formData, setFormData] = useState({
    amount: "",
    type: "credit", // Default value for type as "credit"
    description: "", // Add description field
    date: todayDate(),
  });

  useEffect(() => {
    if (isOpen?.value && isOpen?.type == "edit" && isOpen?.status == true) {
      setFormData({
        date: isOpen?.value?.date,
        amount: isOpen?.value?.amount,
        type: isOpen?.value?.type,
        description: isOpen?.value?.description,
      });
      //setPreviewImages(isOpen?.value?.imageUrl);
      let data = [];
      let imageArr = isOpen?.value?.imageUrl;
      for (let i = 0; i < imageArr?.length; i++) {
        data.push({ type: "edit", image: imageArr[i], id: `image_${i}` });
      }
      setImages(data);
    }
  }, [isOpen]);
  //let [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (isCreateTransactionSuccess || isUpdateTransactionSuccess) {
      if (pathname.includes("customer")) {
        dispatch(customerApi.util.invalidateTags(["customer"]));
        dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      } else {
        dispatch(supplierApi.util.invalidateTags(["supplier"]));
        dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      }

      closeModal();
    }
  }, [isCreateTransactionSuccess, isUpdateTransactionSuccess]);

  function closeModal() {
    setFormData({
      amount: "",
      type: "credit", // Default value for type as "credit"
      description: "", // Add description field
      date: todayDate(),
    });
    setIsOpen({ ...isOpen, status: false });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Handle form submission logic here

    if (isOpen?.type == "edit") {
      const formRes = new FormData();
      formRes.append("partyId", partyId);
      formRes.append("businessId", businessIdSelected);
      formRes.append(
        "partyType",
        pathname.includes("customer") ? "customer" : "supplier"
      );
      formRes.append("transactionId", isOpen?.value?._id);
      formRes.append(
        "updatedFields",
        JSON.stringify({
          amount: parseFloat(formData.amount),
          type: formData.type,
          description: formData.description,
          date: formData.date,
        })
      );
      formRes.append("imageCount", images?.length);
      //  formRes.append("images[]", images);
      images.forEach((obj, index) => {
        // Append each object's file as a Blob/File to FormData
        formRes.append(`images[id][${index}]`, obj?.id);
        formRes.append(`images[type][${index}]`, obj?.type);
        formRes.append(`images[image][${index}]`, obj?.image);
      });
      updateTransaction(formRes);
    } else {
      const formRes = new FormData();
      formRes.append("amount", parseFloat(formData.amount));
      formRes.append("type", formData.type);
      formRes.append("partyId", partyId);
      formRes.append("businessId", businessIdSelected);
      formRes.append("description", formData.description);
      formRes.append("date", formData.date);
      formRes.append(
        "partyType",
        pathname.includes("customer") ? "customer" : "supplier"
      );
      for (let i = 0; i < images.length; i++) {
        formRes.append("images[]", images[i]?.image);
      }
      createTransaction(formRes);
    }

    // Close modal after form submission
  }

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    // Generate a unique ID for the new image
    const uniqueId = `image_${Date.now()}`;

    // Create an object containing ID, type, and the selected image
    const newImage = { id: uniqueId, type: "add", image: selectedImage };

    // Update the images state with the new image object at the beginning of the array
    setImages([newImage, ...images]);
  };

  // Function to handle single image addition using the plus icon
  const handleAddImage = (e) => {
    const selectedImage = e.target.files[0];

    // Update the state with the selected image
    if (selectedImage) {
      setImages([...images, selectedImage]);
    }
  };

  // Function to handle image upload
  const handleImageUpload = () => {
    // Implement image upload logic here using appropriate API or service
    // After successful upload, you can update the UI accordingly
    // For example:
    // dispatch(uploadImages(images)); // Dispatch an action to upload images

    // Clear the image selection after upload
    setImages([]);
  };

  const handleRemoveImage = (e, indexToRemove, imageItem) => {
    if (
      isOpen?.type === "add" ||
      (isOpen?.type === "edit" && imageItem?.type == "add")
    ) {
      const updatedImages = images.filter(
        (_, index) => index !== indexToRemove
      );
      setImages(updatedImages);
      e.stopPropagation();
      e.preventDefault();
    } else {
      let modifiedRes = images?.map((item, index) => {
        if (index === indexToRemove) {
          return { ...item, type: "delete" };
        } else {
          return item;
        }
      });
      setImages(modifiedRes);
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleImageClick = (e, image) => {
    window.open(image, "_blank");
    e.stopPropagation();
    e.preventDefault();
  };

  console.log(images);

  return (
    <>
      <Transition appear show={isOpen.status} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          {isCreateTransactionLoading || isUpdateTransactionLoading ? (
            <Loader wrapperStyle={{ zIndex: 5500 }} />
          ) : null}
          <div
            className="fixed inset-0 overflow-y-auto"
            style={{
              pointerEvents:
                isCreateTransactionLoading || isUpdateTransactionLoading
                  ? "none"
                  : "auto",
            }}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-row justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {`${isOpen?.type == "edit" ? "Edit" : "Add"} Transaction`}
                    </Dialog.Title>
                    <button
                      onClick={closeModal}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none right-0"
                    >
                      {/* Use XIcon or a close icon */}
                      <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="amount"
                        className="text-sm font-medium text-gray-700"
                      >
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="type"
                        className="text-sm font-medium text-gray-700"
                      >
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="credit">You Got</option>
                        <option value="debit">You Gave</option>
                      </select>
                    </div>
                    {/* Date input field */}
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="date"
                        className="text-sm font-medium text-gray-700"
                      >
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* Description input field */}
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description{" "}
                        <span className="text-gray-500">(Optional)</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter description"
                        rows={4} // Set the number of visible rows for the textarea
                      />
                    </div>

                    {/* Image input field */}
                    <div className="flex flex-col space-y-4">
                      <label
                        htmlFor="images"
                        className="text-sm font-medium text-gray-700"
                      >
                        Select Images{" "}
                        <span className="text-gray-500">(Optional)</span>
                      </label>
                      <div className="flex items-center space-x-4">
                        <label
                          htmlFor="images"
                          className="flex items-center justify-center w-28 h-28 border border-dashed rounded-md cursor-pointer"
                        >
                          <PlusIcon className="h-10 w-10 text-blue-500 cursor-pointer" />
                          <input
                            type="file"
                            id="images"
                            name="images"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 cursor-pointer">
                        Click to view larger image
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {images?.map((image, index) => {
                          return (image?.type == "add" ||
                            image?.type == "edit") &&
                            isValidData(image?.image) ? (
                            <div
                              key={index}
                              className="relative"
                              onClick={(e) =>
                                handleImageClick(
                                  e,
                                  image?.type == "edit"
                                    ? image?.image
                                    : image?.type == "add"
                                    ? URL.createObjectURL(image?.image)
                                    : null
                                )
                              }
                            >
                              <div className="w-20 h-20 cursor-pointer">
                                <Image
                                  loading="lazy"
                                  fill
                                  src={
                                    image?.type == "edit"
                                      ? image?.image
                                      : image?.type == "add"
                                      ? URL.createObjectURL(image?.image)
                                      : null
                                  }
                                  alt={`Preview ${index}`}
                                  className="w-20 h-20 object-cover rounded-md border"
                                />
                              </div>

                              {/* <img
                                src={
                                  image?.type == "edit"
                                    ? image?.image
                                    : image?.type == "add"
                                    ? URL.createObjectURL(image?.image)
                                    : null
                                }
                                alt={`Preview ${index}`}
                                className="w-20 h-20 object-cover rounded-md border"
                              /> */}
                              <button
                                className="absolute top-0 right-0 -mt-1 -mr-1 bg-black p-0 rounded-full text-white hover:text-red-500"
                                onClick={(e) => {
                                  handleRemoveImage(e, index, image);
                                }}
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {isOpen?.type == "edit" ? "Update" : "Submit"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
