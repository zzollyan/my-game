/* AQ.Battle — turn-based theo SPD, break gauge, element advantage */
window.AQ = window.AQ || {};

AQ.Progression = {
  statAtLevel(base, level, ascension) {
    const lvFactor = 1 + (level - 1) * 0.045;
    const ascFactor = 1 + ascension * 0.12;
    return Math.round(base * lvFactor * ascFactor);
  },
  resolvedStats(card, unit) {
    const lvl = unit.level || 1, asc = unit.ascension || 0;
    return {
      hp: this.statAtLevel(card.hp, lvl, asc),
      atk: this.statAtLevel(card.atk, lvl, asc),
      def: this.statAtLevel(card.def, lvl, asc),
      spd: card.spd + Math.floor(asc * 1.5),
      maxEnergy: 100
    };
  }
};

AQ.Unit = class {
  constructor(card, unitData, side) {
    this.card = card;
    this.side = side; // 'player' | 'enemy'
    const stats = AQ.Progression.resolvedStats(card, unitData || {});
    this.maxHp = stats.hp; this.hp = stats.hp;
    this.atk = stats.atk; this.def = stats.def; this.spd = stats.spd;
    this.energy = 0; this.maxEnergy = 100;
    this.element = card.element; this.role = card.role;
    this.breakGauge = 100; this.broken = false; this.brokenTurns = 0;
    this.buffs = []; this.debuffs = [];
    this.alive = true;
  }
  isElementWeakAgainst(attackerElement) {
    return AQ.ELEMENT_ADV[attackerElement] === this.element;
  }
};

AQ.BattleEngine = class {
  constructor(playerUnits, enemyUnits, log = console.log) {
    this.units = [...playerUnits, ...enemyUnits];
    this.turnOrder = [];
    this.log = log;
    this.turnCount = 0;
  }

  buildTurnOrder() {
    this.turnOrder = this.units
      .filter(u => u.alive)
      .sort((a, b) => b.spd - a.spd);
  }

  damage(attacker, target, mult, actionElement) {
    let raw = attacker.atk * mult - target.def * AQ.CONST.DEF_FACTOR;
    raw = Math.max(raw, 1);

    const isAdv = AQ.ELEMENT_ADV[attacker.element] === target.element;
    if (isAdv) raw *= AQ.CONST.ELEMENT_ADV_MULT;

    if (target.broken) raw *= AQ.CONST.BREAK_STUN_MULT;

    if (isAdv && !target.broken) {
      target.breakGauge -= 25;
      if (target.breakGauge <= 0) {
        target.breakGauge = 0;
        target.broken = true;
        target.brokenTurns = 1;
        this.log(`${target.card.name} bị BREAK! Choáng + nhận 50% dmg tăng.`);
      }
    }

    target.hp = Math.max(0, target.hp - Math.round(raw));
    if (target.hp === 0) target.alive = false;
    return Math.round(raw);
  }

  basicAttack(attacker, target) {
    const dmg = this.damage(attacker, target, AQ.CONST.BASIC_MULT);
    attacker.energy = Math.min(attacker.maxEnergy, attacker.energy + AQ.CONST.BASIC_ENERGY);
    this.log(`${attacker.card.name} dùng [${attacker.card.skills.basic.name}] gây ${dmg} dmg lên ${target.card.name}.`);
    return dmg;
  }

  skillAttack(attacker, target) {
    if (attacker.energy < AQ.CONST.SKILL_ENERGY) return null;
    const dmg = this.damage(attacker, target, AQ.CONST.SKILL_MULT);
    attacker.energy = Math.min(attacker.maxEnergy, attacker.energy + AQ.CONST.SKILL_ENERGY);
    this.log(`${attacker.card.name} dùng [${attacker.card.skills.skill.name}] gây ${dmg} dmg lên ${target.card.name}.`);
    return dmg;
  }

  ultimateAttack(attacker, target) {
    if (attacker.energy < AQ.CONST.ULT_ENERGY_COST) return null;
    const dmg = this.damage(attacker, target, AQ.CONST.ULT_MULT);
    attacker.energy = 0;
    this.log(`${attacker.card.name} kích hoạt TUYỆT KỸ [${attacker.card.skills.ultimate.name}] gây ${dmg} dmg lên ${target.card.name}!`);
    return dmg;
  }

  takeTurn(unit, chooseAction, chooseTarget) {
    if (!unit.alive) return;
    if (unit.broken && unit.brokenTurns > 0) {
      unit.brokenTurns--;
      if (unit.brokenTurns === 0) { unit.broken = false; unit.breakGauge = 100; }
      this.log(`${unit.card.name} đang choáng, bỏ lượt.`);
      return;
    }
    const enemies = this.units.filter(u => u.side !== unit.side && u.alive);
    if (!enemies.length) return;
    const target = chooseTarget ? chooseTarget(unit, enemies) : enemies[0];
    const action = chooseAction ? chooseAction(unit) : (unit.energy >= AQ.CONST.ULT_ENERGY_COST ? 'ultimate' : unit.energy >= AQ.CONST.SKILL_ENERGY ? 'skill' : 'basic');

    if (action === 'ultimate') this.ultimateAttack(unit, target) ?? this.basicAttack(unit, target);
    else if (action === 'skill') this.skillAttack(unit, target) ?? this.basicAttack(unit, target);
    else this.basicAttack(unit, target);
  }

  isOver() {
    const p = this.units.some(u => u.side === 'player' && u.alive);
    const e = this.units.some(u => u.side === 'enemy' && u.alive);
    return !p || !e;
  }

  winner() {
    if (!this.isOver()) return null;
    return this.units.some(u => u.side === 'player' && u.alive) ? 'player' : 'enemy';
  }

  runRound(chooseAction, chooseTarget) {
    this.turnCount++;
    this.buildTurnOrder();
    for (const unit of this.turnOrder) {
      if (this.isOver()) break;
      this.takeTurn(unit, chooseAction, chooseTarget);
    }
  }
};
