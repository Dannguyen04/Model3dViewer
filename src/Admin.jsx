import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Copy,
    Download,
    History,
    Lock,
    Search,
} from "lucide-react";
import rawSeed from "./data.json";

// Trang quản trị ẨN — không có link nào trong UI trỏ tới, chỉ vào được bằng
// cách gõ tay #/admin lên thanh địa chỉ. Mật khẩu chỉ là lớp chắn nhẹ cho
// khách không rành kỹ thuật, KHÔNG phải bảo mật thật (chạy hoàn toàn phía
// client, không có server). Đừng dùng để chặn dữ liệu nhạy cảm.
const ADMIN_PASSWORD = "hero2026";
const SESSION_KEY = "admin_unlocked";
const DRAFT_KEY = "admin_draft_v1";

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function heroFile(i) {
    return `Untitled_Artwork ${i + 1}.webp`;
}

function heroThumb(file) {
    return encodeURI(`/character_image/${file}`);
}

function emptyProfile() {
    return {
        name: "",
        tagline: "",
        class: "",
        deck: "",
        stats: [],
        powers: [],
        bio: "",
        note: "",
    };
}

// Trộn bản nháp đã lưu (nếu có) vào khung dữ liệu gốc mới nhất — tránh vỡ
// trang nếu data.json đổi cấu trúc (thêm/bớt nhân vật) giữa 2 lần vào admin.
function loadDraft() {
    const fresh = clone(rawSeed);
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return { draft: fresh, restored: false };
    try {
        const parsed = JSON.parse(stored);
        for (const file of Object.keys(parsed.profiles ?? {})) {
            if (fresh.profiles[file]) fresh.profiles[file] = parsed.profiles[file];
        }
        (parsed.extras ?? []).forEach((e, i) => {
            if (fresh.extras[i]) fresh.extras[i] = e;
        });
        return { draft: fresh, restored: true };
    } catch {
        return { draft: fresh, restored: false };
    }
}

export default function AdminPage({ onBack }) {
    const [unlocked, setUnlocked] = useState(
        () => sessionStorage.getItem(SESSION_KEY) === "1",
    );
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState("");

    if (!unlocked) {
        return (
            <div className="admin-page admin-gate">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    Showcase
                </button>
                <form
                    className="admin-gate-card"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (pwd === ADMIN_PASSWORD) {
                            sessionStorage.setItem(SESSION_KEY, "1");
                            setUnlocked(true);
                            setError("");
                        } else {
                            setError("Sai mật khẩu.");
                        }
                    }}
                >
                    <Lock size={22} strokeWidth={2} />
                    <h2>Khu vực quản trị</h2>
                    <input
                        type="password"
                        autoFocus
                        placeholder="Mật khẩu"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                    />
                    {error && <p className="admin-gate-error">{error}</p>}
                    <button type="submit">Vào</button>
                </form>
            </div>
        );
    }

    return <AdminEditor onBack={onBack} />;
}

function AdminEditor({ onBack }) {
    const [{ draft, restored }, setState] = useState(loadDraft);
    const [copied, setCopied] = useState(false);
    const [savedAt, setSavedAt] = useState(null);
    const [query, setQuery] = useState("");

    // Tự lưu nháp vào trình duyệt sau mỗi thay đổi — refresh/đóng tab lỡ tay
    // không mất việc đang sửa dở.
    useEffect(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setSavedAt(new Date());
    }, [draft]);

    function setDraft(updater) {
        setState((s) => ({
            draft: typeof updater === "function" ? updater(s.draft) : updater,
            restored: s.restored,
        }));
    }

    function resetToOriginal() {
        if (
            !window.confirm(
                "Bỏ hết thay đổi và quay về dữ liệu gốc? Không thể hoàn tác.",
            )
        )
            return;
        localStorage.removeItem(DRAFT_KEY);
        setState({ draft: clone(rawSeed), restored: false });
    }

    const entries = useMemo(() => {
        const heroes = Array.from(
            { length: draft.characterCount },
            (_, i) => {
                const file = heroFile(i);
                return {
                    key: `hero:${file}`,
                    kind: "hero",
                    file,
                    group: "Nhân vật",
                    thumb: heroThumb(file),
                    label: draft.profiles[file]?.name ?? `Nhân vật #${i + 1}`,
                    modified:
                        JSON.stringify(draft.profiles[file]) !==
                        JSON.stringify(rawSeed.profiles[file]),
                };
            },
        );
        const extras = (draft.extras ?? []).map((e, i) => ({
            key: `extra:${i}`,
            kind: "extra",
            index: i,
            group: "Thám hiểm",
            thumb: null,
            label: e.name ?? `Thám hiểm #${i + 1}`,
            modified: JSON.stringify(e) !== JSON.stringify(rawSeed.extras?.[i]),
        }));
        return [...heroes, ...extras];
    }, [draft.characterCount, draft.profiles, draft.extras]);

    const modifiedCount = entries.filter((e) => e.modified).length;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return entries;
        return entries.filter((e) => e.label.toLowerCase().includes(q));
    }, [entries, query]);

    const [selectedKey, setSelectedKey] = useState(entries[0]?.key ?? null);
    const selected =
        entries.find((e) => e.key === selectedKey) ?? entries[0] ?? null;

    const record =
        selected?.kind === "hero"
            ? (draft.profiles[selected.file] ?? emptyProfile())
            : selected?.kind === "extra"
              ? draft.extras[selected.index]
              : null;

    function updateRecord(next) {
        setDraft((d) => {
            const copy = clone(d);
            if (selected.kind === "hero") {
                copy.profiles[selected.file] = next;
            } else {
                copy.extras[selected.index] = next;
            }
            return copy;
        });
    }

    function updateField(field, value) {
        updateRecord({ ...record, [field]: value });
    }

    function updateArrayItem(field, i, itemField, value) {
        const arr = record[field].map((it, idx) =>
            idx === i ? { ...it, [itemField]: value } : it,
        );
        updateRecord({ ...record, [field]: arr });
    }

    function exportJson() {
        const json = JSON.stringify(draft, null, 4);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    async function copyJson() {
        await navigator.clipboard.writeText(JSON.stringify(draft, null, 4));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    let lastGroup = null;

    return (
        <div className="admin-page">
            <button className="back-btn" onClick={onBack}>
                <ArrowLeft size={16} strokeWidth={2.5} />
                Showcase
            </button>

            <div className="admin-head">
                <div className="admin-head-title">
                    <h1>Chỉnh sửa dữ liệu</h1>
                    {modifiedCount > 0 && (
                        <span className="admin-badge">
                            {modifiedCount} mục đã sửa
                        </span>
                    )}
                </div>
                <div className="admin-actions">
                    <button
                        className="admin-btn"
                        onClick={resetToOriginal}
                        title="Bỏ hết thay đổi, quay về dữ liệu gốc"
                    >
                        <History size={16} strokeWidth={2} />
                        Dữ liệu gốc
                    </button>
                    <button className="admin-btn" onClick={copyJson}>
                        <Copy size={16} strokeWidth={2} />
                        {copied ? "Đã sao chép!" : "Sao chép JSON"}
                    </button>
                    <button
                        className="admin-btn admin-btn--primary"
                        onClick={exportJson}
                    >
                        <Download size={16} strokeWidth={2} />
                        Tải data.json
                    </button>
                </div>
            </div>

            <p className="admin-hint">
                Sửa xong bấm <strong>Tải data.json</strong>, gửi file này cho
                người phụ trách để thay vào <code>src/data.json</code> rồi
                deploy lại. Thay đổi ở trang này{" "}
                <strong>chưa hiện lên trang thật</strong> cho tới khi đó.
                {restored && (
                    <>
                        {" "}
                        Đã khôi phục bản nháp bạn sửa dở lần trước.
                    </>
                )}
                {savedAt && (
                    <span className="admin-hint-saved">
                        Tự lưu nháp trong trình duyệt lúc{" "}
                        {savedAt.toLocaleTimeString("vi-VN")}.
                    </span>
                )}
            </p>

            <div className="admin-body">
                <aside className="admin-list">
                    <div className="admin-search">
                        <Search size={15} strokeWidth={2} />
                        <input
                            type="search"
                            placeholder="Tìm nhân vật..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {filtered.length === 0 && (
                        <p className="admin-list-empty">
                            Không tìm thấy “{query}”.
                        </p>
                    )}

                    {filtered.map((e) => {
                        const showHeader = e.group !== lastGroup;
                        lastGroup = e.group;
                        return (
                            <div key={e.key}>
                                {showHeader && (
                                    <div className="admin-list-group">
                                        {e.group}
                                    </div>
                                )}
                                <button
                                    className={`admin-list-item${
                                        e.key === selected?.key
                                            ? " is-active"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedKey(e.key)}
                                >
                                    {e.thumb ? (
                                        <img
                                            className="admin-list-thumb"
                                            src={e.thumb}
                                            alt=""
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="admin-list-thumb admin-list-thumb--empty" />
                                    )}
                                    <span className="admin-list-label">
                                        {e.label}
                                    </span>
                                    {e.modified && (
                                        <span
                                            className="admin-list-dot"
                                            title="Đã sửa"
                                        />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </aside>

                {record && (
                    <div className="admin-form" key={selected.key}>
                        <label>
                            Tên
                            <input
                                value={record.name ?? ""}
                                onChange={(e) =>
                                    updateField("name", e.target.value)
                                }
                            />
                        </label>

                        {selected.kind === "hero" && (
                            <label>
                                Tagline
                                <input
                                    value={record.tagline ?? ""}
                                    onChange={(e) =>
                                        updateField(
                                            "tagline",
                                            e.target.value,
                                        )
                                    }
                                />
                            </label>
                        )}

                        <label>
                            Class
                            <input
                                value={record.class ?? ""}
                                onChange={(e) =>
                                    updateField("class", e.target.value)
                                }
                            />
                        </label>

                        <label>
                            Deck
                            <select
                                value={record.deck ?? ""}
                                onChange={(e) =>
                                    updateField("deck", e.target.value)
                                }
                            >
                                {Object.keys(draft.decks).map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <fieldset>
                            <legend>Thông số</legend>
                            <div className="admin-row admin-row-head">
                                <span>Icon</span>
                                <span>Nhãn</span>
                                <span>Giá trị</span>
                            </div>
                            {(record.stats ?? []).map((s, i) => (
                                <div className="admin-row" key={i}>
                                    <input
                                        className="admin-row-icon"
                                        placeholder="🎂"
                                        value={s.icon ?? ""}
                                        onChange={(e) =>
                                            updateArrayItem(
                                                "stats",
                                                i,
                                                "icon",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <input
                                        placeholder="Nhãn"
                                        value={s.label ?? ""}
                                        onChange={(e) =>
                                            updateArrayItem(
                                                "stats",
                                                i,
                                                "label",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <input
                                        placeholder="Giá trị"
                                        value={s.value ?? ""}
                                        onChange={(e) =>
                                            updateArrayItem(
                                                "stats",
                                                i,
                                                "value",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </fieldset>

                        <fieldset>
                            <legend>Chỉ số chiến đấu</legend>
                            {(record.powers ?? []).map((p, i) => (
                                <div className="admin-row admin-row--power" key={i}>
                                    <span className="admin-row-label--static">
                                        {p.label}
                                    </span>
                                    <input
                                        type="number"
                                        value={p.value ?? 0}
                                        onChange={(e) =>
                                            updateArrayItem(
                                                "powers",
                                                i,
                                                "value",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </fieldset>

                        <label>
                            Tiểu sử
                            <textarea
                                rows={4}
                                value={record.bio ?? ""}
                                onChange={(e) =>
                                    updateField("bio", e.target.value)
                                }
                            />
                        </label>

                        <label>
                            Fact / Ghi chú
                            <textarea
                                rows={2}
                                value={record.note ?? ""}
                                onChange={(e) =>
                                    updateField("note", e.target.value)
                                }
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}
