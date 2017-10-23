const moment = require('moment');
const vcapConstants = require('../../../vcap-constants.es6');

module.exports = application => {
  return {
    to: application.applicantInfoEmailAddress,
    subject: 'An update on your recent permit application to the Forest Service.',
    body: `
Permit application status update
**************************************

Unfortunately the following permit application has not been accepted.


${application.applicantMessage}

Application details
**************************************

Business name: ${application.applicantInfoOrganizationName}
Start date: ${moment(application.tempOutfitterFieldsActDescFieldsStartDateTime, 'YYYY-MM-DDTHH:mm:ss').format(
      'MM/DD/YYYY hh:mm a'
    )}
End date: ${moment(application.tempOutfitterFieldsActDescFieldsEndDateTime, 'YYYY-MM-DDTHH:mm:ss').format(
      'MM/DD/YYYY hh:mm a'
    )}
Number of trips: ${application.tempOutfitterFieldsActDescFieldsNumTrips}
Number of participants: ${application.tempOutfitterFieldsActDescFieldsPartySize}
Services: ${application.tempOutfitterFieldsActDescFieldsServProvided}

If you would like to submit another permit application visit ${vcapConstants.intakeClientBaseUrl}.


Contact us
**************************************

If you have questions or need to contact the permit staff at the National Forest Service, please use a method listed below.

Temp outfitter contact
Name: Sue Sherman-Biery
Title: Special use administrator
Phone: 360-854-2660
Email: sshermanbiery@fs.fed.us

Thank you for your interest in our National Forests.
`
  };
};