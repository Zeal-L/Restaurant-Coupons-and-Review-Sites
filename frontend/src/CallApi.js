const backendUrl = "http://127.0.0.1:5001/";

export function CallApi(path, type, data) {
  if (data !== undefined) {
    data = JSON.stringify(data);
  }
  return new Promise((resolve, reject) => {
    let statusCode;
    fetch(`${backendUrl}/${path}`, {
      method: type,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then(response => {
        statusCode = response.status;
        return response.json();
      })
      .then(data => {
        resolve({
          status: statusCode,
          data: data
        });
      })
      .catch(error => {
        resolve({
          status: 404,
          data: {
            message: "Not Found"
          }
        });
      });
  });
}

export function CallApiWithToken(path, type, data) {
  if (data !== undefined) {
    data = JSON.stringify(data);
  }
  return new Promise((resolve, reject) => {
    let statusCode;
    fetch(`${backendUrl}/${path}`, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: data,
    })
      .then(response => {
        statusCode = response.status;
        return response.json();
      })
      .then(data => {
        resolve({
          status: statusCode,
          data: data
        });
      })
      .catch(error => {
        resolve({
            status: 404,
            data: {
                message: "Not Found"
            }
        });
      });
  });
}