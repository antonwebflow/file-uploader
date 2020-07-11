import React, { useRef, useState } from "react";
import post from "./post";
import DropZone from "./DropZone";

const FileInput = () => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState({
    error: "",
    emails: [],
    state: "initial",
  });

  const [filesMeta, setFilesMeta] = useState([]);

  const inputEl = useRef(null);

  const handleChange = async (e) => {
    setStatus({ state: "initial" });
    const filesMetaAcc = [];

    const combinedEmails = [];

    let fileListArray;

    if (e.dataTransfer?.files) {
      fileListArray = Array.from(e.dataTransfer.files);
    } else {
      fileListArray = Array.from(inputEl.current.files);
    }
    await Promise.all(
      fileListArray.map(async (file) => {
        const text = await file.text();
        const emails = text.trim().split(/\n/);
        filesMetaAcc.push({
          fileName: file.name,
          numberOfEmails: emails.length,
        });
        combinedEmails.push(...emails);
      })
    );

    setFilesMeta(filesMetaAcc);

    const uniqueEmails = new Set(combinedEmails);

    setEmails(Array.from(uniqueEmails));
  };
  const onButtonClick = (e) => {
    e.preventDefault();
    inputEl.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await post(emails);
    setLoading(false);
    if (response.ok) {
      setStatus({ state: "success" });
      setFilesMeta([]);
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
        onChange={handleChange}
        type="file"
        multiple
        accept=".txt"
        hidden
      />

      <button onClick={onButtonClick}>Choose files</button>

      <DropZone handleFilesDrop={handleChange} />

      {loading && <h4>Loading...</h4>}

      {filesMeta.length !== 0 && (
        <ul>
          {filesMeta.map(({ fileName, numberOfEmails }) => (
            <li key={fileName}>
              {fileName}. Number of emails: {numberOfEmails}
            </li>
          ))}
        </ul>
      )}

      <button disabled={loading || filesMeta.length === 0}>Send emails</button>

      {status?.state === "success" && <h4>Emails sent successfully</h4>}

      {status?.error && (
        <div role="alert">
          <h4>{status?.error}</h4>
          <ul>
            {status?.emails?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default FileInput;
