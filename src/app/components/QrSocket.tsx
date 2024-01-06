"use client";
import React, { Fragment, memo, useEffect, useRef, useState } from "react";
import Pusher from "pusher-js/with-encryption";
import { useLazyGetQRcodeQuery } from "../redux/features/qrSlice";

import { useLoginMutation } from "../redux/features/authSlice";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import { useRouter } from "next/navigation";
import { Image } from "@nextui-org/react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const pusher = new Pusher("a7a14b0a75a3d073c905", {
  cluster: "ap2",
});

const QrSocket = ({ isOpen, setIsOpen }) => {
  const [data, setData] = useState(null);
  const timerRef = useRef(null);

  const router = useRouter();
  const [
    login,
    {
      isSuccess: isLoginSuccess,
      isLoading: isLoginLoading,
      isError: isLoginError,
      error: loginError,
      data: loginData,
    },
  ] = useLoginMutation();
  const [
    getQRcode,
    {
      isSuccess: isGetQRcodeSuccess,
      isLoading: isGetQRcodeLoading,
      isError: isGetQRcodeError,
      error: getQRcodeError,
      data: getQRcodeData,
    },
  ] = useLazyGetQRcodeQuery();
  useErrorNotification(loginError, isLoginError);

  useEffect(() => {
    if (isLoginSuccess) {
      router.replace("/dashboard/customers");
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    if (isLoginError) {
      closeModal();
    }
  }, [isLoginError]);

  useEffect(() => {
    generateQR();
    const timer = setInterval(() => {
      generateQR();
    }, 20000);
    return () => {
      clearInterval(timer);
      pusher.unsubscribe("my-channel");
    };
  }, []);

  const generateQR = () => {
    getQRcode()
      ?.unwrap()
      ?.then((res) => {
        console.log(res);

        pusher.unsubscribe("my-channel");
        var channel = pusher.subscribe("my-channel");
        channel.bind(res?.temp, function (data) {
          if (data?.data?.newToken) {
            login({ token: data?.data?.newToken });
          }
          setData(data);
        });
      });
  };

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
                      {/* {""} */}
                    </Dialog.Title>
                    <button
                      onClick={closeModal}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none right-0"
                    >
                      {/* Use XIcon or a close icon */}
                      <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                  <div className="text-center mt-4">
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      Scan QR Code to Login
                    </h4>
                    <p className="text-sm text-gray-500">
                      Point your device's camera at the QR code to proceed with
                      login.
                    </p>
                    <div className="flex justify-center mt-4">
                      <Image
                        isLoading={isGetQRcodeLoading}
                        src={getQRcodeData?.data}
                        width={150}
                        height={150}
                        alt={"qr code"}
                      />
                    </div>
                    <div className="mt-2 text-gray-500">
                      A new QR code is generated every 20 seconds for login.
                      Keep your device ready to scan.
                    </div>
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

export default memo(QrSocket);
