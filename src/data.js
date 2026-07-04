// ---------------------------------------------------------------------------
// DỮ LIỆU NHÂN VẬT
// Thêm nhân vật = thêm 1 ảnh vào IMAGE_FILES; thêm info thật = thêm entry PROFILES;
// thêm model 3D = thêm entry MODELS. Nhân vật chưa có model -> nút 3D tự ẩn.
// ---------------------------------------------------------------------------

const img = (name) => encodeURI(`/character_image/${name}`);

// Bộ thông số "đang cập nhật" dùng chung cho các nhân vật chưa có info.
export const TBD = "Đang cập nhật";

const placeholderStats = [
    { icon: "❔", label: "Giới tính", value: TBD },
    { icon: "❔", label: "Tuổi", value: TBD },
    { icon: "❔", label: "Chiều cao", value: TBD },
    { icon: "❔", label: "Tóc", value: TBD },
    { icon: "❔", label: "Mắt", value: TBD },
];

// Bảng màu 6 deck (khớp palette.css).
export const DECKS = {
    GROW: { main: "#1fa36b", light: "#6fbf3b", dark: "#0f5c3c" },
    HERO: { main: "#1e5fa8", light: "#4a90d9", dark: "#123a66" },
    ADVENTURE: { main: "#b01818", light: "#e8433a", dark: "#6e0f0f" },
    EVENT: { main: "#9b1fc4", light: "#c64de8", dark: "#5e1178" },
    STRATEGY: { main: "#35c4e8", light: "#a8e8f5", dark: "#1e7c93" },
    EQUIPMENT: { main: "#d98b10", light: "#e6a817", dark: "#8a5606" },
};
const DECK_ORDER = Object.keys(DECKS);

// Danh sách ảnh nhân vật theo thứ tự số của tên file ảnh 2D (khớp file thật
// trong public/character_image). Đủ 20 nhân vật (số 1–20).
const IMAGE_FILES = Array.from(
    { length: 20 },
    (_, i) => `Untitled_Artwork ${i + 1}.webp`,
);

// Model 3D đã có (gán theo tên file ảnh). Nhân vật không có -> nút 3D tự ẩn.
const MODELS = {
    "Untitled_Artwork 1.webp": "/1.glb",
    "Untitled_Artwork 2.webp": "/2.glb",
    "Untitled_Artwork 3.webp": "/3.glb",
    "Untitled_Artwork 6.webp": "/6.glb",
    "Untitled_Artwork 8.webp": "/8.glb",
    "Untitled_Artwork 10.webp": "/10.glb",
    "Untitled_Artwork 11.webp": "/11.glb",
    "Untitled_Artwork 15.webp": "/15.glb",
    "Untitled_Artwork 17.webp": "/17.glb",
    "Untitled_Artwork 18.webp": "/18.glb",
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
    const p = PROFILES[file];
    const deck = p?.deck ?? DECK_ORDER[i % DECK_ORDER.length];
    return {
        id: `c${i}`,
        name: p?.name ?? `Nhân vật #${String(i + 1).padStart(2, "0")}`,
        tagline: p?.tagline ?? TBD,
        image: img(file),
        model: MODELS[file],
        scale: 0.5,
        deck,
        accent: DECKS[deck],
        stats: p?.stats ?? placeholderStats,
        bio: p?.bio ?? "Thông tin nhân vật này đang được cập nhật.",
        note: p?.note ?? "Hồ sơ sẽ sớm được công bố.",
    };
});

// Danh sách model để preload lười khi cần.
export const MODEL_URLS = CHARACTERS.filter((c) => c.model).map((c) => c.model);

// Đổ bộ màu của nhân vật vào CSS variables (ghi đè --accent* cho subtree).
export const accentVars = (c) => ({
    "--accent": c.accent.main,
    "--accent-light": c.accent.light,
    "--accent-dark": c.accent.dark,
});
