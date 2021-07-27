function errorHandler(err, req, res, next) {
  let message = [];
  let code;

  if (err.code === 404) {
    code = 404;
    err.message.forEach((element) => {
      message.push(element);
    });
  } else if (err.code === 400) {
    code = 400;
    err.message.forEach((element) => {
      message.push(element);
    });

  }else if (err.code === 401) {
    code = 401;
    err.message.forEach((element) => {
      message.push(element);
    });
  
  
  // } else if (err.code === 403) {
  //   code = 403;
  //   err.message.forEach((element) => {
  //     message.push(element);
  //   });
  // 
  } 
  else {
    code = 500;
    message.push("Internal server error");
  }

  res.status(code).send({
    code,
    message,
  });
}


// function errorHandler(err, req, res, next) {
//   const { code, message } = err;

//   if (code === 400) {
//     res.status(code).json({ code, message: message || "Bad Requests" });
//   } else if (code === 401) {
//     res.status(code).json({ code, message: message || "Unauthorized" });
//   } else if (code === 403) {
//     res.status(code).json({ code, message: message || "Access Forbidden" });
//   } else if (code === 404) {
//     res.status(code).json({ code, message: message || "Not Found" });
//   } else {
//     // 500
//     res
//       .status(code)
//       .json({ code, message: message || "Internal Server Error" });
//   }
// }

// module.exports = (err, req, res, next) => {
//   switch (err.code) {
//     case 400: message = err.message ; break;
//     case 401: message = err.message || `Username and Password Not Match`; break;
//     case 403: message = `Forbidden Access`; break;
//     case 404: message = `No Match Found`; break;
//     case 500: message = err || `Internal Server Error`; break;
//   }
//   console.log(err)
//   return res.status(err.code).json({message})
// }

module.exports = errorHandler;
