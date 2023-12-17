"use client";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";

const TransactionFilterModal = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    if (isOpen?.status == true) {
      setFormData({
        ...formData,
        type: isOpen?.value?.type,
        startDate: isOpen?.value?.startDate,
        endDate: isOpen?.value?.endDate,
      });
    }
  }, [isOpen]);

  function closeModal() {
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

    setIsOpen({ ...isOpen, status: false, value: formData });
    // Close modal after form submission
  }

  const clearAllFilters = () => {
    setFormData({
      type: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <Transition appear show={isOpen.status} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
        {/* {isCreateTransactionLoading || isUpdateTransactionLoading ? (
          <Loader wrapperStyle={{ zIndex: 5500 }} />
        ) : null} */}
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
                    {`Filters`}
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
                      <option value="">All</option>
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
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor="date"
                      className="text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="endDate"
                      value={formData.endDate}
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
                  <button
                    onClick={clearAllFilters}
                    className="underline text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    Clear All Filters
                  </button>
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
                      {"Apply"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransactionFilterModal;
