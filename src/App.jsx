import React, {
    Suspense,
    useRef,
    useState,
    useMemo,
    useEffect,
    // useCallback,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
    createXRStore,
    XR,
    useXRHitTest,
    useXRInputSourceEvent,
} from "@react-three/xr";
import {
    Environment,
    OrbitControls,
    useGLTF,
    useAnimations,
    useProgress,
    Clone,
    Center,
    Bounds,
    ContactShadows,
    Html,
} from "@react-three/drei";
import { Matrix4, Vector3 } from "three";
import {
    User,
    Calendar,
    Ruler,
    Tag,
    Lightbulb,
    Heart,
    Crosshair,
    Sword,
    Brain,
    Clover,
    Zap,
    ScanLine,
    ChevronDown,
    ArrowLeft,
    ArrowRight,
    X,
    Search,
    Box,
} from "lucide-react";
import { CHARACTERS, MODEL_URLS, accentVars, TBD } from "./data.js";
import ModelErrorBoundary from "./ErrorBoundary.jsx";
import { useHashRoute } from "./useHashRoute.js";

// Ánh xạ nhãn -> icon lucide (đồng bộ, đổi màu theo accent qua currentColor).
const STAT_ICON = { "Giới tính": User, Tuổi: Calendar, "Chiều cao": Ruler };
const POWER_ICON = {
    VIT: Heart,
    CTR: Crosshair,
    STR: Sword,
    INT: Brain,
    LUK: Clover,
};

// v6: store được tạo 1 lần ở module scope, không nằm trong component.
// emulate:false -> tắt IWER emulator (nút "Enter XR" tự chèn khi chạy localhost).
const store = createXRStore({ emulate: false });

// Preload lười: KHÔNG tải toàn bộ ~35MB khi mở trang. Chỉ preload 1 model khi
// người dùng có ý định xem (hover thẻ / vào hồ sơ), và preload phần còn lại khi
// trình duyệt rảnh.
const preloaded = new Set();
function preloadModel(url) {
    if (!url || preloaded.has(url)) return;
    preloaded.add(url);
    useGLTF.preload(url);
}
if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => MODEL_URLS.forEach(preloadModel), {
        timeout: 4000,
    });
}

// ---------------------------------------------------------------------------
// 1. Model 3D — clone an toàn (kể cả model có xương) + phát animation nếu có.
// ---------------------------------------------------------------------------
function ProductModel({ url, position = [0, 0, 0], scale = 0.5 }) {
    const group = useRef();
    const { scene, animations } = useGLTF(url);
    const { actions } = useAnimations(animations, group);

    // Phát clip animation đầu tiên (nếu model có) — idle/xoay/thở...
    useEffect(() => {
        const first = Object.values(actions)[0];
        first?.reset().fadeIn(0.3).play();
        return () => first?.fadeOut(0.2);
    }, [actions]);

    return (
        <group ref={group} position={position} scale={scale}>
            {/* Clone của drei xử lý đúng SkinnedMesh + skeleton, không như scene.clone(). */}
            <Clone object={scene} />
        </group>
    );
}

// ---------------------------------------------------------------------------
// 2. Reticle: vòng ngắm dò mặt phẳng (hit-test) trong AR.
// ---------------------------------------------------------------------------
const _matrix = new Matrix4();
const _pos = new Vector3();

function Reticle({ onPlace }) {
    const reticleRef = useRef();
    const hitPos = useRef(new Vector3());
    const isHitting = useRef(false);

    useXRHitTest((results, getWorldMatrix) => {
        if (!reticleRef.current) return;
        if (results.length === 0) {
            isHitting.current = false;
            reticleRef.current.visible = false;
            return;
        }
        getWorldMatrix(_matrix, results[0]);
        _pos.setFromMatrixPosition(_matrix);
        hitPos.current.copy(_pos);
        isHitting.current = true;
        reticleRef.current.visible = true;
        reticleRef.current.position.copy(_pos);
    }, "viewer");

    useXRInputSourceEvent(
        "all",
        "select",
        () => {
            if (isHitting.current) {
                onPlace([hitPos.current.x, hitPos.current.y, hitPos.current.z]);
            }
        },
        [onPlace],
    );

    return (
        <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
            <ringGeometry args={[0.08, 0.1, 32]} />
            <meshBasicMaterial color="white" />
        </mesh>
    );
}

// ---------------------------------------------------------------------------
// 3. Spinner khi tải model + fallback khi model lỗi.
// ---------------------------------------------------------------------------
// Nội suy mượt: giá trị hiển thị "đuổi theo" tiến độ thật mỗi khung hình, nên dù
// useProgress nhảy theo chunk mạng (0→73→100) thì ring + số vẫn chạy trơn.
function useSmoothProgress(target) {
    const [display, setDisplay] = useState(0);
    const targetRef = useRef(target);
    targetRef.current = target;
    const curRef = useRef(0);
    useEffect(() => {
        let raf;
        const tick = () => {
            const t = targetRef.current;
            curRef.current += (t - curRef.current) * 0.12;
            if (Math.abs(t - curRef.current) < 0.2) curRef.current = t;
            setDisplay(curRef.current);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);
    return display;
}

function Loader() {
    const { progress } = useProgress();
    const p = useSmoothProgress(progress);
    const R = 34;
    const CIRC = 2 * Math.PI * R;

    return (
        <Html center>
            <div className="loader">
                <div className="loader-ring-wrap">
                    <svg className="loader-ring" viewBox="0 0 80 80">
                        <circle
                            className="loader-track"
                            cx="40"
                            cy="40"
                            r={R}
                        />
                        <circle
                            className="loader-fill"
                            cx="40"
                            cy="40"
                            r={R}
                            strokeDasharray={CIRC}
                            strokeDashoffset={CIRC * (1 - p / 100)}
                        />
                    </svg>
                    <span className="loader-pct">{Math.round(p)}%</span>
                </div>
                <span className="loader-label">Đang tải nhân vật…</span>
            </div>
        </Html>
    );
}

function ModelFallback() {
    return (
        <Html center>
            <div className="model-error">
                ⚠️ Không tải được mô hình 3D.
                <br />
                Vui lòng thử lại sau.
            </div>
        </Html>
    );
}

// ---------------------------------------------------------------------------
// 4. Viewer 3D cho MỘT nhân vật. Đèn viền lấy màu accent của nhân vật đó.
// ---------------------------------------------------------------------------
function CharacterViewer({
    character,
    style,
    captureRef,
    controlsRef,
    autoRotate = true,
}) {
    const [placedPosition, setPlacedPosition] = useState(null);
    const { main, light } = character.accent;

    return (
        <Canvas
            style={style}
            camera={{ position: [0, 0.3, 1.4], fov: 40 }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
            onCreated={({ gl, scene, camera }) => {
                if (captureRef) captureRef.current = { gl, scene, camera };
            }}
        >
            <XR store={store}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 4, 2]} intensity={1} />

                {/* Đèn viền accent đặt sau lưng model để cạnh silhouette phát sáng. */}
                <pointLight
                    color={main}
                    position={[0, 0.6, -1.6]}
                    intensity={7}
                    distance={6}
                />
                <pointLight
                    color={light}
                    position={[-1.6, 0.4, -0.6]}
                    intensity={3.5}
                    distance={6}
                />
                <pointLight
                    color={main}
                    position={[1.6, 0.4, -0.6]}
                    intensity={3.5}
                    distance={6}
                />

                <ModelErrorBoundary
                    resetKey={character.id}
                    fallback={<ModelFallback />}
                >
                    <Suspense fallback={<Loader />}>
                        {!placedPosition && (
                            <>
                                <OrbitControls
                                    ref={controlsRef}
                                    makeDefault
                                    autoRotate={autoRotate}
                                    autoRotateSpeed={1.5}
                                    enableZoom={false}
                                    enablePan={false}
                                    // Giới hạn quay lên/xuống tổng 60° (±30° quanh mặt ngang)
                                    minPolarAngle={Math.PI / 2 - Math.PI / 6}
                                    maxPolarAngle={Math.PI / 2 + Math.PI / 6}
                                    // Giới hạn quay trái/phải tổng 60° (±30° quanh mặt trước)
                                    minAzimuthAngle={-Math.PI / 6}
                                    maxAzimuthAngle={Math.PI / 6}
                                />
                                {/* Bounds tự canh khung: model luôn lấp đầy sân
                                    khấu (mọi model + mọi tỉ lệ màn hình), không
                                    còn bé xíu/trôi lên đỉnh. Center bottom giữ
                                    chân model chạm đất y=0 cho bóng đổ đúng. */}
                                <Bounds fit clip margin={1.4}>
                                    <Center bottom>
                                        <ProductModel
                                            url={character.model}
                                            scale={character.scale}
                                            position={[0, 0, 0]}
                                        />
                                    </Center>
                                </Bounds>
                                <ContactShadows
                                    position={[0, 0, 0]}
                                    opacity={0.6}
                                    scale={2}
                                    blur={2}
                                    far={4}
                                />
                            </>
                        )}

                        {placedPosition && (
                            <ProductModel
                                url={character.model}
                                scale={character.scale}
                                position={placedPosition}
                            />
                        )}
                    </Suspense>
                </ModelErrorBoundary>

                {!placedPosition && <Reticle onPlace={setPlacedPosition} />}
            </XR>
        </Canvas>
    );
}

// ---------------------------------------------------------------------------
// 5. SHOWCASE — trang chính: lưới thẻ nhân vật, bấm để xem hồ sơ.
// ---------------------------------------------------------------------------
function CharacterCard({ character, onSelect, index }) {
    const innerRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    // Nghiêng thẻ theo vị trí con trỏ (parallax 3D). Ghi thẳng vào style để mượt,
    // không gây re-render.
    const handleMove = (e) => {
        const inner = innerRef.current;
        if (!inner) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        const ry = px * 18; // xoay quanh trục Y theo hoành độ
        const rx = -py * 22; // xoay quanh trục X theo tung độ
        inner.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
        // toạ độ con trỏ cho vệt sáng loang theo tay
        inner.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
        inner.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    };

    const handleLeave = () => {
        const inner = innerRef.current;
        if (inner) inner.style.transform = "";
    };

    return (
        <button
            className="tcard"
            style={{
                ...accentVars(character),
                animationDelay: `${Math.min(index, 12) * 0.05}s`,
            }}
            onClick={() => onSelect(character.id)}
            // Preload model của nhân vật ngay khi rê chuột vào -> 3D mở tức thì.
            onMouseEnter={() => preloadModel(character.model)}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            <div className="tcard-inner" ref={innerRef}>
                <span className="tcard-glare" />
                <span className="tcard-deck">{character.deck}</span>
                {character.model && (
                    <span className="tcard-badge">
                        <Box size={11} strokeWidth={2.5} />
                        3D
                    </span>
                )}

                <div className={`tcard-art${loaded ? " is-loaded" : ""}`}>
                    <img
                        src={character.image}
                        alt={character.name}
                        loading="lazy"
                        fetchPriority={index === 0 ? "high" : "auto"}
                        onLoad={() => setLoaded(true)}
                    />
                </div>

                <div className="tcard-info">
                    <h2 className="tcard-name">{character.name}</h2>
                    {/* Tagline mặc định lấy từ Class -> chỉ hiện khi thật sự
                        khác Class, tránh in trùng chữ ngay trên chip bên dưới. */}
                    {character.tagline !== character.charClass && (
                        <p className="tcard-tag">{character.tagline}</p>
                    )}
                    {character.charClass && character.charClass !== TBD && (
                        <span className="tcard-class">
                            <Tag size={11} strokeWidth={2} />
                            {character.charClass}
                        </span>
                    )}
                </div>

                <span className="tcard-shine" />
            </div>
        </button>
    );
}

function ShowcasePage({ characters, onSelect }) {
    const [deck, setDeck] = useState("ALL");
    const [query, setQuery] = useState("");
    const searchRef = useRef(null);

    // "/" focus ô tìm kiếm nhanh (không kích hoạt khi đang gõ trong input).
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "/" && document.activeElement !== searchRef.current) {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Danh sách deck (giữ thứ tự xuất hiện) + màu đại diện mỗi deck.
    const decks = ["ALL", ...new Set(characters.map((c) => c.deck))];
    const deckColor = Object.fromEntries(
        characters.map((c) => [c.deck, c.accent.main]),
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return characters.filter((c) => {
            const okDeck = deck === "ALL" || c.deck === deck;
            const okQuery =
                !q ||
                c.name.toLowerCase().includes(q) ||
                c.tagline.toLowerCase().includes(q);
            return okDeck && okQuery;
        });
    }, [characters, deck, query]);

    return (
        <div className="showcase">
            <header className="showcase-head">
                <img
                    className="showcase-logo"
                    src="/logo.png"
                    alt="Hero Collector"
                />
                <h1 className="showcase-title">Bộ Sưu Tập Nhân Vật</h1>
            </header>

            <div className="showcase-controls">
                {/* Cả bộ hiện chỉ có deck HERO -> tab lọc chỉ còn "TẤT CẢ" + "HERO",
                    không lọc được gì nên ẩn đi. Thêm deck khác là tab tự hiện lại. */}
                {decks.length > 2 && (
                    <div className="deck-tabs">
                        {decks.map((d) => (
                            <button
                                key={d}
                                className={`deck-tab${d === deck ? " active" : ""}`}
                                style={
                                    d === "ALL"
                                        ? undefined
                                        : { "--tab": deckColor[d] }
                                }
                                onClick={() => setDeck(d)}
                            >
                                {d === "ALL" ? "TẤT CẢ" : d}
                            </button>
                        ))}
                    </div>
                )}

                <div className="showcase-tools">
                    <span className="showcase-count">
                        {filtered.length}
                        <em>/{characters.length}</em> nhân vật
                    </span>

                    <div className="search-box">
                        <Search
                            className="search-ico"
                            size={16}
                            strokeWidth={2}
                        />
                        <input
                            ref={searchRef}
                            type="search"
                            className="search-input"
                            placeholder="Tìm nhân vật..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="showcase-empty">
                    Không tìm thấy nhân vật nào khớp “{query}”.
                </p>
            ) : (
                <div className="showcase-grid">
                    {filtered.map((c, i) => (
                        <CharacterCard
                            key={c.id}
                            character={c}
                            index={i}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}

            <QrCodeSection src="/qrcodes/home.png" alt="QR trang chủ" />
        </div>
    );
}

// ---------------------------------------------------------------------------
// 6. Component dùng chung: danh sách chỉ số (stats).
// ---------------------------------------------------------------------------
function StatList({ stats, variant = "info" }) {
    if (variant === "v3d") {
        return (
            <div className="v3d-stats">
                {stats.map((s) => {
                    const Ico = STAT_ICON[s.label] || Tag;
                    return (
                        <div className="v3d-stat" key={s.label}>
                            <span className="v3d-stat-ico">
                                <Ico size={16} strokeWidth={2} />
                            </span>
                            <span className="v3d-stat-label">{s.label}</span>
                            <span className="v3d-stat-val">{s.value}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
    return (
        <div className="stat-list">
            {stats.map((s) => {
                const Ico = STAT_ICON[s.label] || Tag;
                return (
                    <div className="stat-row" key={s.label}>
                        <span className="stat-icon">
                            <Ico size={18} strokeWidth={2} />
                        </span>
                        <span className="stat-label">{s.label}</span>
                        <span className="stat-value">{s.value}</span>
                    </div>
                );
            })}
        </div>
    );
}

// 5 chỉ số chiến đấu (VIT/CTR/STR/INT/LUK) dạng thanh bar, thang 0–POWER_MAX.
const POWER_MAX = 10;

function PowerBars({ powers, variant = "info", showTitle = true }) {
    const total = powers.reduce((sum, p) => sum + p.value, 0);
    return (
        <div
            className={`power-bars${variant === "v3d" ? " power-bars--v3d" : ""}`}
        >
            {showTitle && <span className="power-title">Chỉ số</span>}
            {powers.map((p) => {
                const Ico = POWER_ICON[p.label] || Zap;
                const pct = Math.max(
                    0,
                    Math.min(100, (p.value / POWER_MAX) * 100),
                );
                return (
                    <div className="power-row" key={p.label}>
                        <span className="power-label">
                            <Ico
                                className="power-ico"
                                size={15}
                                strokeWidth={2}
                            />
                            {p.label}
                        </span>
                        <span className="power-track">
                            <span
                                className="power-fill"
                                style={{ width: `${pct}%` }}
                            />
                        </span>
                        <span className="power-num">{p.value}</span>
                    </div>
                );
            })}
            <div className="power-total">
                <span className="power-total-k">Total</span>
                <span className="power-total-v">
                    {total}
                    <em>/{powers.length * POWER_MAX}</em>
                </span>
            </div>
        </div>
    );
}

// Khối gập/mở (accordion) — dùng ở panel trang 3D để mặc định thu gọn, nhường
// tối đa diện tích cho Canvas. Body dùng grid 0fr→1fr để trượt mượt.
function Accordion({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className={`acc${open ? " is-open" : ""}`}>
            <button
                type="button"
                className="acc-head"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                <span className="acc-title">{title}</span>
                <ChevronDown
                    className="acc-chevron"
                    size={18}
                    strokeWidth={2.5}
                    aria-hidden="true"
                />
            </button>
            <div className="acc-body">
                <div className="acc-body-inner">{children}</div>
            </div>
        </div>
    );
}

function NoteCallout({ children, label = "Fact", onClick }) {
    const interactive = typeof onClick === "function";
    const activate = interactive
        ? (e) => {
              if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ")
                  return;
              e.preventDefault();
              onClick();
          }
        : undefined;
    return (
        <div
            className={`note-callout${interactive ? " is-interactive" : ""}`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onClick={activate}
            onKeyDown={activate}
        >
            <span className="note-icon">
                <Lightbulb size={18} strokeWidth={2} />
            </span>
            <div className="note-body">
                <span className="note-label">{label}</span>
                <p>{children}</p>
            </div>
            {interactive && (
                <span className="note-more">
                    Xem thêm
                    <ArrowRight size={13} strokeWidth={2.5} />
                </span>
            )}
        </div>
    );
}

function QrCodeSection({ src, alt }) {
    return (
        <div className="qr-section">
            <img className="qr-image" src={src} alt={alt} loading="lazy" />
        </div>
    );
}

// Popup nhỏ hiển thị chi tiết Fact — làm rõ đây là điểm chạm tương tác,
// không phải nút "chết".
function FactModal({ title, label = "Fact", children, onClose }) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-head">
                    <span className="modal-label">
                        <Lightbulb size={15} strokeWidth={2} />
                        {label}
                    </span>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>
                {title && <h3 className="modal-title">{title}</h3>}
                <p className="modal-body">{children}</p>
            </div>
        </div>
    );
}

// Tiểu sử là khối duy nhất co được nên nó có thể bị cắt bớt để hồ sơ vừa 1 màn
// hình. Đo trực tiếp DOM (thay vì đoán theo độ dài chuỗi) để chỉ báo "Xem thêm"
// + làm mờ đáy khi CHỮ THẬT SỰ bị cắt — cùng một tiểu sử có thể vừa đủ trên màn
// hình cao mà lại tràn trên màn hình thấp.
function useIsTruncated(ref, deps) {
    const [truncated, setTruncated] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const check = () => setTruncated(el.scrollHeight - el.clientHeight > 2);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return truncated;
}

function InfoPage({ character, onView3D, onBack }) {
    // Vào hồ sơ -> preload model để bấm "3D View" mở tức thì.
    useEffect(() => preloadModel(character.model), [character.model]);
    const [modal, setModal] = useState(null); // "bio" | "fact" | null
    const bioRef = useRef(null);
    const bioLong = useIsTruncated(bioRef, [character.bio]);

    // Gom Class + Giới tính/Tuổi/Chiều cao thành 1 "spec grid" gọn, dễ quét mắt.
    const specs = [
        { Ico: Tag, label: "Class", value: character.charClass },
        ...character.stats.map((s) => ({
            Ico: STAT_ICON[s.label] || Tag,
            label: s.label,
            value: s.value,
        })),
    ];

    return (
        <div className="info-page" style={accentVars(character)}>
            <button className="back-btn" onClick={onBack}>
                <ArrowLeft size={16} strokeWidth={2.5} />
                Showcase
            </button>

            <div className="info-image-wrap">
                <img
                    className="info-image"
                    src={character.image}
                    alt={character.name}
                />
            </div>

            <div className="info-panel">
                <div className="info-head">
                    <span className="char-deck">{character.deck} DECK</span>
                    <div className="info-head-row">
                        <h1 className="char-name">{character.name}</h1>
                        <img
                            className="info-qr"
                            src={`/qrcodes/${character.id}.png`}
                            alt={`QR ${character.name}`}
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* CTA ngay dưới tiêu đề (desktop) / ghim đáy màn hình (mobile)
                    -> không bị "chôn" dưới thông số + tiểu sử. */}
                <div className="info-actions">
                    {character.model ? (
                        <button className="view3d-btn" onClick={onView3D}>
                            <Box size={18} strokeWidth={2.2} />
                            Xem mô hình 3D
                        </button>
                    ) : (
                        <span className="view3d-soon">Mô hình 3D sắp có</span>
                    )}
                </div>

                <div className="spec-grid">
                    {specs.map(({ Ico, label, value }) => (
                        <div className="spec-cell" key={label}>
                            <span className="spec-ico">
                                <Ico size={18} strokeWidth={2} />
                            </span>
                            <span className="spec-text">
                                <span className="spec-k">{label}</span>
                                <span
                                    className={`spec-v${value === TBD || value === "—" ? " is-tbd" : ""}`}
                                >
                                    {value}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>

                <PowerBars powers={character.powers} />

                <div
                    className={`bio-card${bioLong ? " is-truncated" : ""}`}
                    role={bioLong ? "button" : undefined}
                    tabIndex={bioLong ? 0 : undefined}
                    onClick={bioLong ? () => setModal("bio") : undefined}
                    onKeyDown={
                        bioLong
                            ? (e) => {
                                  if (e.key !== "Enter" && e.key !== " ") return;
                                  e.preventDefault();
                                  setModal("bio");
                              }
                            : undefined
                    }
                >
                    {/* "Xem thêm" nằm cùng hàng nhãn: không bị cắt khi thẻ co lại
                        trên màn hình thấp, và tiết kiệm một dòng chiều cao. */}
                    <div className="bio-head">
                        <span className="bio-label">Tiểu sử</span>
                        {bioLong && (
                            <span className="bio-more">
                                Xem thêm
                                <ArrowRight size={13} strokeWidth={2.5} />
                            </span>
                        )}
                    </div>
                    <p ref={bioRef}>{character.bio}</p>
                </div>

                <NoteCallout onClick={() => setModal("fact")}>
                    {character.note}
                </NoteCallout>
            </div>

            {modal && (
                <FactModal
                    title={character.name}
                    label={modal === "bio" ? "Tiểu sử" : "Fact"}
                    onClose={() => setModal(null)}
                >
                    {modal === "bio" ? character.bio : character.note}
                </FactModal>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// 7. Trang XEM 3D — 1 viewer full màn hình cho nhân vật đang chọn.
// ---------------------------------------------------------------------------
function View3DPage({ character, onBack }) {
    const captureRef = useRef(null);
    const controlsRef = useRef(null);
    const [autoRotate] = useState(true);
    // Trên mobile, panel thông tin là Bottom Sheet: mặc định thu gọn (chỉ hiện
    // tiêu đề) để không che model; chạm handle để trượt lên xem chi tiết.
    const [sheetOpen, setSheetOpen] = useState(false);

    // AR chỉ khả dụng trên thiết bị hỗ trợ WebXR immersive-ar (điện thoại/headset,
    // origin bảo mật). Trên desktop -> ẩn nút để không gây hiểu nhầm.
    const [arSupported, setArSupported] = useState(false);
    useEffect(() => {
        let alive = true;
        navigator.xr
            ?.isSessionSupported?.("immersive-ar")
            .then((ok) => alive && setArSupported(!!ok))
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, []);

    // Chụp ảnh khung hình 3D hiện tại và tải về PNG.
    // const snapshot = useCallback(() => {
    //     const cap = captureRef.current;
    //     if (!cap) return;
    //     const { gl, scene, camera } = cap;
    //     gl.render(scene, camera); // vẽ lại để buffer chắc chắn còn dữ liệu
    //     const url = gl.domElement.toDataURL("image/png");
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = `${character.name.replace(/\s+/g, "_")}_3D.png`;
    //     a.click();
    // }, [character.name]);

    return (
        <div className="view3d-page" style={accentVars(character)}>
            <button className="back-btn" onClick={onBack}>
                <ArrowLeft size={16} strokeWidth={2.5} />
                Hồ sơ
            </button>
            <span className="v3d-deck">{character.deck} DECK</span>
            <span className="v3d-watermark">{character.name}</span>

            <div className="v3d-stage">
                <CharacterViewer
                    character={character}
                    captureRef={captureRef}
                    controlsRef={controlsRef}
                    autoRotate={autoRotate}
                    style={{ width: "100%", height: "100%" }}
                />

                {/* Thanh công cụ nổi: xoay tự động · đặt lại góc · chụp ảnh */}
                {/* <div className="v3d-tools">
                    <button
                        className="v3d-tool"
                        onClick={() => setAutoRotate((r) => !r)}
                        title={autoRotate ? "Tạm dừng xoay" : "Xoay tự động"}
                        aria-pressed={autoRotate}
                    >
                        {autoRotate ? (
                            <Pause size={18} strokeWidth={2} />
                        ) : (
                            <Play size={18} strokeWidth={2} />
                        )}
                    </button>
                    <button
                        className="v3d-tool"
                        onClick={() => controlsRef.current?.reset()}
                        title="Đặt lại góc nhìn"
                    >
                        <RotateCcw size={18} strokeWidth={2} />
                    </button>
                    <button
                        className="v3d-tool"
                        onClick={snapshot}
                        title="Chụp ảnh mô hình"
                    >
                        <Camera size={18} strokeWidth={2} />
                    </button>
                </div> */}
            </div>

            <aside className={`v3d-panel${sheetOpen ? " is-open" : ""}`}>
                {/* Handle chỉ hiện trên mobile (bottom sheet). */}
                <button
                    className="v3d-sheet-handle"
                    onClick={() => setSheetOpen((o) => !o)}
                    aria-expanded={sheetOpen}
                    aria-label={
                        sheetOpen ? "Thu gọn thông tin" : "Xem thông tin"
                    }
                >
                    <span className="v3d-sheet-grip" />
                    <span className="v3d-sheet-peek">
                        {character.name} ·{" "}
                        {sheetOpen ? "Thu gọn" : "Chỉ số & tiểu sử"}
                        <ChevronDown
                            className="v3d-sheet-chevron"
                            size={15}
                            strokeWidth={2.5}
                        />
                    </span>
                </button>

                <h2 className="v3d-name">{character.name}</h2>
                {character.tagline !== character.charClass && (
                    <p className="v3d-tag">{character.tagline}</p>
                )}
                <span className="char-class char-class--v3d">
                    <Tag className="char-class-ico" size={13} strokeWidth={2} />
                    {character.charClass}
                </span>

                {/* Mặc định thu gọn -> ưu tiên diện tích cho model 3D. */}
                <Accordion title="Thông số">
                    <StatList stats={character.stats} variant="v3d" />
                </Accordion>

                <Accordion title="Chỉ số">
                    <PowerBars
                        powers={character.powers}
                        variant="v3d"
                        showTitle={false}
                    />
                </Accordion>

                <Accordion title="Tiểu sử">
                    <p className="acc-text">{character.bio}</p>
                </Accordion>

                <Accordion title="Fact">
                    <p className="acc-text">{character.note}</p>
                </Accordion>

                {arSupported && (
                    <button
                        className="ar-btn"
                        onClick={() => store.enterAR()}
                        title="Đặt mô hình vào không gian thật"
                    >
                        <ScanLine size={16} strokeWidth={2} />
                        Xem trong không gian (AR)
                    </button>
                )}
            </aside>
        </div>
    );
}

// ---------------------------------------------------------------------------
// 8. App chính — điều hướng 3 tầng qua hash URL: showcase → info → view3d.
// ---------------------------------------------------------------------------
export default function App() {
    const [nav, navigate] = useHashRoute();
    const character = CHARACTERS.find((c) => c.id === nav.id) ?? CHARACTERS[0];

    // ID không hợp lệ trong URL -> đưa về showcase.
    const validId = CHARACTERS.some((c) => c.id === nav.id);
    const page = nav.page !== "showcase" && !validId ? "showcase" : nav.page;

    // Escape = quay lại một bậc.
    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== "Escape") return;
            if (page === "view3d") navigate({ page: "info", id: nav.id });
            else if (page === "info") navigate({ page: "showcase" });
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [page, nav.id, navigate]);

    return (
        <div className="app-container">
            {page === "showcase" && (
                <ShowcasePage
                    characters={CHARACTERS}
                    onSelect={(id) => navigate({ page: "info", id })}
                />
            )}

            {page === "info" && (
                <InfoPage
                    character={character}
                    onView3D={() => navigate({ page: "view3d", id: nav.id })}
                    onBack={() => navigate({ page: "showcase" })}
                />
            )}

            {page === "view3d" && (
                <View3DPage
                    character={character}
                    onBack={() => navigate({ page: "info", id: nav.id })}
                />
            )}
        </div>
    );
}
