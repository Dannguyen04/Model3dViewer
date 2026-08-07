// ---------------------------------------------------------------------------
// NỘI DUNG CỐT TRUYỆN & LUẬT CHƠI — trích từ "Hero Collector.md" do khách cấp.
// Tách khỏi StoryPage.jsx để sửa/bổ sung text không phải đụng vào JSX.
// Lỗi chính tả/ngữ pháp nhỏ trong bản gốc đã được nắn lại cho rõ nghĩa, không
// đổi nội dung.
// ---------------------------------------------------------------------------

export const STORY = {
    intro: "Hero Collector là board-game xây dựng đội hình, chiến đấu và đưa ra quyết định. Ý tưởng hình thành dựa trên giả định về việc sử dụng vũ khí hoá học trong chiến tranh gây ra những biến đổi về gen của các sinh vật và sự ô nhiễm môi trường — nhằm cảnh tỉnh con người.",
    lore: [
        "Ở một tương lai giả định, chiến tranh hoá học đã xảy ra, đẩy loài người vào các vùng đất an toàn còn lại trên thế giới, trong khi đa số lãnh thổ biến thành đất hoang với nhiều sinh vật biến dị.",
        "Sau 100 năm, để giúp con người có thể tồn tại, Quân đoàn trinh sát, tìm kiếm và bảo vệ tài nguyên (Resource Reconnaissance, Search and Protection Corps) — hay thường được gọi là Quân trinh sát — đã được thành lập.",
        "Mục tiêu của Quân trinh sát là tìm kiếm và sử dụng các nguồn tài nguyên còn sót lại từ vùng đất hoang bị tàn phá đầy khí độc ngoài kia, đồng thời tìm ra 3 chiếc chìa khoá được cất giấu nhằm mở ra một hầm trú ẩn được cho là đang chứa thứ có thể cứu lấy nhân loại.",
        "Mặc dù cùng một tổ chức, nhưng vì bị chia cắt ở các vùng lãnh thổ khác nhau nên thực tế các nhánh không được liên kết, gây ra nhiều mâu thuẫn nội bộ.",
    ],
    role: "Vai trò của người chơi là một tổ trưởng — bạn phải đưa quân của mình đi trinh thám nhằm tìm kiếm tài nguyên. Hãy đưa ra các lựa chọn chính xác để có thể tiếp tục tồn tại và cứu lấy nhân loại.",
};

// -- Cột trái: trình tự chơi (chuẩn bị -> mục tiêu -> lượt chơi -> đội hình) --

export const PREP = {
    players: "3 đến 4 người chơi.",
    dice: "Xúc xắc 20 mặt.",
    // Chỉ là danh sách "trong hộp có gì" — không tô màu deck ở đây, để màu
    // dành cho phần Giải thích lá bài, nơi màu thực sự giúp phân biệt.
    deckList: [
        "Hero",
        "Thám hiểm 1",
        "Thám hiểm 2",
        "Thám hiểm 3",
        "Trang bị",
        "Trang bị đặc biệt",
        "Phát triển",
        "Phát triển đặc biệt",
        "Phát triển bất lợi",
        "Chiến lược",
    ],
    tokens: ["Token vô hiệu hoá", "Token hạn chế", "Token chìa khoá"],
    board: "Bàn cơ (không bắt buộc).",
};

export const OBJECTIVE = {
    win: "Thu thập đủ 3 Token chìa khoá, hoặc tiêu diệt toàn bộ [Hero] mà người chơi khác đang sở hữu.",
    lose: "Người chơi bị xem là thua cuộc khi số lượng [Hero] trong đội hình bằng 0.",
};

export const SETUP_STEPS = [
    "Mỗi người chơi lần lượt rút 3 lá từ bộ bài [Hero], chọn cho mình 1 [Hero] trong 3 lá.",
    "Rút thêm 1 lá [Trang bị].",
];

export const TURN_FLOW = [
    "Người chơi chọn 1 trong 3 bộ bài [Thám hiểm 1] / [Thám hiểm 2] / [Thám hiểm 3] để rút bài.",
    "Thực hiện đúng yêu cầu ghi trên lá bài vừa rút.",
    "Sau khi thực hiện xong, lượt của người chơi kết thúc — chuyển sang người kế tiếp.",
];

export const ROUND_NOTE =
    "Một khi bạn rút 1 trong 3 bộ bài [Thám hiểm], vòng của bạn bắt đầu. Vòng kết thúc khi đến lượt bạn rút bài lần tiếp theo.";

export const FORMATION = [
    "Đội hình tối đa 4 [Hero], chia 2 đội: Đội thực địa (2 Hero, trực tiếp chiến đấu) và Đội hậu cần (2 Hero, không tính chỉ số, chỉ dự bị/hỗ trợ).",
    "Sau khi rút [Thám hiểm], có thể hoán đổi vị trí 1 Hero thực địa ↔ hậu cần (tối đa 1 lần/vòng) và hoán đổi [Trang bị] giữa các Hero (tối đa 2 lần/vòng).",
    "Đội đã đủ 4 Hero mà rút thêm 1 Hero mới: muốn nhận phải bỏ 1 Hero hiện tại — mọi lá [Phát triển] gắn trên Hero bị bỏ cũng mất theo.",
    "Hero đã đủ 2 lá [Trang bị] mà rút thêm: muốn nhận phải bỏ 1 lá [Trang bị] đang có.",
    "Hero đã đủ 3 lá [Phát triển] mà rút thêm lá [Phát triển] thường: không có cách nào nhận — chỉ [Phát triển đặc biệt] mới 'ghi đè' được (và không đè lên [Phát triển đặc biệt] khác).",
];

// -- Cột phải: thành phần & cơ chế (lá bài -> chiến đấu -> hình phạt) --

export const CARD_TYPES = [
    {
        key: "hero",
        name: "[Hero]",
        deck: "HERO",
        limit: "Tối đa 4 lá / đội",
        desc: "Lực lượng chiến đấu chính. Có 5 ô chỉ số: VIT (sinh lực), CTR (kháng độc), STR (sức mạnh), INT (trí tuệ), LUK (may mắn) — cùng khả năng đặc biệt riêng.",
    },
    {
        key: "adventure",
        name: "[Thám hiểm 1 / 2 / 3]",
        deck: "ADVENTURE 1",
        limit: "3 bộ bài theo độ khó tăng dần",
        desc: "Rút mỗi lượt, thực hiện yêu cầu ghi trên lá. Mỗi bộ có 1 lá đặc biệt màu đỏ — trúng lá này có cơ hội nhận Token chìa khoá.",
        kinds: [
            {
                name: "Quái vật",
                desc: "Có chỉ số như [Hero] — giao chiến trực tiếp. Thắng nhận thưởng, thua chịu phạt (đều ghi trên lá).",
            },
            {
                name: "Sự kiện",
                desc: "Yêu cầu bạn và người chơi khác cùng thực hiện theo nội dung trên lá.",
            },
            {
                name: "Lựa chọn",
                desc: "Đưa ra 3 phương án, chỉ được chọn và thực hiện 1 trong số đó.",
            },
        ],
    },
    {
        key: "equipment",
        name: "[Trang bị] & [Trang bị đặc biệt]",
        deck: "EQUIPMENT",
        limit: "Tối đa 2 lá / Hero (8 lá / đội)",
        desc: "Tăng chỉ số phụ trợ cho [Hero], có 4 ô chỉ số (VIT/CTR/STR/INT). Có thể tráo đổi giữa các [Hero] trong đội trước khi chiến đấu.",
        note: "Khi trang bị, lá [Hero] nằm đè lên và che 1 cặp chỉ số (VIT-CTR hoặc STR-INT) tuỳ trang bị bên trái hay bên phải — nên chỉ tăng 2/4 chỉ số thay vì cả 4.",
    },
    {
        key: "grow",
        name: "[Phát triển] & [Phát triển đặc biệt]",
        deck: "GROW",
        limit: "Tối đa 3 lá / Hero (12 lá / đội)",
        desc: "Tăng chỉ số, sở hữu đủ 5 chỉ số như [Hero]; một số lá có khả năng đặc biệt riêng.",
        note: "Một khi đã gắn cho 1 [Hero], lá sẽ gắn liền tới khi [Hero] đó bị tiêu diệt hoặc hết thời hạn tồn tại.",
    },
    {
        key: "grow-bad",
        name: "[Phát triển bất lợi]",
        deck: "GROW",
        variant: "penalty",
        limit: "Tối đa 3 lá / Hero (12 lá / đội)",
        desc: "Đóng vai trò hình phạt: chiếm 1 trong 3 ô Phát triển và giảm chỉ số của [Hero]; một số lá có hiệu ứng riêng.",
        // Cách áp dụng đầy đủ (khi nào bị rút, ghi đè ra sao) đã nói kỹ ở mục
        // "Hình phạt khi thua trận" — ở đây chỉ nêu đúng 1 ràng buộc để tránh
        // lặp lại gần nguyên văn đoạn đó.
        note: "Không thể ghi đè lên lá [Phát triển đặc biệt].",
    },
    {
        key: "strategy",
        name: "[Chiến lược]",
        deck: "STRATEGY",
        limit: "Tối đa 4 lá khi tham chiến · 1 lá khi không tham chiến",
        desc: "Giữ trên tay, không chia sẻ. Mỗi lá ghi rõ thời điểm dùng được — hỗ trợ đội hình hoặc phá người chơi khác, chỉ tồn tại trong 1 lượt rồi quay lại bộ bài.",
    },
];

export const COMBAT = {
    order: ["VIT", "CTR", "STR", "INT", "LUK"],
    rule: "5 hiệp đấu theo đúng thứ tự trên. Mỗi hiệp, bên có chỉ số cao hơn thắng và nhận 1 điểm. Sau 5 hiệp, bên nhiều điểm hơn thắng chung cuộc.",
    tie: [
        "Hoà với Quái vật → người chơi là bên nhận điểm.",
        "Hoà với người chơi khác → không bên nào nhận điểm; nếu chung cuộc hoà thì không ai bị phạt hay được thưởng.",
    ],
    scoring:
        "Chỉ số đem so sánh = tổng chỉ số đó của 2 Hero Đội thực địa, cộng/trừ thêm từ [Trang bị], [Phát triển]... mà 2 Hero đó đang sở hữu.",
    example:
        "Đội A (VIT 8, CTR 5, STR 6, INT 4, LUK 3) đấu Đội B (VIT 6, CTR 7, STR 6, INT 5, LUK 2). Hiệp VIT: 8 > 6 → A được điểm. Hiệp CTR: 5 < 7 → B được điểm. Hiệp STR: 6 = 6 → hoà, không ai được điểm. Hiệp INT: 4 < 5 → B được điểm. Hiệp LUK: 3 > 2 → A được điểm. Kết quả 2-2 → hoà chung cuộc, không bên nào bị phạt hay được thưởng.",
};

export const PENALTIES = [
    {
        name: "Mất [Trang bị]",
        desc: "Mất 1 hoặc nhiều lá [Trang bị] / [Trang bị đặc biệt].",
    },
    {
        name: "Rút lá [Phát triển bất lợi]",
        desc: "Bắt buộc rút bộ [Phát triển bất lợi] và gắn cho 1 Hero còn trống ô Phát triển; nếu mọi Hero đã đầy thì phải thay 1 lá [Phát triển] tuỳ chọn.",
        note: "Không thể thay [Phát triển đặc biệt]. Nếu toàn đội đã đủ 3 lá [Phát triển đặc biệt]/Hero, lá phạt này vô hiệu và quay lại bộ bài.",
    },
    {
        name: "Vô hiệu hoá kĩ năng",
        desc: "Hero nhận Token hạn chế kĩ năng.",
    },
    {
        name: "Hạn chế",
        desc: "Hero nhận Token hạn chế — không tính chỉ số khi chiến đấu, không kích hoạt được khả năng đặc biệt.",
    },
    {
        name: "Hạ gục",
        desc: "Hero quay lại bộ bài; mất toàn bộ [Trang bị], [Trang bị đặc biệt], [Phát triển], [Phát triển đặc biệt], [Phát triển bất lợi] đang gắn trên Hero đó.",
    },
    {
        name: "Mất Token chìa khoá",
        desc: "Mất đi 1 Token chìa khoá đang sở hữu.",
    },
];
