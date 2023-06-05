const {sendMail} = require("../sendEmail")

const cancleAppointment = async (toUserEmail,username,doctorname, date) =>
  await sendMail(
    toUserEmail,
    "Appointment Cancelled",
    "",
      `<h4>Hey ${username},</h4>
      <p>We are sorry to inform you that your appointment with doctor ${doctorname} on date ${date} has been cancelled.</p>
      `  
    );
module.exports = { cancleAppointment }
  

