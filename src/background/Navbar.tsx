import React from "react";

const MailchimpSignupForm = () => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Join Early Access Group</h2>
      <p className="text-sm text-gray-600 mb-4">
        <span className="text-red-500">*</span> indicates required
      </p>
      <form
        action="https://pitchpulse.us16.list-manage.com/subscribe/post?u=bfec6e404020f2cbccfab2b7b&amp;id=60a4786c75&amp;f_id=000857e2f0"
        method="post"
        target="_blank"
        noValidate
      >
        <div className="mb-4">
          <label htmlFor="mce-EMAIL" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="EMAIL"
            id="mce-EMAIL"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mce-FNAME" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="FNAME"
            id="mce-FNAME"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bot honeypot field */}
        <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
          <input
            type="text"
            name="b_bfec6e404020f2cbccfab2b7b_60a4786c75"
            tabIndex={-1}
            defaultValue=""
          />
        </div>

        <div>
          <input
            type="submit"
            name="subscribe"
            value="Subscribe"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          />
        </div>
      </form>
    </div>
  );
};

export default MailchimpSignupForm;
