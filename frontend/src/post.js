const post = (data) => {
  return fetch("https://frontend-homework.togglhire.vercel.app/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emails: data,
    }),
  });
};

export default post;
