import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
// import { QrReader } from "react-qr-reader";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { QrScanner } from "@yudiel/react-qr-scanner";

const QRscanner = () => {
  const [isOpen, setIsOpen] = useState({ status: false, value: null });

  useEffect(() => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      navigator.mediaDevices.getUserMedia({ video: true });
    }
  }, []);

  function closeModal() {
    setIsOpen({ ...isOpen, status: false, value: null });
  }
  return (
    <>
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
                      {"QR Scanner"}
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
                    <QrScanner
                      constraints={{
                        facingMode: "environment",
                        width: {
                          min: 640,
                          ideal: 720,
                          max: 1920,
                        },
                        height: {
                          min: 640,
                          ideal: 720,
                          max: 1080,
                        },
                      }}
                      hideCount={false}
                      tracker={true}
                      scanDelay={100}
                      onDecode={(result) => console.log(result)}
                      onError={(error) => console.log(error?.message)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <button onClick={() => setIsOpen({ ...isOpen, status: true })}>
        scan
      </button>
    </>
  );
};

export default QRscanner;
