import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import React, { Fragment } from "react";
import Loader from "./Loader";

const DeleteModal = ({
  setIsOpen,
  isOpen,
  title,
  handleSubmit,
  subtitle,
  loading,
}) => {
  function closeModal() {
    setIsOpen({ ...isOpen, status: false, value: null });
  }

  return (
    <Transition appear show={isOpen.status} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={closeModal}>
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
        {loading && <Loader />}
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
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none right-0"
                  >
                    {/* Use XIcon or a close icon */}
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mt-3">
                    {/* Deleting this item will remove it permanently. Are you sure
                    you want to continue? */}
                    {subtitle
                      ? subtitle
                      : "Deleting this item will remove it permanently. Are you sure you want to continue?"}
                  </p>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmit()}
                      type="button"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isOpen?.type == "edit" ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteModal;
