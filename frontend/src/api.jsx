import Cookies from "js-cookie";

/*

/ user

*/

export async function createUser(email, password) {
  const response = await fetch(import.meta.env.VITE_USER_API_URL + "/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (response.status === 200) return response;

  return await response.text(); // error
}

export async function loginUser(email, password) {
  const response = await fetch(
    import.meta.env.VITE_USER_API_URL + "/user/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  );

  if (response.status === 200) {
    // Get the access token from the response and set it as a cookie
    const json = await response.json();
    const auth = json.AuthenticationResult;

    Cookies.set("access_token", auth.AccessToken, {
      expires: auth.ExpiresIn,
    });

    return response;
  }

  return await response.text(); // error
}

export async function confirmUser(email, code) {
  const response = await fetch(
    import.meta.env.VITE_USER_API_URL + "/user/confirm",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        code: code,
      }),
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

export async function getUser() {
  const response = await fetch(import.meta.env.VITE_USER_API_URL + "/user", {
    method: "GET",
    headers: {
      Authorization: Cookies.get("access_token"),
    },
  });

  if (response.status === 200) return response;

  return await response.text(); // error
}

/*

/ workspace

*/

export async function addWorkspace(
  workspace_name,
  workspace_description,
  workspace_raw
) {
  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL + "/workspace",
    {
      method: "POST",
      headers: {
        Authorization: Cookies.get("access_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspace_name: workspace_name,
        workspace_description: workspace_description,
        workspace_raw: workspace_raw,
      }),
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

export async function getWorkspace(id) {
  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL + "/workspace/" + id,
    {
      method: "GET",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}
