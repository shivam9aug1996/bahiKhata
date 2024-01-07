import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { qrApi, useScanQRcodeMutation } from "../redux/features/qrSlice";
import toast from "react-hot-toast";
import Loader from "./Loader";
import usePusher from "../custom-hooks/usePusher";
import { useDispatch } from "react-redux";
import { calculateSecondsElapsed } from "../utils/function";
import { pusher_public_api_key, pusher_public_cluster } from "../api/lib/keys";

const QRscanner = ({ isOpen, setIsOpen, handleScan }) => {
  const [scannedResult, setScannedResult] = useState({
    status: false,
    value: "",
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, error, startSocket, closeSocket, message } = usePusher(
    pusher_public_api_key,
    pusher_public_cluster
  );

  const [
    scanQRcode,
    {
      isSuccess: isScanQRSuccess,
      isLoading: isScanQRLoading,
      isError: isScanQRError,
      error: scanQRError,
      data: scanQRData,
    },
  ] = useScanQRcodeMutation();

  useEffect(() => {
    if (scannedResult?.status == true) {
      if (calculateSecondsElapsed(scannedResult?.value) <= 60) {
        console.log(calculateSecondsElapsed(scannedResult?.value));
        startSocket(scannedResult.value, "e1");
      } else {
        toast.error("QR code expired");

        setTimeout(() => {
          closeModal();
        }, 500);
      }
    }
  }, [scannedResult.status]);

  useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      scanQRcode({ token: scannedResult.value });
    }
  }, [isConnected]);

  useEffect(() => {
    if (message) {
      if (message?.data?.newToken) {
        dispatch(qrApi.util.resetApiState());
        closeModal();
        setIsLoading(false);
      }
    }
  }, [message]);

  useEffect(() => {
    if (isOpen?.status) {
      setScannedResult({
        status: false,
        value: "",
      });
    }
  }, [isOpen?.status]);

  function closeModal() {
    setIsOpen({ ...isOpen, status: false, value: null });
    closeSocket();
  }
  console.log(scannedResult);
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
                    {scannedResult.status && isLoading ? (
                      <div
                        className="flex justify-center items-center mt-20"
                        style={{ height: 400 }}
                      >
                        <Loader />
                        <p className="text-lg">Please wait...</p>
                      </div>
                    ) : (
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
                        hideCount={true}
                        tracker={true}
                        scanDelay={100}
                        onDecode={(result) => {
                          console.log(result);
                          if (scannedResult.status == false)
                            setScannedResult({ status: true, value: result });
                        }}
                        onError={(error) => console.log(error?.message)}
                      />
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default QRscanner;
