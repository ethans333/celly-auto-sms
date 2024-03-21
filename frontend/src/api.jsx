import Cookies from "js-cookie";

/*

/ user

*/

/**
 * Creates a new user.
 *
 * @param {String} email Email of the user
 * @param {String} password Password of the user
 * @returns {Object}
 * */
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

/**
 * Logs in the user.
 *
 * @param {String} email Email of the user
 * @param {String} password Password of the user
 * @returns {Object}
 * */
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

/**
 * Confirms the user.
 *
 * @param {String} email Email of the user
 * @param {String} code Code to confirm the user
 * @returns {Object}
 */
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

/**
 * Gets the user. User must be authenticated.
 *
 * @returns {Object}
 * */
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

/**
 * Adds a workspace
 *
 * @param {String} workspace_name Name of the workspace
 * @param {String} workspace_description Description of the workspace
 * @param {String} workspace_raw Raw data of the workspace
 * @param {String} workspace_emoji Emoji of the workspace
 * @returns {Object} Message and workspace id
 */
export async function addWorkspace(
  workspace_name,
  workspace_description,
  workspace_raw,
  workspace_emoji
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
        workspace_raw: JSON.stringify(workspace_raw),
        workspace_emoji: workspace_emoji,
      }),
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

/**
 * Gets a workspace
 *
 * @param {String} id Id of the workspace
 * @returns {Object} Workspace
 */
export async function getWorkspace(id) {
  if (!id) return "No id provided";

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

/**
 * Updates an existing workspace
 *
 * @param {String} id Id of the workspace
 * @param {String} workspace_name Name of the workspace
 * @param {String} workspace_description Description of the workspace
 * @param {String} workspace_raw Raw data of the workspace
 * @param {Boolean} is_favorite Whether the workspace is favorited
 * @param {String} workspace_emoji Emoji of the workspace
 * @returns {Object} Message and workspace id
 */
export async function updateWorkspace(
  id,
  workspace_name,
  workspace_description,
  workspace_raw,
  is_favorite,
  workspace_emoji
) {
  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL + "/workspace/" + id,
    {
      method: "PUT",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
      body: JSON.stringify({
        workspace_name: workspace_name,
        workspace_description: workspace_description,
        workspace_raw: JSON.stringify(workspace_raw),
        is_favorite: is_favorite,
        workspace_emoji: workspace_emoji,
      }),
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

/**
 * Gets all of user's workspaces
 *
 * @returns {Array<Object>} */
export async function getAllUserWorkspaces() {
  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL + "/workspace/all",
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
