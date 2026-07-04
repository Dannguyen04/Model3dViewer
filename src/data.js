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

// Model 3D đã có (gán theo tên file ảnh). Nhân vật không có -> nút 3D tự ẩn.
const MODELS = {
    "Untitled_Artwork 1.webp": "/1.glb",
    "Untitled_Artwork 2.webp": "/2.glb",
    "Untitled_Artwork 3.webp": "/3.glb",
    "Untitled_Artwork 4.webp": "/4.glb",
    "Untitled_Artwork 5.webp": "/5.glb",
    "Untitled_Artwork 6.webp": "/6.glb",
    "Untitled_Artwork 7.webp": "/7.glb",
    "Untitled_Artwork 8.webp": "/8.glb", //Borack Wesker
    "Untitled_Artwork 9.webp": "/9.glb",
    "Untitled_Artwork 10.webp": "/10.glb",
    "Untitled_Artwork 11.webp": "/11.glb",
    "Untitled_Artwork 12.webp": "/12.glb",
    "Untitled_Artwork 13.webp": "/13.glb",
    "Untitled_Artwork 14.webp": "/14.glb",
    "Untitled_Artwork 15.webp": "/15.glb",
    "Untitled_Artwork 16.webp": "/16.glb",
    "Untitled_Artwork 17.webp": "/17.glb",
    "Untitled_Artwork 18.webp": "/18.glb",
    "Untitled_Artwork 19.webp": "/19.glb",
    "Untitled_Artwork 20.webp": "/20.glb",
};

// Hồ sơ riêng cho nhân vật đã có thông tin (key = tên file ảnh).
// Thêm info thật cho nhân vật nào thì thêm 1 entry vào đây.
const PROFILES = {
    "Untitled_Artwork 8.webp": {
        name: "Borack Wesker",
        tagline: "Người chế thuốc giải độc",
        deck: "GROW",
        stats: [
            { icon: "♂️", label: "Giới tính", value: "Nam" },
            { icon: "🎂", label: "Tuổi", value: "18" },
            { icon: "📏", label: "Chiều cao", value: "166 cm" },
            {
                icon: "💇",
                label: "Tóc",
                value: "Xám · side part + băng rô trên trán",
            },
            { icon: "👁", label: "Mắt", value: "Xanh lam" },
        ],
        bio: "Dáng người nhỏ nhắn do di chứng của các cuộc thí nghiệm hoá học khi phát triển công nghệ giải độc mới. Tính cách ôn hoà, thân thiện nhưng không thể nói được vì tuyến nước bọt có khả năng giải độc rất lớn nên luôn được thu thập để tạo thuốc giải. Thích nấu ăn.",
        note: "Ngôn ngữ ký hiệu là yêu cầu để giao tiếp với cậu ta.",
    },
};

// Sinh danh sách nhân vật từ ảnh: có PROFILES thì dùng, không thì placeholder.
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
