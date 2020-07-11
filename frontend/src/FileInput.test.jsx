import React from "react";
import { render } from "@testing-library/react";
import FileInput from "./FileInput";
import "@testing-library/jest-dom";

describe("FileInput", () => {
  it("renders form with submit button", () => {
    const { getByText } = render(<FileInput />);
    const sendEmailsBtn = getByText(/Send emails/i);

    expect(sendEmailsBtn).toBeDisabled();
  });
});
