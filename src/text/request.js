const { score, sel, tr, button, gap, say, json } = require('./lib');

const target = sel('@a[tag=xpeco.target,limit=1]');
const amt = score('#amt', 'xpeco.tmp');

module.exports = {
  requestText: {
    notarget: say('xpeco.request.notarget', 'Look at the player you want to ask.'),
    sent: json(tr('xpeco.request.sent', 'Requested %s points from %s.', amt, target)),
    // What the target sees, with the buttons on the same line as the ask
    received: json([
      tr('xpeco.request.received', '%s requests %s points. ', sel('@s'), amt),
      button('Pay', 'green', '/trigger xpeco.accept_charges', 'Pay the requested amount'),
      gap(),
      button('Decline', 'red', '/trigger xpeco.decline_payment', 'Refuse the request'),
    ]),
    expired: say('xpeco.request.expired', 'The request expired.'),
    expiredSender: say('xpeco.request.expired.sender', 'Your request expired.'),
    none: say('xpeco.request.none', 'No pending request.'),
    gone: say('xpeco.request.gone', 'The requester is not online.'),
    declined: json(tr('xpeco.request.declined', '%s declined your request.', sel('@s'))),
    declinedSelf: say('xpeco.request.declined.self', 'Request declined.'),
  },
};
