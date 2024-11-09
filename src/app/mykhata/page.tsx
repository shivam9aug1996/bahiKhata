import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import React from "react";
import PublicTransaction from "../components/PublicTransaction";

export async function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  try {
    const sParams = await searchParams;
    const businessId = sParams?.businessId;
    const partyId = sParams?.partyId;
    const partyType = sParams?.partyType;
    const headersList = await headers();
    const previousImages = (await parent).icons;
    console.log("ytrdfghjkl", previousImages);
    //console.log("uyfghjkl", headersList.get("x-forwarded-proto"));
    const host = headersList.get("host"); // to get domain
    const protocol = headersList.get("x-forwarded-proto");
    //let h = headersList.get("next-url"); // to get url
    const fUrl = `${protocol}://${host}/api/transactionList/public/getMeta?businessId=${businessId}&partyId=${partyId}&partyType=${partyType}`;
    console.log(fUrl);
    let data = await fetch(fUrl, { cache: "force-cache" });
    data = await data?.json();
    console.log(data);
    const bName = data?.data?.businessName;
    const pName = data?.data?.partyName;
    if (bName && pName) {
      return {
        title: bName,
        description: pName,
      };
    } else {
      return {
        title: "BahiKhata",
        description: "Simplify Business Management",
      };
    }
  } catch (error) {
    return {
      title: "BahiKhata",
      description: "Simplify Business Management",
    };
  }
}

const page = ({ params, searchParams }) => {
  const businessId = searchParams?.businessId;
  const partyId = searchParams?.partyId;
  const partyType = searchParams?.partyType;

  return (
    <PublicTransaction
      partyId={partyId}
      businessId={businessId}
      partyType={partyType}
    />
  );
};

export default page;
