"use client";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { customerApi } from "../redux/features/customerSlice";
import { supplierApi } from "../redux/features/supplierSlice";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "../redux/features/transactionSlice";

export default function TransactionModal({ isOpen, partyId, setIsOpen }) {
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
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

  const [formData, setFormData] = useState({
    amount: "",
    type: "credit", // Default value for type as "credit"
    description: "", // Add description field
    date: new Date().toISOString().split("T")[0],
  });
  console.log("iuytredfg", isOpen);
  useEffect(() => {
    if (isOpen?.value && isOpen?.type == "edit" && isOpen?.status == true) {
      console.log("kjhgrt6789", isOpen?.value);
      setFormData({
        date: isOpen?.value?.date,
        amount: isOpen?.value?.amount,
        type: isOpen?.value?.type,
        description: isOpen?.value?.description,
      });
    }
  }, [isOpen]);
  //let [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (isCreateTransactionSuccess || isUpdateTransactionSuccess) {
      if (pathname.includes("customer")) {
        dispatch(customerApi.util.invalidateTags(["customer"]));
      } else {
        dispatch(supplierApi.util.invalidateTags(["supplier"]));
      }

      closeModal();
    }
  }, [isCreateTransactionSuccess, isUpdateTransactionSuccess]);

  function closeModal() {
    setFormData({
      amount: "",
      type: "credit", // Default value for type as "credit"
      description: "", // Add description field
      date: new Date().toISOString().split("T")[0],
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
    console.log("Form submitted:", formData, isOpen);
    if (isOpen?.type == "edit") {
      updateTransaction(
        JSON.stringify({
          partyId,
          businessId: businessIdSelected,
          partyType: pathname.includes("customer") ? "customer" : "supplier",
          updatedFields: {
            amount: parseFloat(formData.amount),
            type: formData.type,
            description: formData.description,
            date: formData.date,
          },
          transactionId: isOpen?.value?._id,
        })
      );
    } else {
      createTransaction(
        JSON.stringify({
          amount: parseFloat(formData.amount),
          type: formData.type,
          partyId,
          businessId: businessIdSelected,
          description: formData.description,
          date: formData.date,
          partyType: pathname.includes("customer") ? "customer" : "supplier",
        })
      );
    }

    // Close modal after form submission
  }

  return (
    <>
      <Transition appear show={isOpen.status} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

          <div className="fixed inset-0 overflow-y-auto">
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
                        Amount
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
                        Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                      </select>
                    </div>
                    {/* Description input field */}
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description
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

                    {/* Date input field */}
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="date"
                        className="text-sm font-medium text-gray-700"
                      >
                        Date
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

                    {/* <div className="flex justify-end">
                      <button
                        onClick={() => {}}
                        type="submit"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Submit
                      </button>
                    </div> */}
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
