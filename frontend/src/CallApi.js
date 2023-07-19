const backendUrl = "http://localhost:5006";

export function CallApi (path, type, data) {
  if (data !== undefined) {
    data = JSON.stringify(data);
  }
  return new Promise((resolve) => {
    fetch(`${backendUrl}/${path}`, {
      method: type,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then(response => {
        resolve(response);
      });
  });
}

export function CallApiWithToken (path, type, data) {
  if (data !== undefined) {
    data = JSON.stringify(data);
  }
  return new Promise((resolve) => {
    fetch(`${backendUrl}/${path}`, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: data,
    })
      .then(response => {
        resolve(response);
      });
  });
}
