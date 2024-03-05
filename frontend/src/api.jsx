const isValidJSON = (json) => {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
};

export async function createUser(email, password) {
  const response = await fetch(import.meta.env.VITE_API_URL + "/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const text = await response.text();
  console.log(text);

  return text;
}
