/* AQ.Data — định nghĩa thẻ bài, hệ, vai trò, hằng số rarity */
window.AQ = window.AQ || {};

AQ.RARITY = {
  1: { stars: 1, color: '#9CA3AF', glow: 'rgba(156,163,175,.6)',  rateBase: 42.0, name: 'Phổ Thông' },
  2: { stars: 2, color: '#34D399', glow: 'rgba(52,211,153,.6)',   rateBase: 30.0, name: 'Thường' },
  3: { stars: 3, color: '#3B82F6', glow: 'rgba(59,130,246,.7)',   rateBase: 18.0, name: 'Hiếm', anim: 'blue' },
  4: { stars: 4, color: '#A855F7', glow: 'rgba(168,85,247,.8)',   rateBase: 7.5,  name: 'Sử Thi', anim: 'purple' },
  5: { stars: 5, color: '#FACC15', glow: 'rgba(250,204,21,.9)',   rateBase: 1.8,  name: 'Huyền Thoại', anim: 'gold' },
  6: { stars: 6, color: '#EF4444', glow: 'rgba(239,68,68,1)',     rateBase: 0.6,  name: 'Thần Thoại', anim: 'red' },
  7: { stars: 7, color: 'rainbow', glow: 'rainbow',                rateBase: 0.1,  name: 'Vĩnh Cửu', anim: 'rainbow', cutscene: true }
};

AQ.ELEMENTS = ['Fire', 'Water', 'Wind', 'Earth', 'Light', 'Dark'];

// hệ khắc hệ: key thắng value (+30% dmg)
AQ.ELEMENT_ADV = {
  Fire: 'Wind', Wind: 'Earth', Earth: 'Water', Water: 'Fire',
  Light: 'Dark', Dark: 'Light'
};

AQ.ROLES = ['DPS', 'Tank', 'Support', 'Healer', 'Debuffer', 'Buffer'];

AQ.CONST = {
  PITY_SOFT: 70,        // pity mềm bắt đầu tăng rate 5★+
  PITY_HARD: 90,         // pity cứng đảm bảo 5★+
  PITY_HARD_6: 180,
  PITY_HARD_7: 500,
  BASIC_MULT: 1.0, BASIC_ENERGY: 20,
  SKILL_MULT: 1.8, SKILL_ENERGY: 30,
  ULT_MULT: 3.0, ULT_ENERGY_COST: 100,
  DEF_FACTOR: 0.5,
  ELEMENT_ADV_MULT: 1.3,
  BREAK_STUN_MULT: 1.5,
  MAX_LEVEL: 80,
  MAX_ASCENSION: 6,
  MAX_SKILL_LV: 10
};

/* Mẫu thẻ bài — id, name, rarity, element, role, base stats @ Lv1, skills, passive */
AQ.CARDS = [
  { id: 'c001', name: 'Lý Thường Kiệt', rarity: 7, element: 'Light', role: 'DPS',
    hp: 1200, atk: 220, def: 90, spd: 112, energy: 0, img: 'assets/cards/c001.png',
    skills: {
      basic: { name: 'Trảm Phong', desc: 'Đòn chém cơ bản gây 100% ATK.' },
      skill: { name: 'Nam Quốc Sơn Hà', desc: 'Gây 180% ATK, hồi 15 năng lượng đồng đội.' },
      ultimate: { name: 'Thiên Mệnh Giáng Thế', desc: '300% ATK toàn bộ kẻ địch, +50% crit dmg 2 lượt.' },
      passive: { name: 'Hồn Thiêng Sông Núi', desc: 'Mỗi lượt +8% ATK cho cả đội (cộng dồn, tối đa 3 lần), synergy với hệ Light.' }
    }},
  { id: 'c002', name: 'Bùi Thị Xuân', rarity: 6, element: 'Fire', role: 'DPS',
    hp: 1050, atk: 205, def: 80, spd: 104, energy: 0, img: 'assets/cards/c002.png',
    skills: {
      basic: { name: 'Hỏa Tiễn', desc: '100% ATK, 20% gây Bỏng (DoT 2 lượt).' },
      skill: { name: 'Voi Chiến Xung Trận', desc: '180% ATK lan rộng 2 mục tiêu liền kề.' },
      ultimate: { name: 'Tây Sơn Liệt Hỏa', desc: '300% ATK + đốt cháy Break gauge -40%.' },
      passive: { name: 'Nộ Hỏa', desc: 'Khi địch dưới 30% HP, ATK bản thân +25%.' }
    }},
  { id: 'c003', name: 'Trần Hưng Đạo', rarity: 6, element: 'Earth', role: 'Tank',
    hp: 1800, atk: 130, def: 180, spd: 88, energy: 0, img: 'assets/cards/c003.png',
    skills: {
      basic: { name: 'Khiên Vạn Kiếp', desc: '100% ATK, hút 1 mục tiêu công kích.' },
      skill: { name: 'Hịch Tướng Sĩ', desc: '180% ATK + Khiêu khích toàn địch 1 lượt.' },
      ultimate: { name: 'Bạch Đằng Giang', desc: '300% ATK + giảm 30% sát thương nhận vào cho cả đội 2 lượt.' },
      passive: { name: 'Trấn Quốc', desc: 'Giảm 15% sát thương nhận; khi Break, hồi 20% HP tối đa.' }
    }},
  { id: 'c004', name: 'Ỷ Lan', rarity: 5, element: 'Light', role: 'Healer',
    hp: 950, atk: 140, def: 95, spd: 96, energy: 0, img: 'assets/cards/c004.png',
    skills: {
      basic: { name: 'Liễu Pháp', desc: '100% ATK, hồi máu nhẹ 10% ATK.' },
      skill: { name: 'Nhiếp Chính Từ Tâm', desc: 'Hồi 180% ATK máu cho cả đội.' },
      ultimate: { name: 'Quan Âm Hiển Linh', desc: 'Hồi đầy 1 đồng đội + miễn nhiễm 1 lượt.' },
      passive: { name: 'Từ Bi', desc: 'Cuối mỗi lượt hồi 5% HP tối đa cho đồng đội thấp máu nhất.' }
    }},
  { id: 'c005', name: 'Nguyễn Trãi', rarity: 5, element: 'Dark', role: 'Debuffer',
    hp: 980, atk: 165, def: 85, spd: 100, energy: 0, img: 'assets/cards/c005.png',
    skills: {
      basic: { name: 'Bút Sắc', desc: '100% ATK, -10% DEF địch 1 lượt.' },
      skill: { name: 'Bình Ngô Đại Cáo', desc: '180% ATK toàn địch, -20% ATK địch 2 lượt.' },
      ultimate: { name: 'Tâm Công', desc: '300% ATK + khóa skill địch yếu nhất 1 lượt.' },
      passive: { name: 'Mưu Lược', desc: 'Debuff do đồng đội gây ra kéo dài thêm 1 lượt.' }
    }},
  { id: 'c006', name: 'Phạm Ngũ Lão', rarity: 4, element: 'Earth', role: 'DPS',
    hp: 1000, atk: 175, def: 100, spd: 98, energy: 0, img: 'assets/cards/c006.png',
    skills: {
      basic: { name: 'Thương Pháp', desc: '100% ATK.' },
      skill: { name: 'Đan Tâm', desc: '180% ATK, +Break dmg 20%.' },
      ultimate: { name: 'Thiết Giáp Phá Trận', desc: '300% ATK, phá Break tức thì nếu còn dưới 30%.' },
      passive: { name: 'Kiên Định', desc: 'Synergy Earth: +10% DEF cho đội nếu có ≥2 hệ Earth.' }
    }},
  { id: 'c007', name: 'Lê Lợi', rarity: 5, element: 'Earth', role: 'Buffer',
    hp: 1100, atk: 150, def: 110, spd: 94, energy: 0, img: 'assets/cards/c007.png',
    skills: {
      basic: { name: 'Gươm Thần', desc: '100% ATK.' },
      skill: { name: 'Lam Sơn Tụ Nghĩa', desc: '+25% ATK cả đội 2 lượt.' },
      ultimate: { name: 'Hoàn Kiếm', desc: '+40% ATK & SPD cả đội 1 lượt, hồi 20 energy mỗi người.' },
      passive: { name: 'Khởi Nghĩa', desc: 'Đầu trận, cả đội +15 năng lượng khởi điểm.' }
    }},
  { id: 'c008', name: 'Triệu Thị Trinh', rarity: 4, element: 'Wind', role: 'DPS',
    hp: 980, atk: 180, def: 75, spd: 118, energy: 0, img: 'assets/cards/c008.png',
    skills: {
      basic: { name: 'Song Đao', desc: '100% ATK, 2 hit liên hoàn.' },
      skill: { name: 'Cưỡi Voi Xung Phong', desc: '180% ATK, +SPD bản thân 15% 1 lượt.' },
      ultimate: { name: 'Nhụy Kiều Tướng Quân', desc: '300% ATK, hành động lại nếu hạ gục mục tiêu.' },
      passive: { name: 'Tốc Chiến', desc: 'Synergy Wind: SPD cao nhất đội +10% ATK toàn đội.' }
    }},
  { id: 'c009', name: 'Mai Hắc Đế', rarity: 3, element: 'Fire', role: 'DPS',
    hp: 850, atk: 150, def: 70, spd: 90, energy: 0, img: 'assets/cards/c009.png',
    skills: {
      basic: { name: 'Hỏa Quyền', desc: '100% ATK.' },
      skill: { name: 'Khởi Nghĩa Hoan Châu', desc: '180% ATK lan rộng nhẹ.' },
      ultimate: { name: 'Đế Vương Chi Nộ', desc: '300% ATK đơn mục tiêu.' }
    }},
  { id: 'c010', name: 'Dân Binh', rarity: 1, element: 'Earth', role: 'Tank',
    hp: 700, atk: 90, def: 90, spd: 70, energy: 0, img: 'assets/cards/c010.png',
    skills: {
      basic: { name: 'Đỡ Đòn', desc: '100% ATK.' },
      skill: { name: 'Phòng Ngự', desc: '180% ATK, +10% DEF bản thân.' },
      ultimate: { name: 'Tử Thủ', desc: '300% ATK, -20% sát thương nhận 1 lượt.' }
    }}
];

AQ.getCard = function (id) { return AQ.CARDS.find(c => c.id === id); };
