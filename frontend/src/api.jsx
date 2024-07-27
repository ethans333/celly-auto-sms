import Cookies from "js-cookie";

async function apiHandler(url, method, body, authorization) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authorization !== undefined) headers["Authorization"] = authorization;
  if (typeof body == "object") body = JSON.stringify(body);

  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: body,
  });

  console.log(response);

  const data =
    response.status === 200 ? await response.json() : await response.text();

  return { status: response.status, data: data };
}

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

  if (response.status === 200) return response.json();

  return await response.text(); // error
}

export async function addWorkspace(
  workspace_name,
  workspace_raw,
  emoji = "👽"
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
        workspace_raw: JSON.stringify(workspace_raw),
        workspace_emoji: emoji,
      }),
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

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

  if (response.status === 200) return await response.json();

  return await response.text(); // error
}

export async function updateWorkspace(metadata, workspace_raw) {
  const url =
    import.meta.env.VITE_WORKSPACE_API_URL + "/workspace/" + metadata.id;
  const method = "PUT";
  const body = {
    metadata: JSON.stringify(metadata),
    workspace_raw: JSON.stringify(workspace_raw),
  };
  const authorization = Cookies.get("access_token");

  return await apiHandler(url, method, body, authorization);
}

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

  if (response.status === 200) return await response.json();

  return await response.text(); // error
}

export async function deleteWorkspace(id) {
  if (!id) return "No id provided";

  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL + "/workspace/" + id,
    {
      method: "DELETE",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
    }
  );

  if (response.status === 200) return await response.json();
  throw new Error(await response.text());
}

export async function deployWorkspace(id) {
  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL + "/workspace/deploy/" + id,
    {
      method: "POST",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
    }
  );

  if (response.status === 200) return await response.json();
  return await response.text(); // error
}

export async function initializeMicrosoftESL() {
  const response = await fetch(
    import.meta.env.VITE_ESL_API_URL + "/esl/microsoft",
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

export async function storeMicrosoftTokenESL(code) {
  const response = await fetch(
    import.meta.env.VITE_ESL_API_URL + "/esl/microsoft",
    {
      method: "POST",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
      body: JSON.stringify({
        code: code,
        flow: localStorage.getItem("microsoft-flow"),
      }),
    }
  );

  if (response.status === 200) {
    localStorage.removeItem("microsoft-flow");
    return response;
  }

  return await response.text(); // error
}

export async function tokenStatusMicrosoftESL() {
  const response = await fetch(
    import.meta.env.VITE_ESL_API_URL + "/esl/microsoft/token_status",
    {
      method: "GET",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
    }
  );

  return response;
}

export async function unlinkAllESL() {
  const response = await fetch(
    import.meta.env.VITE_ESL_API_URL + "/esl/unlink/all",
    {
      method: "DELETE",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

export async function getMicrosoftCalendarEvents(user_id, workspace_id) {
  const response = await fetch(
    import.meta.env.VITE_PESL_API_URL +
      `/pesl/microsoft/calendar/${user_id}/${workspace_id}`,
    {
      method: "GET",
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

export async function addCalendarEvent(
  userId,
  id,
  contactMethod,
  contactValue,
  secondContactValue,
  startTime,
  endTime,
  meeting_name
) {
  const response = await fetch(
    import.meta.env.VITE_SCHEDULING_API_URL + "/scheduling/" + id,
    {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        contact_method: contactMethod,
        contact_value: contactValue,
        second_contact_value: secondContactValue,
        start_time: startTime,
        end_time: endTime,
        meeting_name: meeting_name,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

export async function hideDemo() {
  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL + "/workspace/hide_demo",
    {
      method: "PUT",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
    }
  );

  if (response.status === 200) return response;

  return await response.text(); // error
}

export async function getScheduledMeetings(workspace_id) {
  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL +
      "/workspace/scheduled_meetings/" +
      workspace_id,
    {
      method: "GET",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
    }
  );

  if (response.status === 200) return response.json();

  return await response.text(); // error
}

export async function cancelScheduledMeetings(workspace_id, meetings) {
  const response = await fetch(
    import.meta.env.VITE_WORKSPACE_API_URL +
      "/workspace/scheduled_meetings/" +
      workspace_id,
    {
      method: "DELETE",
      headers: {
        Authorization: Cookies.get("access_token"),
      },
      body: JSON.stringify({ meetings: meetings }),
    }
  );

  if (response.status === 200) return response.json();

  return await response.text(); // error
}

export async function cancelMeeting(meeting_id) {
  const response = await fetch(
    import.meta.env.VITE_SCHEDULING_API_URL + "/scheduling/" + meeting_id,
    {
      method: "DELETE",
    }
  );

  if (response.status === 200) return response.json();

  return await response.text(); // error
}

export async function confirmMeeting(meeting_id, confirmation_token) {
  const response = await fetch(
    import.meta.env.VITE_SCHEDULING_API_URL +
      "/scheduling/" +
      meeting_id +
      "/" +
      confirmation_token,
    {
      method: "PUT",
    }
  );

  if (response.status === 200) return response.json();

  return await response.text(); // error
}
