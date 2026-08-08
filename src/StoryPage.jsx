import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    ScrollText,
    Target,
    Dices,
    Play,
    RotateCw,
    Users,
    Layers,
    Swords,
    Skull,
    Heart,
    Crosshair,
    Sword,
    Brain,
    Clover,
    ChevronDown,
    ArrowRight,
    List,
    X,
    Search,
    History,
} from "lucide-react";
import { DECKS, CHARACTERS } from "./data.js";
import {
    STORY,
    PREP,
    OBJECTIVE,
    SETUP_STEPS,
    TURN_FLOW,
    ROUND_NOTE,
    FORMATION_INTRO,
    FORMATION_SWAPS,
    FORMATION_OVERFLOW,
    CARD_ANATOMY,
    CARD_TYPES,
    COMBAT,
    PENALTIES,
} from "./storyRulesContent.js";

// 1 thẻ minh hoạ / kind (Quái vật, Sự kiện, Lựa chọn) lấy từ dữ liệu thẻ Thám
// hiểm thật đã có sẵn ảnh — cho người chơi thấy mặt thẻ thực tế ngay tại luật
// thay vì chỉ đọc mô tả suông.
const ADVENTURE_SAMPLE_CLASSES = ["Sinh vật thù địch", "Sự kiện", "Lựa chọn"];
const ADVENTURE_SAMPLE_CARDS = ADVENTURE_SAMPLE_CLASSES.map((cls) =>
    CHARACTERS.find((c) => c.charClass === cls && c.image),
).filter(Boolean);

const ANATOMY_CARD = CHARACTERS.find(
    (c) => c.name === CARD_ANATOMY.cardName && c.deck === CARD_ANATOMY.deck,
);

const COMBAT_ICON = {
    VIT: Heart,
    CTR: Crosshair,
    STR: Sword,
    INT: Brain,
    LUK: Clover,
};

// Giá trị cao nhất trong ví dụ chiến đấu — dùng để scale độ dài thanh chỉ số
// trong bảng (0 → giá trị này = 0 → 100%), chỉ để minh hoạ trực quan hơn con
// số suông, không phải luật (không có "thang điểm tối đa" thật trong luật).
const COMBAT_MAX = Math.max(
    ...COMBAT.example.teamA.powers,
    ...COMBAT.example.teamB.powers,
);

// Mục lục của section "Luật chơi" — id phải khớp với id truyền cho từng
// RuleBlock bên dưới, dùng chung cho cả nhảy nhanh (click) và scroll-spy
// (đánh dấu mục đang xem khi cuộn).
const RULES_TOC = [
    { id: "objective", label: "Mục tiêu", icon: Target },
    { id: "prep", label: "Chuẩn bị", icon: Dices },
    { id: "setup", label: "Mở đầu", icon: Play },
    { id: "turns", label: "Lượt chơi", icon: RotateCw },
    { id: "formation", label: "Đội hình", icon: Users },
    { id: "cards", label: "Thẻ bài", icon: Layers },
    { id: "combat", label: "Chiến đấu", icon: Swords },
    { id: "penalties", label: "Hình phạt", icon: Skull },
];

// Chỉ những deck thực sự có nhân vật/lá bài duyệt được ở trang Showcase mới
// hiện link "Xem trong Showcase" — [Trang bị]/[Phát triển]/[Chiến lược] chưa
// có model/asset riêng nên link sẽ ra danh sách rỗng, không hiện là đúng.
const BROWSABLE_DECKS = new Set([
    "HERO",
    "ADVENTURE 1",
    "ADVENTURE 2",
    "ADVENTURE 3",
]);

const RULE_IDS = RULES_TOC.map((r) => r.id);

// Gom text thật của từng mục (không chỉ tóm tắt) để ô tìm kiếm khớp được cả
// chi tiết nhỏ nằm sâu trong card đang thu gọn (vd "Token hạn chế", "INT").
const RULE_SEARCH_TEXT = {
    objective: [OBJECTIVE.win, OBJECTIVE.lose].join(" "),
    prep: [
        PREP.players,
        PREP.dice,
        PREP.board,
        ...PREP.tokens,
        ...PREP.deckList,
    ].join(" "),
    setup: SETUP_STEPS.join(" "),
    turns: [...TURN_FLOW, ROUND_NOTE].join(" "),
    formation: [
        FORMATION_INTRO,
        ...FORMATION_SWAPS.map((s) => `${s.label} ${s.limit}`),
        ...FORMATION_OVERFLOW.map((f) => `${f.subject} ${f.limit} ${f.rule}`),
    ].join(" "),
    cards: CARD_TYPES.map((t) =>
        [
            t.name,
            t.desc,
            t.note,
            ...(t.kinds ?? []).map((k) => `${k.name} ${k.desc}`),
        ]
            .filter(Boolean)
            .join(" "),
    ).join(" "),
    combat: [
        COMBAT.order.join(" "),
        COMBAT.rule,
        ...COMBAT.tie,
        COMBAT.scoring,
        COMBAT.example.teamA.label,
        COMBAT.example.teamB.label,
        COMBAT.example.result,
    ].join(" "),
    penalties: PENALTIES.map((p) =>
        [p.name, p.desc, p.note].filter(Boolean).join(" "),
    ).join(" "),
};

const RULE_HAYSTACK = Object.fromEntries(
    RULES_TOC.map(({ id, label }) => [
        id,
        `${label} ${RULE_SEARCH_TEXT[id] ?? ""}`.toLowerCase(),
    ]),
);

// Mỗi mục 1 màu chủ đề (không phải mức độ quan trọng) để lưới 8 card dễ quét
// mắt hơn thay vì đồng loạt cùng 1 màu cam — tận dụng lại token màu thương
// hiệu sẵn có trong palette.css, không thêm màu mới. "Mục tiêu" giữ nguyên
// màu cam highlight, không cần accent riêng.
const RULE_ACCENT = {
    prep: "var(--equipment-gold)",
    setup: "var(--hero-light)",
    turns: "var(--strategy)",
    formation: "var(--grow-green)",
    cards: "var(--event-light)",
    combat: "var(--adventure-light)",
    penalties: "var(--grow-magenta)",
};

// Màu theo deck (khớp bảng màu đang dùng ở trang thẻ bài) — giữ nguyên như
// trước, không quy về 3 màu chính.
function deckVars(deckKey) {
    const d = DECKS[deckKey];
    if (!d) return {};
    return {
        "--accent": d.main,
        "--accent-light": d.light,
        "--accent-dark": d.dark,
    };
}

// Header lớn căn giữa, dùng chung cho cả 2 section — cùng khuôn với
// .showcase-head (logo + tiêu đề căn giữa) ở trang Showcase, thay cho kiểu
// kicker/tiêu đề căn trái trước đây.
function SectionHead({ icon: Icon, kicker, title }) {
    return (
        <div className="story-head">
            <span className="section-kicker">
                <Icon size={15} strokeWidth={2.4} />
                {kicker}
            </span>
            <h2 className="story-title">{title}</h2>
        </div>
    );
}

// Khung "sổ tay trinh sát" (blueprint/dossier) — 4 vệt góc + nhãn "FIG. xx"
// dùng chung cho 3 khối minh hoạ trực quan nhất của Luật chơi (Cách đọc lá
// bài, Ví dụ chiến đấu, Cheat-sheet đội hình) để tạo phong cách nhất quán,
// gợi cảm giác tài liệu thực địa của Quân trinh sát trong cốt truyện.
function DossierFrame({ fig, title, className = "", children }) {
    return (
        <div className={`dossier-frame ${className}`}>
            <span className="dossier-corner dossier-corner--tl" />
            <span className="dossier-corner dossier-corner--tr" />
            <span className="dossier-corner dossier-corner--bl" />
            <span className="dossier-corner dossier-corner--br" />
            {(fig || title) && (
                <div className="dossier-caption">
                    {fig && <span className="dossier-fig">{fig}</span>}
                    {title && <span className="dossier-title">{title}</span>}
                </div>
            )}
            <div className="dossier-body">{children}</div>
        </div>
    );
}

// Mỗi mục luật là 1 card trong lưới — mặc định thu gọn (chỉ icon + tiêu đề +
// tóm tắt 1 dòng), click vào tiêu đề để mở rộng xem đầy đủ. Card đang mở tự
// chiếm trọn hàng (grid-column: 1 / -1, xem App.css) để có đủ chỗ đọc thay vì
// bị bó trong 1 ô lưới hẹp. Trạng thái mở/đóng được điều khiển từ StoryPage
// (không tự giữ state riêng) để nút "Mở tất cả" và tìm kiếm có thể ép mở.
function RuleBlock({
    id,
    icon: Icon,
    title,
    summary,
    highlight = false,
    badge,
    open,
    onToggle,
    onRegister,
    children,
}) {
    const contentId = `${id}-content`;
    const accent = RULE_ACCENT[id];

    return (
        <div
            ref={(el) => onRegister?.(id, el)}
            id={id}
            className={`rule-block${highlight ? " rule-block--highlight" : ""}${
                open ? " is-open" : ""
            }`}
            style={accent ? { "--rule-accent": accent } : undefined}
        >
            <h3 className="rule-block-title-wrap">
                <button
                    type="button"
                    className="rule-block-title"
                    aria-expanded={open}
                    aria-controls={contentId}
                    onClick={() => onToggle(id)}
                >
                    <span className="rule-block-title-main">
                        <Icon size={22} strokeWidth={2.2} />
                        <span className="rule-block-title-text">{title}</span>
                    </span>
                    <span className="rule-block-title-trail">
                        {badge && (
                            <span className="rule-block-badge">{badge}</span>
                        )}
                        <ChevronDown
                            size={18}
                            strokeWidth={2.4}
                            className="rule-block-chevron"
                        />
                    </span>
                </button>
            </h3>
            {!open && summary && (
                <p className="rule-block-summary">{summary}</p>
            )}
            <div className="rule-block-body" id={contentId}>
                <div className="rule-block-body-inner">{children}</div>
            </div>
        </div>
    );
}

function CardTypeEntry({ type, onViewDeck }) {
    return (
        <div
            className={`card-type${type.variant === "penalty" ? " is-penalty" : ""}`}
            style={deckVars(type.deck)}
        >
            <div className="card-type-head">
                <span className="card-type-name">{type.name}</span>
                <span className="card-type-limit">{type.limit}</span>
            </div>
            <p className="card-type-desc">{type.desc}</p>
            {type.kinds && (
                <ul className="card-type-kinds">
                    {type.kinds.map((k) => (
                        <li key={k.name}>
                            <strong>{k.name}:</strong> {k.desc}
                        </li>
                    ))}
                </ul>
            )}
            {type.key === "adventure" && ADVENTURE_SAMPLE_CARDS.length > 0 && (
                <div className="card-type-gallery">
                    {ADVENTURE_SAMPLE_CARDS.map((c) => (
                        <figure className="card-type-gallery-item" key={c.id}>
                            <img src={c.image} alt={c.name} loading="lazy" />
                            <figcaption>{c.charClass}</figcaption>
                        </figure>
                    ))}
                </div>
            )}
            {type.note && <p className="card-type-note">{type.note}</p>}
            {onViewDeck && BROWSABLE_DECKS.has(type.deck) && (
                <button
                    type="button"
                    className="card-type-link"
                    onClick={() => onViewDeck(type.deck)}
                >
                    Xem trong Showcase
                    <ArrowRight size={13} strokeWidth={2.4} />
                </button>
            )}
        </div>
    );
}

export default function StoryPage({ onBack, onViewDeck, onOpenLore }) {
    const loreRef = useRef(null);
    const rulesRef = useRef(null);
    const scrollRootRef = useRef(null);
    const ruleSectionRefs = useRef({});
    const [activeRuleId, setActiveRuleId] = useState(RULES_TOC[0].id);
    const [mobileTocOpen, setMobileTocOpen] = useState(false);
    const [openIds, setOpenIds] = useState(() => new Set(["objective"]));
    const [viewedIds, setViewedIds] = useState(() => new Set(["objective"]));
    const [query, setQuery] = useState("");
    const searchInputRef = useRef(null);

    const scrollTo = (ref) =>
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const registerRuleRef = (id, el) => {
        if (el) ruleSectionRefs.current[id] = el;
        else delete ruleSectionRefs.current[id];
    };

    const scrollToRule = (id) => {
        setQuery("");
        ruleSectionRefs.current[id]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        setMobileTocOpen(false);
    };

    const toggleRule = (id) =>
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const allOpen = openIds.size === RULE_IDS.length;
    const expandAll = () => setOpenIds(new Set(RULE_IDS));
    const collapseAll = () => setOpenIds(new Set());

    // Khi đang tìm kiếm: chỉ hiện card khớp từ khoá và luôn ép mở (để thấy
    // ngay chi tiết chứa từ khoá), không phụ thuộc openIds.
    const normalizedQuery = query.trim().toLowerCase();
    const matchIds = normalizedQuery
        ? RULE_IDS.filter((id) => RULE_HAYSTACK[id].includes(normalizedQuery))
        : null;
    const isRuleVisible = (id) => !matchIds || matchIds.includes(id);
    const isRuleOpen = (id) => (matchIds ? true : openIds.has(id));

    // Tiến trình đọc (badge "X/8 mục đã xem") — cộng dồn, không giảm khi thu
    // gọn lại. Theo cả mở tay lẫn "Mở tất cả" lẫn card được ép mở do tìm
    // kiếm, vì cả 3 đều có nghĩa là người dùng đã nhìn thấy nội dung đó.
    useEffect(() => {
        const currentlyOpen = matchIds ?? [...openIds];
        if (currentlyOpen.length === 0) return;
        setViewedIds((prev) => {
            const next = new Set(prev);
            let changed = false;
            currentlyOpen.forEach((id) => {
                if (!next.has(id)) {
                    next.add(id);
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [openIds, matchIds]);

    // "/" focus ô tìm kiếm luật chơi — đồng bộ với phím tắt tìm nhân vật ở
    // trang Showcase (App.jsx) để hành vi nhất quán toàn app.
    useEffect(() => {
        const onKey = (e) => {
            if (
                e.key === "/" &&
                document.activeElement !== searchInputRef.current
            ) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Mục lục sticky bị tắt trên mobile (xem App.css) để tránh đè nội dung
    // khi wrap 2 dòng — bù lại bằng nút nổi mở bottom-sheet, Esc để đóng.
    useEffect(() => {
        if (!mobileTocOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") setMobileTocOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [mobileTocOpen]);

    // Scroll-spy cho mục lục: mục nào đang gần đầu vùng nhìn thấy nhất thì
    // được đánh dấu active. Root là chính .story-scroll (container cuộn thật
    // sự), không phải viewport, vì trang dùng cuộn nội bộ. Phụ thuộc
    // normalizedQuery vì tìm kiếm unmount/remount card — observer cũ phải
    // được thay bằng cái mới quan sát đúng các node đang render lại.
    useEffect(() => {
        const root = scrollRootRef.current;
        if (!root) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length === 0) return;
                const topMost = visible.reduce((a, b) =>
                    a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
                );
                setActiveRuleId(topMost.target.id);
            },
            { root, rootMargin: "-10% 0px -75% 0px", threshold: 0 },
        );

        Object.values(ruleSectionRefs.current).forEach(
            (el) => el && observer.observe(el),
        );
        return () => observer.disconnect();
    }, [normalizedQuery]);

    return (
        <div className="story-page">
            <button className="back-btn" onClick={onBack}>
                <ArrowLeft size={16} strokeWidth={2.5} />
                Showcase
            </button>

            <div className="story-jump">
                <button
                    className="story-jump-chip"
                    onClick={() => scrollTo(loreRef)}
                >
                    <BookOpen size={14} strokeWidth={2.2} />
                    <span>Cốt truyện</span>
                </button>
                <button
                    className="story-jump-chip"
                    onClick={() => scrollTo(rulesRef)}
                >
                    <ScrollText size={14} strokeWidth={2.2} />
                    <span>Luật chơi</span>
                </button>
            </div>

            <div className="story-scroll" ref={scrollRootRef}>
                {/* ===================== CỐT TRUYỆN (tóm tắt mở đầu) ===================== */}
                <section ref={loreRef} className="story-section story-intro">
                    <SectionHead
                        icon={BookOpen}
                        // kicker="Tóm tắt cốt truyện"
                        title="Tóm tắt cốt truyện"
                    />

                    <p className="story-lead">{STORY.intro}</p>

                    <div className="story-lore">
                        {STORY.lore.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>

                    <DossierFrame
                        fig="HỒ SƠ"
                        title="Vai trò của bạn"
                        className="story-role"
                    >
                        <p>{STORY.role}</p>
                    </DossierFrame>

                    {onOpenLore && (
                        <div className="story-lore-cta-wrap">
                            <button
                                type="button"
                                className="story-lore-cta"
                                onClick={onOpenLore}
                            >
                                <History size={16} strokeWidth={2.2} />
                                Xem cốt truyện chi tiết
                                <ArrowRight size={14} strokeWidth={2.4} />
                            </button>
                        </div>
                    )}
                </section>

                {/* ============================== LUẬT CHƠI ============================== */}
                <section ref={rulesRef} className="story-section rules-section">
                    <SectionHead
                        icon={ScrollText}
                        // kicker="Luật chơi"
                        title="Luật Chơi"
                    />

                    <nav className="rules-toc" aria-label="Mục lục luật chơi">
                        {RULES_TOC.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                className={`rules-toc-item${
                                    !matchIds && activeRuleId === id
                                        ? " is-active"
                                        : ""
                                }`}
                                onClick={() => scrollToRule(id)}
                            >
                                <Icon size={13} strokeWidth={2.2} />
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="rules-toolbar">
                        <div
                            className="rules-progress"
                            role="status"
                            aria-label={`${viewedIds.size}/${RULE_IDS.length} mục đã xem`}
                        >
                            <span
                                className="rules-progress-dots"
                                aria-hidden="true"
                            >
                                {RULES_TOC.map(({ id }) => (
                                    <span
                                        key={id}
                                        className={`rules-progress-dot${
                                            viewedIds.has(id)
                                                ? " is-viewed"
                                                : ""
                                        }`}
                                        style={
                                            RULE_ACCENT[id]
                                                ? {
                                                      "--dot-accent":
                                                          RULE_ACCENT[id],
                                                  }
                                                : undefined
                                        }
                                    />
                                ))}
                            </span>
                            <span
                                className="rules-progress-text"
                                aria-hidden="true"
                            >
                                {viewedIds.size}/{RULE_IDS.length}
                            </span>
                        </div>
                        <div className="rules-search">
                            <Search size={14} strokeWidth={2.2} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Tìm trong luật chơi... (/)"
                                aria-label="Tìm trong luật chơi"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    aria-label="Xoá tìm kiếm"
                                >
                                    <X size={14} strokeWidth={2.4} />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            className="rules-expand-all"
                            onClick={allOpen ? collapseAll : expandAll}
                        >
                            {allOpen ? "Thu gọn tất cả" : "Mở tất cả"}
                        </button>
                    </div>

                    {matchIds && matchIds.length === 0 ? (
                        <p className="rules-search-empty">
                            Không tìm thấy mục luật nào khớp với “{query.trim()}
                            ”.
                        </p>
                    ) : (
                        <div className="rules-list">
                            {isRuleVisible("objective") && (
                                <RuleBlock
                                    id="objective"
                                    icon={Target}
                                    title="Mục tiêu"
                                    highlight
                                    open={isRuleOpen("objective")}
                                    onToggle={toggleRule}
                                    onRegister={registerRuleRef}
                                >
                                    <ul className="rule-list">
                                        <li>{OBJECTIVE.win}</li>
                                        <li>{OBJECTIVE.lose}</li>
                                    </ul>
                                </RuleBlock>
                            )}

                            {isRuleVisible("prep") && (
                                <RuleBlock
                                    id="prep"
                                    icon={Dices}
                                    title="Chuẩn bị trước khi chơi"
                                    summary="3-4 người chơi, xúc xắc 20 mặt và các bộ bài/token cần thiết."
                                    open={isRuleOpen("prep")}
                                    onToggle={toggleRule}
                                    onRegister={registerRuleRef}
                                >
                                    <p className="rule-text">
                                        {PREP.players} Cần có: {PREP.dice}, các
                                        bộ Token ({PREP.tokens.join(", ")}) và{" "}
                                        {PREP.board.toLowerCase()}
                                    </p>
                                    <div className="deck-chip-row">
                                        {PREP.deckList.map((name) => (
                                            <span
                                                className="deck-chip deck-chip--plain"
                                                key={name}
                                            >
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </RuleBlock>
                            )}

                            {isRuleVisible("setup") && (
                                <RuleBlock
                                    id="setup"
                                    icon={Play}
                                    title="Mở đầu"
                                    summary="Chọn Hero khởi đầu và rút 1 lá Trang bị."
                                    open={isRuleOpen("setup")}
                                    onToggle={toggleRule}
                                    onRegister={registerRuleRef}
                                >
                                    <ol className="rule-list rule-list--num">
                                        {SETUP_STEPS.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ol>
                                </RuleBlock>
                            )}

                            {isRuleVisible("turns") && (
                                <RuleBlock
                                    id="turns"
                                    icon={RotateCw}
                                    title="Lượt & vòng chơi"
                                    summary="Mỗi lượt rút 1 lá Thám hiểm và thực hiện yêu cầu ghi trên lá."
                                    open={isRuleOpen("turns")}
                                    onToggle={toggleRule}
                                    onRegister={registerRuleRef}
                                >
                                    <ol className="rule-list rule-list--num">
                                        {TURN_FLOW.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ol>
                                    <p className="rule-text rule-text--muted">
                                        {ROUND_NOTE}
                                    </p>
                                </RuleBlock>
                            )}

                            {isRuleVisible("formation") && (
                                <RuleBlock
                                    id="formation"
                                    icon={Users}
                                    title="Sắp xếp đội hình"
                                    summary="Tối đa 4 Hero, chia Đội thực địa và Đội hậu cần."
                                    open={isRuleOpen("formation")}
                                    onToggle={toggleRule}
                                    onRegister={registerRuleRef}
                                >
                                    <p className="rule-text">
                                        {FORMATION_INTRO}
                                    </p>

                                    <DossierFrame
                                        fig="FIG. 03"
                                        title="Đội hình — giới hạn & tràn ô"
                                    >
                                        <span className="formation-subhead">
                                            Giới hạn hoán đổi mỗi vòng
                                        </span>
                                        <div className="formation-swap-list">
                                            {FORMATION_SWAPS.map((s) => (
                                                <div
                                                    className="formation-swap"
                                                    key={s.label}
                                                >
                                                    <span>{s.label}</span>
                                                    <span className="formation-swap-limit">
                                                        {s.limit}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <span className="formation-subhead">
                                            Khi đã đầy, rút thêm thì sao?
                                        </span>
                                        <div className="formation-overflow-table">
                                            {FORMATION_OVERFLOW.map((f) => (
                                                <div
                                                    className="formation-overflow-row"
                                                    key={f.subject}
                                                >
                                                    <span className="formation-overflow-subject">
                                                        {f.subject}
                                                        <small>{f.limit}</small>
                                                    </span>
                                                    <span className="formation-overflow-rule">
                                                        {f.rule}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </DossierFrame>
                                </RuleBlock>
                            )}

                            {isRuleVisible("cards") && (
                                <RuleBlock
                                    id="cards"
                                    icon={Layers}
                                    title="Giải thích về các lá bài"
                                    summary="6 loại lá bài: Hero, Thám hiểm, Trang bị, Phát triển, Chiến lược..."
                                    open={isRuleOpen("cards")}
                                    onToggle={toggleRule}
                                    onRegister={registerRuleRef}
                                >
                                    {ANATOMY_CARD && (
                                        <DossierFrame
                                            fig="FIG. 01"
                                            title="Cách đọc 1 lá bài"
                                            className="card-anatomy"
                                        >
                                            <div className="card-anatomy-body">
                                                <div className="card-anatomy-frame">
                                                    <img
                                                        src={ANATOMY_CARD.image}
                                                        alt={ANATOMY_CARD.name}
                                                    />
                                                    {CARD_ANATOMY.legend.map(
                                                        (l) => (
                                                            <span
                                                                className="card-anatomy-pin"
                                                                key={l.n}
                                                                style={{
                                                                    top: `${l.top}%`,
                                                                    left: `${l.left}%`,
                                                                }}
                                                            >
                                                                {l.n}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                                <ol className="card-anatomy-legend">
                                                    {CARD_ANATOMY.legend.map(
                                                        (l) => (
                                                            <li key={l.n}>
                                                                <span className="card-anatomy-legend-num">
                                                                    {l.n}
                                                                </span>
                                                                <span>
                                                                    <strong>
                                                                        {
                                                                            l.label
                                                                        }
                                                                    </strong>{" "}
                                                                    — {l.desc}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ol>
                                            </div>
                                        </DossierFrame>
                                    )}

                                    <div className="card-type-list">
                                        {CARD_TYPES.map((t) => (
                                            <CardTypeEntry
                                                key={t.key}
                                                type={t}
                                                onViewDeck={onViewDeck}
                                            />
                                        ))}
                                    </div>
                                </RuleBlock>
                            )}

                            {isRuleVisible("combat") && (
                                <RuleBlock
                                    id="combat"
                                    icon={Swords}
                                    title="Cơ chế chiến đấu"
                                    summary="5 hiệp đấu theo thứ tự VIT → CTR → STR → INT → LUK."
                                    badge="Cốt lõi"
                                    open={isRuleOpen("combat")}
                                    onToggle={toggleRule}
                                    onRegister={registerRuleRef}
                                >
                                    <div className="combat-order">
                                        {COMBAT.order.map((label, i) => {
                                            const Ico = COMBAT_ICON[label];
                                            return (
                                                <span
                                                    className="combat-order-step"
                                                    key={label}
                                                >
                                                    <Ico
                                                        size={15}
                                                        strokeWidth={2.2}
                                                    />
                                                    {label}
                                                    {i <
                                                        COMBAT.order.length -
                                                            1 && (
                                                        <span className="combat-order-arrow">
                                                            →
                                                        </span>
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <p className="rule-text">{COMBAT.rule}</p>
                                    <ul className="rule-list">
                                        {COMBAT.tie.map((t, i) => (
                                            <li key={i}>{t}</li>
                                        ))}
                                    </ul>
                                    <p className="rule-text rule-text--muted">
                                        {COMBAT.scoring}
                                    </p>
                                    <DossierFrame
                                        fig="FIG. 02"
                                        title="Ví dụ minh hoạ"
                                        className="combat-example"
                                    >
                                        <div className="combat-table-wrap">
                                            <table className="combat-table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" />
                                                        {COMBAT.order.map(
                                                            (label) => (
                                                                <th
                                                                    scope="col"
                                                                    key={label}
                                                                >
                                                                    {label}
                                                                </th>
                                                            ),
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        COMBAT.example.teamA,
                                                        COMBAT.example.teamB,
                                                    ].map((team, ti) => {
                                                        const other =
                                                            ti === 0
                                                                ? COMBAT.example
                                                                      .teamB
                                                                : COMBAT.example
                                                                      .teamA;
                                                        return (
                                                            <tr
                                                                key={team.label}
                                                            >
                                                                <th scope="row">
                                                                    {team.label}
                                                                </th>
                                                                {team.powers.map(
                                                                    (v, i) => (
                                                                        <td
                                                                            key={
                                                                                COMBAT
                                                                                    .order[
                                                                                    i
                                                                                ]
                                                                            }
                                                                            className={
                                                                                v >
                                                                                other
                                                                                    .powers[
                                                                                    i
                                                                                ]
                                                                                    ? "is-win"
                                                                                    : v ===
                                                                                        other
                                                                                            .powers[
                                                                                            i
                                                                                        ]
                                                                                      ? "is-tie"
                                                                                      : undefined
                                                                            }
                                                                        >
                                                                            <span className="combat-cell">
                                                                                <span
                                                                                    className="combat-cell-bar"
                                                                                    style={{
                                                                                        "--bar-pct": `${Math.round(
                                                                                            (v /
                                                                                                COMBAT_MAX) *
                                                                                                100,
                                                                                        )}%`,
                                                                                    }}
                                                                                />
                                                                                <span className="combat-cell-value">
                                                                                    {
                                                                                        v
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                        </td>
                                                                    ),
                                                                )}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="combat-example-result">
                                            {COMBAT.example.result}
                                        </p>
                                    </DossierFrame>
                                </RuleBlock>
                            )}

                            {isRuleVisible("penalties") && (
                                <RuleBlock
                                    id="penalties"
                                    icon={Skull}
                                    title="Hình phạt khi thua trận"
                                    summary="6 dạng hình phạt, từ mất Trang bị tới bị Hạ gục."
                                    open={isRuleOpen("penalties")}
                                    onToggle={toggleRule}
                                    onRegister={registerRuleRef}
                                >
                                    <div className="penalty-list">
                                        {PENALTIES.map((p) => (
                                            <div
                                                className="penalty-item"
                                                key={p.name}
                                            >
                                                <span className="penalty-name">
                                                    {p.name}
                                                </span>
                                                <p className="penalty-desc">
                                                    {p.desc}
                                                </p>
                                                {p.note && (
                                                    <p className="penalty-note">
                                                        {p.note}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </RuleBlock>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* Thay thế cho mục lục sticky (đã tắt trên mobile) — nút nổi mở
                bottom-sheet liệt kê 8 mục luật để nhảy nhanh khi đã cuộn sâu. */}
            <button
                type="button"
                className="rules-toc-fab"
                onClick={() => setMobileTocOpen(true)}
                aria-label="Mở mục lục luật chơi"
            >
                <List size={20} strokeWidth={2.2} />
            </button>

            {mobileTocOpen && (
                <div
                    className="rules-toc-sheet-backdrop"
                    onClick={() => setMobileTocOpen(false)}
                >
                    <div
                        className="rules-toc-sheet"
                        role="dialog"
                        aria-label="Mục lục luật chơi"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rules-toc-sheet-head">
                            <span>Mục lục luật chơi</span>
                            <button
                                type="button"
                                className="rules-toc-sheet-close"
                                onClick={() => setMobileTocOpen(false)}
                                aria-label="Đóng mục lục"
                            >
                                <X size={18} strokeWidth={2.4} />
                            </button>
                        </div>
                        {RULES_TOC.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                className={`rules-toc-sheet-item${
                                    !matchIds && activeRuleId === id
                                        ? " is-active"
                                        : ""
                                }`}
                                onClick={() => scrollToRule(id)}
                            >
                                <Icon size={16} strokeWidth={2.2} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
