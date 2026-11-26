const { score, sel, tr, text, button, gap, say, json } = require('./lib');

const amt = score('#amt', 'xpeco.tmp');

module.exports = {
  payText: {
    insufficient: say('xpeco.pay.insufficient', 'Not enough experience.'),
    unknown: say('xpeco.pay.unknown', 'Unknown account.'),
    sent: json(tr('xpeco.pay.sent', 'Paid %s %s points.', sel('@a[tag=xpeco.target,limit=1]'), amt)),
    sentTo: json(tr('xpeco.pay.sent', 'Paid %s %s points.', text('$(name)'), text('$(amount)'))),
    received: json(tr('xpeco.pay.received', '%s paid you %s points.', sel('@s'), amt)),

    // Ops only, /function xpeco:pay/to_name
    mustBePositive: json(text('Amount must be positive.')),
    notEnough: json(text('Not enough experience.')),
    paidName: json(text('Paid $(to) $(amount) points.')),

    none: say('xpeco.pay.none', 'No pending payment.'),
    expired: say('xpeco.pay.expired', 'The payment expired.'),
    denied: say('xpeco.pay.denied', 'Payment cancelled.'),
    self: say('xpeco.pay.self', 'You cannot pay yourself.'),
    nopick: say('xpeco.pay.nopick', 'Pick who to pay first.'),
    empty: say('xpeco.pay.empty', 'No other accounts to pay yet.'),
    pick: json(tr('xpeco.pay.pick', 'Pay %s points to, page %s of %s:', score('@s', 'xpeco.pay.amt'), score('#p', 'xpeco.tmp'), score('#pages', 'xpeco.tmp'))),

    // Question on one line, buttons on the next
    confirm: json([
      tr('xpeco.pay.confirm', 'Pay %s points to %s?', text('$(amount)'), { nbt: 'list[{id:$(id)}].name', storage: 'xpeco:accounts' }),
      text('\n'),
      button('Confirm', 'green', '/trigger xpeco.pay_confirm', 'Send the payment'),
      gap(),
      button('Deny', 'red', '/trigger xpeco.pay_deny', 'Cancel the payment'),
      gap(),
      button('Someone else...', 'dark_gray', '/trigger xpeco.pay_page set 1', 'Pick another account'),
    ]),

    // Page buttons under the list
    footer: json([
      button('< Prev', 'gray', '/trigger xpeco.pay_page set $(prev)'),
      gap(2),
      button('Next >', 'gray', '/trigger xpeco.pay_page set $(next)'),
    ]),

    // One list entry. Brackets, head and name are the click target and take the player's locator bar color. The head stays
    // white so the color does not wash it out. The gap after an entry is separate so it is not clickable.
    cell: json({
      text: '[',
      color: '$(color)',
      click_event: { action: 'run_command', command: '/trigger xpeco.pay_to set $(id)' },
      extra: [{ object: 'player', player: { name: '$(name)' }, color: 'white' }, text(' $(name)'), text(']')],
    }),
    cellGap: json(gap(3)),
    // The rows are stored components, so one tellraw prints a row with nothing between the entries
    row: json({ nbt: 'row[]', storage: 'xpeco:tmp', interpret: true, separator: '' }),
  },
};
