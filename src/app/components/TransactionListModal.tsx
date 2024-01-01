import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedCustomer } from "../redux/features/businessSlice";
import Transaction from "./Transaction";

const TransactionListModal = ({
  isTransactionsOpen,
  setIsTransactionsOpen,
  partyId,
}) => {
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(setSelectedCustomer(""));
    setIsTransactionsOpen(false);
  };
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
      closeModal();
    };
  }, []);
  return (
    <>
      <Transition appear show={isTransactionsOpen} as={Fragment}>
        <Dialog as="div" className="relative" onClose={closeModal}>
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
            <div
              className="flex min-h-full items-center justify-end p-4 text-center"
              style={{
                padding: 0,
              }}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  style={{
                    minWidth: "70vw",
                    minHeight: "100vh",
                    marginLeft: 100,
                  }}
                >
                  <div className="flex flex-row justify-between">
                    {/* <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {`List`}
                    </Dialog.Title> */}
                    <button
                      onClick={closeModal}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none right-0"
                    >
                      {/* Use XIcon or a close icon */}
                      <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                  <Transaction
                    setIsTransactionsOpen={setIsTransactionsOpen}
                    partyId={partyId}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TransactionListModal;
