import { useSyncExternalStore, useCallback } from "react";

// ---------------------------------------------------------------------------
// Điều hướng bằng hash URL — deep-link được & nút Back trình duyệt hoạt động.
//   #/                -> showcase
//   #/c/<id>          -> hồ sơ nhân vật
//   #/c/<id>/3d       -> xem 3D
// ---------------------------------------------------------------------------
function parse(hash) {
    const path = hash.replace(/^#/, "");
    const m = path.match(/^\/c\/([^/]+)(\/3d)?\/?$/);
    if (m) {
        return { page: m[2] ? "view3d" : "info", id: m[1] };
    }
    return { page: "showcase", id: null };
}

export function routeToHash({ page, id }) {
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
