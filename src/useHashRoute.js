import { useSyncExternalStore, useCallback } from "react";

// ---------------------------------------------------------------------------
// Điều hướng bằng hash URL — deep-link được & nút Back trình duyệt hoạt động.
//   #/                -> showcase
//   #/d/<deck>        -> showcase, lọc sẵn theo 1 deck (vd link từ Luật chơi)
//   #/c/<id>          -> hồ sơ nhân vật
//   #/c/<id>/3d       -> xem 3D
//   #/rules           -> luật chơi (kèm tóm tắt cốt truyện)
//   #/lore            -> cốt truyện chi tiết (dòng thời gian đầy đủ)
//   #/admin           -> trang quản trị ẩn (không có link trỏ tới, gõ tay URL)
// ---------------------------------------------------------------------------
function parse(hash) {
    const path = hash.replace(/^#/, "");
    if (path === "/admin") return { page: "admin", id: null, deck: null };
    if (path === "/rules") return { page: "rules", id: null, deck: null };
    if (path === "/lore") return { page: "lore", id: null, deck: null };
    const dm = path.match(/^\/d\/([^/]+)\/?$/);
    if (dm) {
        return { page: "showcase", id: null, deck: decodeURIComponent(dm[1]) };
    }
    const m = path.match(/^\/c\/([^/]+)(\/3d)?\/?$/);
    if (m) {
        return { page: m[2] ? "view3d" : "info", id: m[1], deck: null };
    }
    return { page: "showcase", id: null, deck: null };
}

export function routeToHash({ page, id, deck }) {
    if (page === "admin") return "#/admin";
    if (page === "rules") return "#/rules";
    if (page === "lore") return "#/lore";
    if (page === "showcase" && deck) return `#/d/${encodeURIComponent(deck)}`;
    if (page === "info") return `#/c/${id}`;
    if (page === "view3d") return `#/c/${id}/3d`;
    return "#/";
}

function subscribe(cb) {
    window.addEventListener("hashchange", cb);
    return () => window.removeEventListener("hashchange", cb);
}

export function useHashRoute() {
    const hash = useSyncExternalStore(
        subscribe,
        () => window.location.hash,
        () => "",
    );

    const navigate = useCallback((route) => {
        const next = routeToHash(route);
        if (window.location.hash !== next) window.location.hash = next;
    }, []);

    return [parse(hash), navigate];
}
