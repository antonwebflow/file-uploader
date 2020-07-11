import React, { useRef, useState } from "react";
import post from "./post";

const FileInput = () => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [status, setStatus] = useState({
    error: "",
    emails: [],
    state: "initial",
  });
  const inputEl = useRef(null);

  const handleChange = async () => {
    setStatus({ state: "initial" });
    const combindedEmails = [];
    const names = [];
    const fileListArray = Array.from(inputEl.current.files);

    await Promise.all(
      fileListArray.map(async (file) => {
        names.push(file.name);
        const text = await file.text();
        const emails = text.trim().split(/\n/);
        combindedEmails.push(...emails);
      })
    );

    console.log(names);

    setFileNames(names);

    const uniqueEmails = new Set(combindedEmails);

    setEmails(Array.from(uniqueEmails));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await post(emails);
    setLoading(false);
    if (response.ok) {
      setStatus({ state: "success" });
      setFileNames([]);
      inputEl.current.value = null;
    } else {
      const text = await response.text();
      const parsedText = JSON.parse(text);
      setStatus({ status: "error", ...parsedText });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputEl}
        type="file"
        onChange={handleChange}
        multiple
        accept=".txt"
      />
      <ul>
        {fileNames.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button disabled={loading || fileNames.length === 0}>Send emails</button>

      {loading && <h4>Loading...</h4>}

      {status?.state === "success" && <h4>Emails sent successfully</h4>}

      <h4>{status?.error}</h4>
      <ul>
        {status?.emails?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {JSON.stringify(status)}
    </form>
  );
};

export default FileInput;
