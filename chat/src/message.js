const moment = require("moment");

module.exports = (user, text) => {
  return {
    user,
    text,
    time: moment().format("h:mm a")
  };
};
