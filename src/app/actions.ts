"use server";

import { cookies } from "next/headers";

const getCookies = () => {
  // let token = cookies().get("bahi_khata_user_token")?.value;
  let token = null;
  let userData = cookies().get("bahi_khata_user_data")?.value;
  return { token, userData };
};

export default getCookies;
