import { useEffect, useRef } from "react";
import {
    ArrowLeft,
    BookOpen,
    Flag,
    History,
    Radiation,
    Landmark,
    Flame,
    Syringe,
    Skull,
    Swords,
    Lock,
    Radio,
    Boxes,
    Building2,
    DoorOpen,
} from "lucide-react";
import { FACTIONS, TIMELINE, PIVOT } from "./loreContent.js";

// Icon riêng theo loại sự kiện — chỉ để lướt mắt nhận ra dạng mốc (thảm hoạ,
// ám sát, chiến sự...) trên rail, không phải dữ liệu gốc từ Lore.md.
const KIND_ICON = {
    politics: Landmark,
    disaster: Flame,
    tech: Syringe,
    assassination: Skull,
    war: Swords,
    lockdown: Lock,
    discovery: Radio,
    resource: Boxes,
    founding: Building2,
    reveal: DoorOpen,
};

// Header lớn căn giữa — cùng khuôn với SectionHead trong StoryPage.jsx (icon +
// kicker + tiêu đề), duplicate ở đây vì StoryPage không export component nội bộ.
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

// Khung "sổ tay trinh sát" — bản sao của DossierFrame trong StoryPage.jsx
// (4 vệt góc + nhãn "FIG. xx"), dùng cho khối "5 thế lực" để cùng 1 ngôn ngữ
// hình ảnh với trang Luật chơi.
function DossierFrame({ fig, title, children }) {
    return (
        <div className="dossier-frame">
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

function LoreNode({ marker, kind, paragraphs, quote }) {
    const Icon = KIND_ICON[kind];
    const isEmpty = paragraphs.length === 0;
    return (
        <li className={`lore-node${isEmpty ? " is-placeholder" : ""}`}>
            <span className="lore-node-dot">
                {Icon && <Icon size={11} strokeWidth={2.4} />}
            </span>
            <div className="lore-node-body">
                <span className="lore-node-marker">{marker}</span>
                {isEmpty ? (
                    <p className="lore-node-tbd">Nội dung đang được bổ sung…</p>
                ) : (
                    paragraphs.map((p, i) => <p key={i}>{p}</p>)
                )}
                {quote && <p className="lore-pull-quote">{quote}</p>}
            </div>
        </li>
    );
}

// Khối "chương ngắt" cho mốc Tái sáng thế — điểm bản lề giữa 2 kỷ nguyên, tách
// hẳn khỏi rail thành 1 khối full-width riêng thay vì chỉ là 1 dòng to hơn.
function LoreChapterBreak({ marker, paragraphs, quote }) {
    return (
        <div className="lore-chapter-break">
            <span className="lore-chapter-glow" aria-hidden="true" />
            <Radiation
                className="lore-chapter-icon"
                size={30}
                strokeWidth={1.8}
            />
            <span className="lore-chapter-marker">{marker}</span>
            <div className="lore-chapter-body">
                {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                ))}
            </div>
            {quote && (
                <p className="lore-pull-quote lore-pull-quote--chapter">
                    {quote}
                </p>
            )}
        </div>
    );
}

const [PRE_ERA, POST_ERA] = TIMELINE;

export default function LorePage({ onBack }) {
    const containerRef = useRef(null);

    // Scroll-reveal: mỗi mốc mờ/trượt vào khi cuộn tới thay vì hiện sẵn hết —
    // cảm giác "khám phá hồ sơ" thay vì đọc 1 trang văn bản dài. Dùng 1
    // IntersectionObserver chung, unobserve ngay sau khi hiện để không tốn
    // công theo dõi lại các mốc đã đọc qua.
    useEffect(() => {
        const targets = containerRef.current?.querySelectorAll(
            ".lore-node, .lore-chapter-break",
        );
        if (!targets || targets.length === 0) return;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );

        targets.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <div className="story-page">
            <button className="back-btn" onClick={onBack}>
                <ArrowLeft size={16} strokeWidth={2.5} />
                Luật chơi
            </button>

            <div className="story-scroll" ref={containerRef}>
                <section className="story-section">
                    <SectionHead
                        icon={BookOpen}
                        kicker="Hồ sơ lưu trữ"
                        title="Cốt Truyện Chi Tiết"
                    />

                    <p className="story-lead">
                        Toàn bộ dòng thời gian dẫn tới sự kiện Tái sáng thế —
                        từ những năm cuối cùng của nền văn minh cũ tới 100 năm
                        đầu tiên của tân nhân loại trong các khu trú ẩn.
                    </p>

                    <div className="lore-factions">
                        <DossierFrame
                            fig="HỒ SƠ"
                            title="5 thế lực còn trụ lại"
                        >
                            <div className="lore-faction-grid">
                                {FACTIONS.map((f) => (
                                    <div
                                        className="lore-faction-chip"
                                        key={f.id}
                                    >
                                        <Flag size={12} strokeWidth={2.2} />
                                        {f.name}
                                    </div>
                                ))}
                            </div>
                        </DossierFrame>
                    </div>

                    <div className="lore-timeline">
                        <div className="lore-era lore-era--pre">
                            <h3 className="lore-era-title">
                                <History size={19} strokeWidth={2.2} />
                                {PRE_ERA.era}
                            </h3>
                            <ol className="lore-rail">
                                {PRE_ERA.entries.map((entry, i) => (
                                    <LoreNode
                                        key={`${entry.marker}-${i}`}
                                        marker={entry.marker}
                                        kind={entry.kind}
                                        paragraphs={entry.paragraphs}
                                        quote={entry.quote}
                                    />
                                ))}
                            </ol>
                        </div>

                        <LoreChapterBreak
                            marker={PIVOT.marker}
                            paragraphs={PIVOT.paragraphs}
                            quote={PIVOT.quote}
                        />

                        <div className="lore-era lore-era--post">
                            <h3 className="lore-era-title">
                                <History size={19} strokeWidth={2.2} />
                                {POST_ERA.era}
                            </h3>
                            <ol className="lore-rail">
                                {POST_ERA.entries.map((entry, i) => (
                                    <LoreNode
                                        key={`${entry.marker}-${i}`}
                                        marker={entry.marker}
                                        kind={entry.kind}
                                        paragraphs={entry.paragraphs}
                                        quote={entry.quote}
                                    />
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
