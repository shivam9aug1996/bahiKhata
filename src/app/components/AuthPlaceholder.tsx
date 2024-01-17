import React from "react";

const AuthPlaceholder = ({ type }) => {
  return (
    <>
      <div className="py-6 px-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {type === "login" ? "Login" : "Signup"}
        </h2>
        <form className="mt-8 space-y-4">
          <div>
            <label htmlFor="mobileNumber" className="sr-only">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="text"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-lg"
            />
            <div className="mt-1 text-sm text-gray-600">
              Enter your 10-digit mobile number
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-lg"
            />
            <div className="mt-1 text-sm text-gray-600">
              Enter your password
            </div>
          </div>
          <div>
            <div
              className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-unit-4 min-w-unit-20 h-unit-10 text-small gap-unit-2 rounded-medium [&>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none text-primary-foreground data-[hover=true]:opacity-hover w-full bg-red-500"
              color="primary"
            >
              {type === "login" ? "Login" : "Signup"}
            </div>
          </div>
        </form>
      </div>

      <div style={{ minHeight: 448 }}></div>
    </>
  );
};

export default AuthPlaceholder;
