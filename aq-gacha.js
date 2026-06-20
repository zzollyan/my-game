/* AQ.Gacha — quay thẻ, pity system, lưu trữ kho */
window.AQ = window.AQ || {};

AQ.Storage = {
  KEY_INV: 'aq-inventory',
  KEY_PITY: 'aq-pity',
  KEY_CURRENCY: 'aq-currency',
  KEY_TEAM: 'aq-team',
  KEY_PROFILE: 'aq-profile',

  load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
    catch { return fallback; }
  },
  save(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  getInventory() { return this.load(this.KEY_INV, []); },
  setInventory(inv) { this.save(this.KEY_INV, inv); },

  getPity() { return this.load(this.KEY_PITY, { count: 0, count6: 0, count7: 0 }); },
  setPity(p) { this.save(this.KEY_PITY, p); },

  getCurrency() { return this.load(this.KEY_CURRENCY, { gem: 1600, ticket: 10 }); },
  setCurrency(c) { this.save(this.KEY_CURRENCY, c); },

  getTeam() { return this.load(this.KEY_TEAM, [null, null, null, null]); },
  setTeam(t) { this.save(this.KEY_TEAM, t); }
};

AQ.Gacha = {
  COST_GEM: 160,

  /** trả về tỉ lệ hiện tại đã áp dụng pity mềm */
  currentRates(pity) {
    const r = {};
    for (const k in AQ.RARITY) r[k] = AQ.RARITY[k].rateBase;
    if (pity.count >= AQ.CONST.PITY_SOFT) {
      const bonus = (pity.count - AQ.CONST.PITY_SOFT + 1) * 4;
      r[5] += bonus; r[6] += bonus * 0.3;
    }
    return r;
  },

  rollRarity(pity) {
    if (pity.count7 + 1 >= AQ.CONST.PITY_HARD_7) return 7;
    if (pity.count6 + 1 >= AQ.CONST.PITY_HARD_6) return 6;
    if (pity.count + 1 >= AQ.CONST.PITY_HARD) return Math.random() < 0.15 ? 6 : 5;

    const rates = this.currentRates(pity);
    const total = Object.values(rates).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (const k of [7, 6, 5, 4, 3, 2, 1]) {
      if (roll < rates[k]) return k;
      roll -= rates[k];
    }
    return 1;
  },

  pickCardByRarity(rarity) {
    const pool = AQ.CARDS.filter(c => c.rarity === rarity);
    if (!pool.length) return AQ.CARDS[AQ.CARDS.length - 1];
    return pool[Math.floor(Math.random() * pool.length)];
  },

  updatePity(pity, rarity) {
    pity.count++; pity.count6++; pity.count7++;
    if (rarity >= 5) pity.count = 0;
    if (rarity >= 6) pity.count6 = 0;
    if (rarity >= 7) pity.count7 = 0;
    return pity;
  },

  /** quay n lần, trả {results:[{card,rarity,isNew}], pity, currency} */
  pull(n = 1) {
    const currency = AQ.Storage.getCurrency();
    const cost = this.COST_GEM * n;
    if (currency.gem < cost) return { error: 'NOT_ENOUGH_GEM' };
    currency.gem -= cost;

    let pity = AQ.Storage.getPity();
    const inv = AQ.Storage.getInventory();
    const results = [];

    for (let i = 0; i < n; i++) {
      const rarity = this.rollRarity(pity);
      pity = this.updatePity(pity, rarity);
      const card = this.pickCardByRarity(rarity);
      const existing = inv.find(x => x.cardId === card.id);
      const isNew = !existing;
      if (existing) existing.dupes = (existing.dupes || 0) + 1;
      else inv.push({ cardId: card.id, level: 1, ascension: 0, skillLv: { basic: 1, skill: 1, ultimate: 1 }, dupes: 0, equipment: [] });
      results.push({ card, rarity, isNew });
    }

    AQ.Storage.setCurrency(currency);
    AQ.Storage.setPity(pity);
    AQ.Storage.setInventory(inv);
    return { results, pity, currency };
  },

  /** thời lượng animation gợi ý (ms) theo sao, dùng cho UI */
  animDuration(rarity) {
    return rarity >= 7 ? 4500 : rarity >= 6 ? 3200 : rarity >= 5 ? 2600 : rarity >= 4 ? 1800 : 1000;
  }
};
