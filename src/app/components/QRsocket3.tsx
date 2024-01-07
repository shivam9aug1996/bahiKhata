"use client";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import usePusher from "../custom-hooks/usePusher";
import { useLoginMutation } from "../redux/features/authSlice";
import { qrApi, useGetQRcodeMutation } from "../redux/features/qrSlice";

const QRsocket3 = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [
    getQRcode,
    {
      isSuccess: isGetQRcodeSuccess,
      isLoading: isGetQRcodeLoading,
      isError: isGetQRcodeError,
      error: getQRcodeError,
      data: getQRcodeData,
    },
  ] = useGetQRcodeMutation();
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
  useErrorNotification(loginError, isLoginError);
  useErrorNotification(getQRcodeError, isGetQRcodeError);
  const { isConnected, error, startSocket, closeSocket, message } = usePusher(
    "a7a14b0a75a3d073c905",
    "ap2"
  );

  useEffect(() => {
    generateQR();
  }, []);

  useEffect(() => {
    if (isLoginSuccess) {
      router.replace("/dashboard/customers");
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    if (isGetQRcodeSuccess) {
      startSocket(getQRcodeData?.temp, "e1");
      //  let g = closeSocket;
      // if (isConnected) {
      //   setTimeout(() => {
      //     closeSocket();
      //   }, 5000);
      // }
    }
  }, [isGetQRcodeSuccess]);

  useEffect(() => {
    if (message) {
      console.log(message);
      if (message?.data?.newToken) {
        closeSocket();
        login({ token: message?.data?.newToken });
      }
    }
  }, [message]);

  const generateQR = () => {
    getQRcode();
  };

  function closeModal() {
    setIsOpen({ ...isOpen, status: false, value: null });
    dispatch(qrApi.util.resetApiState());
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
                    {isGetQRcodeError || error ? (
                      <div
                        style={{ height: 150 }}
                        className="flex items-center"
                      >
                        <p className="text-lg">Something went wrong</p>
                      </div>
                    ) : getQRcodeData?.data && isConnected ? (
                      <img
                        src={getQRcodeData?.data}
                        width={150}
                        height={150}
                        alt={"qr code"}
                      />
                    ) : (
                      <div
                        style={{ width: 150, height: 150 }}
                        className="flex justify-center items-center"
                      >
                        <Spinner />
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-gray-500">
                    QR code valid for 60 seconds only. Scan quickly or generate
                    a fresh code to continue.
                    {/* {JSON.stringify(message)}
                    {JSON.stringify(getQRcodeData?.temp)} */}
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

export default QRsocket3;
