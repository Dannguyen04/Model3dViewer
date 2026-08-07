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

export const FORMATION_INTRO =
    "Đội hình tối đa 4 [Hero], chia 2 đội: Đội thực địa (2 Hero, trực tiếp chiến đấu) và Đội hậu cần (2 Hero, không tính chỉ số, chỉ dự bị/hỗ trợ).";

// Giới hạn hoán đổi mỗi vòng — tách riêng thành bảng nhỏ vì đây là 2 con số
// người chơi hay quên nhất giữa ván (đổi được mấy lần rồi nhỉ?).
export const FORMATION_SWAPS = [
    {
        label: "Hoán đổi vị trí Hero (thực địa ↔ hậu cần)",
        limit: "Tối đa 1 lần / vòng",
    },
    { label: "Hoán đổi [Trang bị] giữa các Hero", limit: "Tối đa 2 lần / vòng" },
];

// Cheat-sheet "rút thêm khi đã đầy thì sao" — gộp lại thành bảng tra nhanh
// theo từng loại thẻ, thay vì 3 câu văn xuôi rời rạc.
export const FORMATION_OVERFLOW = [
    {
        subject: "[Hero]",
        limit: "Đội đã đủ 4 Hero",
        rule: "Rút thêm 1 Hero mới: muốn nhận phải bỏ 1 Hero hiện tại — mọi lá [Phát triển] gắn trên Hero bị bỏ cũng mất theo.",
    },
    {
        subject: "[Trang bị]",
        limit: "Hero đã đủ 2 lá Trang bị",
        rule: "Rút thêm: muốn nhận phải bỏ 1 lá [Trang bị] đang có.",
    },
    {
        subject: "[Phát triển]",
        limit: "Hero đã đủ 3 lá Phát triển",
        rule: "Rút thêm lá [Phát triển] thường: không có cách nào nhận — chỉ [Phát triển đặc biệt] mới 'ghi đè' được (và không đè lên [Phát triển đặc biệt] khác).",
    },
];

// -- Cột phải: thành phần & cơ chế (lá bài -> chiến đấu -> hình phạt) --

// "Cách đọc 1 lá bài" — chú thích trực tiếp lên 1 lá Thám hiểm thật (thay vì
// ảnh nhân vật Hero, vốn chỉ là artwork rời không có khung/tên/số in sẵn).
// Lá "Chất nhờn vô hại" (ADVENTURE 1) được chọn vì có đủ khung, 5 ô chỉ số
// màu và khối "Loại lá / Hiệu ứng" — đại diện tốt cho bố cục chung của cả bộ
// Thám hiểm. Vị trí top/left (%) của mỗi pin đo tay trên ảnh gốc 794x1191,
// đối chiếu chéo với lá "Nấm đột biến" (ADVENTURE 2) để xác nhận màu ↔ chỉ số:
// xanh lá (trên-trái) = VIT, tím (dưới-trái) = CTR, đỏ (trên-phải) = STR,
// xanh dương (dưới-phải) = INT, vàng (giữa) = LUK — khớp đúng ở cả 2 lá.
export const CARD_ANATOMY = {
    cardName: "Chất nhờn vô hại",
    deck: "ADVENTURE 1",
    legend: [
        { n: 1, top: 6, left: 50, label: "Tên lá", desc: "Tên riêng của lá bài." },
        {
            n: 2,
            top: 28,
            left: 30,
            label: "Ảnh minh hoạ",
            desc: "Hình vẽ nhân vật hoặc sinh vật in trên lá.",
        },
        {
            n: 3,
            top: 55,
            left: 50,
            label: "5 ô chỉ số màu",
            desc: 'VIT xanh lá (trên-trái) · CTR tím (dưới-trái) · STR đỏ (trên-phải) · INT xanh dương (dưới-phải) · LUK vàng (giữa) — dùng để so từng hiệp khi Chiến đấu, xem mục "Cơ chế chiến đấu" bên dưới.',
        },
        {
            n: 4,
            top: 70,
            left: 20,
            label: "Loại lá & phân loại bộ",
            desc: 'Vd "Quái vật" thuộc bộ "Thám hiểm 1" — cho biết cách xử lý lá và rút từ bộ nào.',
        },
        {
            n: 5,
            top: 84,
            left: 15,
            label: "Hiệu ứng thắng / thua",
            desc: "Phần thưởng khi thắng, hình phạt khi thua (nếu có) — ghi rõ ngay trên lá.",
        },
    ],
};

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
        // Suy ra từ chỉ số quái vật trong data.js (không phải luật gốc) —
        // ghi rõ "ước tính" để không bị hiểu nhầm là số liệu chính thức.
        note: "Ước tính từ chỉ số quái vật trong bộ dữ liệu thẻ (chưa đối chiếu luật gốc): Thám hiểm 1 dễ nhất, phù hợp làm quen; Thám hiểm 2 và 3 tăng dần độ khó, Thám hiểm 3 có những quái mạnh nhất bộ.",
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
    // Dạng bảng (thay vì văn xuôi liệt kê 5 hiệp) để so trực tiếp theo cột —
    // powers khớp thứ tự với COMBAT.order (VIT, CTR, STR, INT, LUK).
    example: {
        teamA: { label: "Đội A", powers: [8, 5, 6, 4, 3] },
        teamB: { label: "Đội B", powers: [6, 7, 6, 5, 2] },
        result: "Kết quả 2-2 → hoà chung cuộc, không bên nào bị phạt hay được thưởng.",
    },
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
