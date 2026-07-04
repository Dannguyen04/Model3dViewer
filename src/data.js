// ---------------------------------------------------------------------------
// DỮ LIỆU NHÂN VẬT
// Thêm nhân vật = tăng characterCount; thêm info thật = thêm entry profiles;
// thêm model 3D = thêm entry models. Nhân vật chưa có model -> nút 3D tự ẩn.
// ---------------------------------------------------------------------------

import raw from "./data.json";

const img = (name) => encodeURI(`/character_image/${name}`);

export const TBD = "Đang cập nhật";

const placeholderStats = [
    { icon: "❔", label: "Giới tính", value: TBD },
    { icon: "❔", label: "Tuổi",      value: TBD },
    { icon: "❔", label: "Chiều cao", value: TBD },
    { icon: "❔", label: "Tóc",       value: TBD },
    { icon: "❔", label: "Mắt",       value: TBD },
];

export const DECKS = raw.decks;
const DECK_ORDER = Object.keys(DECKS);

const IMAGE_FILES = Array.from(
    { length: raw.characterCount },
    (_, i) => `Untitled_Artwork ${i + 1}.webp`,
);

export const CHARACTERS = IMAGE_FILES.map((file, i) => {
    const p = raw.profiles[file];
    const deck = p?.deck ?? DECK_ORDER[i % DECK_ORDER.length];
    return {
        id: `c${i}`,
        name:    p?.name    ?? `Nhân vật #${String(i + 1).padStart(2, "0")}`,
        tagline: p?.tagline ?? TBD,
        image:   img(file),
        model:   raw.models[file],
        scale:   0.5,
        deck,
        accent: DECKS[deck],
        stats: p?.stats ?? placeholderStats,
        bio:  p?.bio  ?? "Thông tin nhân vật này đang được cập nhật.",
        note: p?.note ?? "Hồ sơ sẽ sớm được công bố.",
    };
});

export const MODEL_URLS = CHARACTERS.filter((c) => c.model).map((c) => c.model);

export const accentVars = (c) => ({
    "--accent":       c.accent.main,
    "--accent-light": c.accent.light,
    "--accent-dark":  c.accent.dark,
});
