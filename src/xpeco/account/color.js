// Which of V, p, q, t each channel takes in HSV to RGB, by hue sector 0 to 5. Rows are R, G, B.
module.exports = {
  sectors: [
    ['V', 't', 'p'],
    ['q', 'V', 'p'],
    ['p', 'V', 't'],
    ['p', 'q', 'V'],
    ['t', 'p', 'V'],
    ['V', 'p', 'q'],
  ],
};
