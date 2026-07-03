import React from "react";

// Bắt lỗi khi tải/parse model 3D để không sập cả app; hiện fallback thay thế.
export default class ModelErrorBoundary extends React.Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidUpdate(prevProps) {
        // Đổi nhân vật -> reset để thử tải lại model mới.
        if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
            this.setState({ error: null });
        }
    }

    render() {
        if (this.state.error) {
            return this.props.fallback ?? null;
        }
        return this.props.children;
    }
}
