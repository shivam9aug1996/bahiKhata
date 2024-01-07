import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useScanQRcodeMutation } from "../redux/features/qrSlice";
import toast from "react-hot-toast";
import Loader from "./Loader";
import Pusher from "pusher-js";
const pusher = new Pusher("a7a14b0a75a3d073c905", {
  cluster: "ap2",
});

const QRscanner = ({ isOpen, setIsOpen, handleScan }) => {
  const [scannedResult, setScannedResult] = useState({
    status: false,
    value: "",
  });
  const timerRef = useRef(null);

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
      let id = toast.loading(
        "Verifying... Please wait a moment for authentication."
      );
      scanQRcode({ token: scannedResult.value })
        ?.unwrap()
        ?.then((res) => {
          console.log("mhgfgkjhgfghjkl", res);
          var channel = pusher?.subscribe("my-channel");
          channel.bind(res?.token, function (data) {
            console.log("jjjjjj", data);
            if (data?.data?.newToken) {
              toast.remove(id);
              clearTimeout(timerRef.current);
              setIsOpen({ ...isOpen, status: false, value: null });
              toast.success("QR scanned successfully");
              //pusher.unbind_all();
              pusher.unsubscribe("my-channel");
            }
          });
          timerRef.current = setTimeout(() => {
            setIsOpen({ ...isOpen, status: false, value: null });
            toast.error("Try again!");
          }, 10000);
        })
        ?.catch((err) => {
          console.log("hiii err", err);
          toast.remove(id);
          setIsOpen({ ...isOpen, status: false, value: null });
          toast.error(
            "QR Code Expired! Please generate a new QR code to continue."
          );
        });
      // ?.finally(() => {
      //   toast.remove(id);
      //   setIsOpen({ ...isOpen, status: false, value: null });
      // });
    }
  }, [scannedResult.status]);

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
                    {!scannedResult.status ? (
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
