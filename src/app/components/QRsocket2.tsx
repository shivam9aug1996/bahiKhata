import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const QRsocket2 = ({ isOpen, setIsOpen }) => {
  const [data, setData] = useState(null);

  const generateQR = async () => {
    console.log("hi");
    setData(null);
    let res = await fetch("/api/auth/getQR", {
      cache: "no-store",
      method: "post",
    });
    res = await res.json();
    setData(res);
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <p className="text-lg mb-3">or</p>
      <Button className="w-min" onClick={() => generateQR()}>
        Generate QR to Login
      </Button>

      {data?.data ? (
        <>
          <img src={data?.data} width={150} height={150} alt={"qr code"} />
          <p>{data?.temp}</p>
        </>
      ) : null}
    </div>
  );
};

export default QRsocket2;
