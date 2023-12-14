"use client";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import {
  customerApi,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "../redux/features/customerSlice";
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "../redux/features/supplierSlice";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "../redux/features/transactionSlice";
import Loader from "./Loader";

export default function PartyModal({ isOpen, setIsOpen }) {
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [
    createCustomer,
    {
      isSuccess: isCreateCustomerSuccess,
      isLoading: isCreateCustomerLoading,
      isError: isCreateCustomerError,
      error: createCustomerError,
      data: createCustomerData,
    },
  ] = useCreateCustomerMutation();
  const [
    updateCustomer,
    {
      isSuccess: isUpdateCustomerSuccess,
      isLoading: isUpdateCustomerLoading,
      isError: isUpdateCustomerError,
      error: updateCustomerError,
      data: updateCustomerData,
    },
  ] = useUpdateCustomerMutation();

  const [
    createSupplier,
    {
      isSuccess: isCreateSupplierSuccess,
      isLoading: isCreateSupplierLoading,
      isError: isCreateSupplierError,
      error: createSupplierError,
      data: createSupplierData,
    },
  ] = useCreateSupplierMutation();
  const [
    updateSupplier,
    {
      isSuccess: isUpdateSupplierSuccess,
      isLoading: isUpdateSupplierLoading,
      isError: isUpdateSupplierError,
      error: updateSupplierError,
      data: updateSupplierData,
    },
  ] = useUpdateSupplierMutation();
  useErrorNotification(createCustomerError?.error, isCreateCustomerError);
  useErrorNotification(updateCustomerError?.error, isUpdateCustomerError);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
  });

  console.log("iuytredfg", isOpen);
  useEffect(() => {
    if (isOpen?.value && isOpen?.type === "edit" && isOpen?.status === true) {
      setFormData({
        name: isOpen?.value?.name,
        mobileNumber: isOpen?.value?.mobileNumber,
      });
    }
  }, [isOpen]);
  //let [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (
      isCreateCustomerSuccess ||
      isUpdateCustomerSuccess ||
      isUpdateSupplierSuccess ||
      isCreateSupplierSuccess
    ) {
      closeModal();
    }
  }, [
    isCreateCustomerSuccess,
    isUpdateCustomerSuccess,
    isUpdateSupplierSuccess,
    isCreateSupplierSuccess,
  ]);

  useEffect(() => {
    if (isCreateCustomerSuccess) {
      console.log("jhgfdsdfghj", createCustomerData?.data?._id);
      router.push(`/dashboard/customers/${createCustomerData?.data?._id}`);
    }
  }, [isCreateCustomerSuccess]);
  useEffect(() => {
    if (isCreateSupplierSuccess) {
      console.log("jhgfdsdfghj", createSupplierData?.data?._id);
      router.push(`/dashboard/suppliers/${createSupplierData?.data?._id}`);
    }
  }, [isCreateSupplierSuccess]);

  function closeModal() {
    setFormData({
      name: "",
      mobileNumber: "",
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
    if (isOpen?.type == "edit" && isOpen?.part === "customer") {
      updateCustomer(
        JSON.stringify({
          customerId: isOpen?.value?._id,
          businessId: businessIdSelected,
          updatedFields: {
            name: formData?.name,
            mobileNumber: formData?.mobileNumber,
          },
        })
      );
    } else if (isOpen?.type == "add" && isOpen?.part === "customer") {
      createCustomer(
        JSON.stringify({
          businessId: businessIdSelected,
          name: formData?.name,
          mobileNumber: formData?.mobileNumber,
        })
      );
    } else if (isOpen?.type == "edit" && isOpen?.part === "supplier") {
      updateSupplier(
        JSON.stringify({
          supplierId: isOpen?.value?._id,
          businessId: businessIdSelected,
          updatedFields: {
            name: formData?.name,
            mobileNumber: formData?.mobileNumber,
          },
        })
      );
    } else if (isOpen?.type == "add" && isOpen?.part === "supplier") {
      createSupplier(
        JSON.stringify({
          businessId: businessIdSelected,
          name: formData?.name,
          mobileNumber: formData?.mobileNumber,
        })
      );
    }

    // Close modal after form submission
  }

  return (
    <>
      {isCreateCustomerLoading ||
      isCreateSupplierLoading ||
      isUpdateCustomerLoading ||
      isUpdateSupplierLoading ? (
        <Loader />
      ) : null}
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
                      {`${isOpen?.type == "edit" ? "Edit" : "Add"} Customer`}
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
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter name"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="mobileNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter mobile number"
                      />
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
