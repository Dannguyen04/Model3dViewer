// ---------------------------------------------------------------------------
// DỮ LIỆU NHÂN VẬT & ADVENTURE
// Hero: tăng characterCount; thêm profiles/models theo ảnh.
// Adventure: tăng adventureCount; thêm entry vào adventures (ảnh thẻ bài, không model 3D).
// ---------------------------------------------------------------------------

import raw from "./data.json";

const img = (name) => encodeURI(`/character_image/${name}`);
const cardImg = (name) => encodeURI(`/card_image/${name}`);
const CARD_PLACEHOLDER = "placeholder.svg";

export const TBD = "Đang cập nhật";

const placeholderStats = [
    { icon: "♂️", label: "Giới tính", value: TBD },
    { icon: "🎂", label: "Tuổi",      value: TBD },
    { icon: "📏", label: "Chiều cao", value: TBD },
];

// 5 chỉ số chiến đấu (thang 0–10) — hiển thị dạng thanh bar.
const placeholderPowers = [
    { label: "VIT", value: 0 },
    { label: "CTR", value: 0 },
    { label: "STR", value: 0 },
    { label: "INT", value: 0 },
    { label: "LUK", value: 0 },
];

export const DECKS = raw.decks;
const DECK_ORDER = Object.keys(DECKS);

const IMAGE_FILES = Array.from(
    { length: raw.characterCount },
    (_, i) => `Untitled_Artwork ${i + 1}.webp`,
);

// Sinh danh sách nhân vật từ ảnh: có PROFILES thì dùng, không thì placeholder.
const HERO_CHARACTERS = IMAGE_FILES.map((file, i) => {
    const p = raw.profiles[file];
    const deck = p?.deck ?? DECK_ORDER[i % DECK_ORDER.length];
    return {
        id: `c${i}`,
        name: p?.name ?? `Nhân vật #${String(i + 1).padStart(2, "0")}`,
        tagline: p?.tagline ?? TBD,
        charClass: p?.class ?? TBD,
        image: img(file),
        hasQr: true,
        model: raw.models[file],
        scale: 0.5,
        deck,
        accent: DECKS[deck],
        stats: p?.stats ?? placeholderStats,
        powers: p?.powers ?? placeholderPowers,
        bio: p?.bio ?? "Thông tin nhân vật này đang được cập nhật.",
        note: p?.note ?? "Hồ sơ sẽ sớm được công bố.",
    };
});

// Thẻ đến từ dữ liệu Thám hiểm (Adventure 1/2/3): sinh vật/sự kiện/lựa chọn —
// chưa có ảnh riêng, model 3D hay QR nên card/hồ sơ tự ẩn các phần đó.
const EXTRA_CHARACTERS = (raw.extras ?? []).map((e, i) => ({
    id: `x${i}`,
    name: e.name,
    tagline: e.class,
    charClass: e.class,
    image: null,
    hasQr: false,
    model: undefined,
    scale: 0.5,
    deck: e.deck,
    accent: DECKS[e.deck],
    stats: e.stats,
    powers: e.powers,
    bio: e.bio,
    note: e.note,
}));

export const CHARACTERS = [...HERO_CHARACTERS, ...EXTRA_CHARACTERS];

export const MODEL_URLS = CHARACTERS.filter((c) => c.model).map((c) => c.model);

// Adventure: ảnh thẻ bài (card_image/), không có model 3D.
export const ADVENTURES = (raw.adventures ?? []).map((a) => ({
    id: a.id,
    name: a.name,
    tagline: a.collection ?? TBD,
    charClass: a.class ?? TBD,
    collection: a.collection ?? TBD,
    image: cardImg(a.card ?? CARD_PLACEHOLDER),
    model: null,
    isAdventure: true,
    deck: a.deck ?? "ADVENTURE",
    accent: DECKS[a.deck ?? "ADVENTURE"],
    stats: a.stats ?? placeholderStats,
    powers: a.powers ?? placeholderPowers,
    bio: a.bio ?? "Thông tin đang được cập nhật.",
    note: a.note ?? "",
}));

export const SHOWCASE = [...CHARACTERS, ...ADVENTURES];

export const accentVars = (c) => ({
    "--accent": c.accent.main,
    "--accent-light": c.accent.light,
    "--accent-dark": c.accent.dark,
});
