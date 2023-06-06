const API_URL = "v1";
async function httpGetPlanets() {
  try {
    const response = await fetch(`${API_URL}/planets`);
    if (!response.ok) {
      throw new Error("Failed to fetch planets");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function httpGetLaunches() {
  try {
    const response = await fetch(`${API_URL}/launches`);
    if (!response.ok) {
      throw new Error("Failed to fetch planets");
    }
    const fetchdLaunches = await response.json();
    return fetchdLaunches.sort((a, b) => {
      return a.flightNumber - b.flightNumber;
    });
  } catch (error) {
    console.error(error);
  }
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return { ok: false };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (error) {
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
