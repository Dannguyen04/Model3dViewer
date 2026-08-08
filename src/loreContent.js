// ---------------------------------------------------------------------------
// CỐT TRUYỆN CHI TIẾT — trích từ "Lore.md" do khách cấp (bản dòng thời gian
// đầy đủ, khác với đoạn tóm tắt ngắn STORY trong storyRulesContent.js).
// Lỗi chính tả/ngữ pháp nhỏ và các từ gõ lặp trong bản gốc đã được nắn lại cho
// rõ nghĩa (vd "chú ẩn" -> "trú ẩn", "hạt điện nhân" -> "điện hạt nhân"),
// không đổi nội dung hay tình tiết.
//
// `kind` trên mỗi mốc chọn icon hiển thị trên rail (xem KIND_ICON trong
// LorePage.jsx) — thuần mục đích trình bày, không phải dữ liệu gốc.
// `quote` (nếu có) là 1 câu "đắt" được tách ra khỏi đoạn văn để làm pull-quote
// nổi bật — câu gốc vẫn được giữ nguyên nghĩa, chỉ bỏ khỏi paragraph để tránh
// lặp lại 2 lần.
// ---------------------------------------------------------------------------

export const FACTIONS = [
    { id: "binh-minh", name: "Cộng hòa Bình Minh" },
    { id: "phuong-bac", name: "Liên bang Phương Bắc" },
    { id: "hac-dieu-thach", name: "Đế quốc Hắc diệu thạch" },
    { id: "lien-minh-thep", name: "Liên Minh Thép" },
    { id: "mechtek", name: "Tập đoàn Mechtek" },
];

// -- Kỷ nguyên 1: trước sự kiện Tái sáng thế --------------------------------

const PRE_TIMELINE = [
    {
        marker: "54 năm trước Tái sáng thế",
        kind: "politics",
        paragraphs: [
            "Nhân loại đã đạt đến mức tối đa của một nền văn minh cấp 1, dân số khoảng 10 tỷ dân. Nhưng đổi lại nguồn dầu khí và than đá đã gần như cạn kiệt, dẫn đến sự biến đổi thù địch của hệ sinh thái tự nhiên. Tuy đông dân nhưng đa phần đều là bình dân không sở hữu lượng tài sản lớn, đa số tài nguyên rơi vào tay 2% những người giàu có — cuộc sống chỉ đủ sống chứ thực tế không có khả năng thay đổi số phận bản thân, nên chính trị các nước rất rối ren, cộng thêm các vấn đề thiên tai đã dẫn đến rất nhiều cuộc biểu tình rồi đảo chính. Các quốc gia nhỏ giờ đây khó có thể tồn tại nên cũng dần tan rã, cuối cùng chỉ còn trụ lại 5 thế lực chính trên thế giới:",
            "Cộng hòa Bình Minh, Liên bang Phương Bắc, Đế quốc Hắc diệu thạch, Liên Minh Thép, Tập đoàn Mechtek.",
            "Mặc dù là năm thế lực lớn có nguồn tài nguyên dồi dào, nhưng thực tế tài nguyên của họ giờ đây đa phần phải nuôi dân tị nạn của rất nhiều quốc gia đã bị lật đổ. Những người đứng đầu các thế lực quyết định họp bàn và đưa ra giải pháp về dự án New Horizon — mục tiêu là tìm thêm tài nguyên từ ngoài không gian, bước đầu khai thác từ các hành tinh nằm trong đai sự sống của cùng hệ sao.",
        ],
    },
    {
        marker: "50 năm trước Tái sáng thế",
        kind: "disaster",
        paragraphs: [
            "Sau 4 năm nghiên cứu để lắp đặt thiết bị và cải tiến tên lửa tái sử dụng, một sự kiện chấn động đã xảy ra: tổ hợp nhà máy điện hạt nhân Walter-Elephant của Cộng hòa Bình Minh gặp sự cố và phát nổ. Theo báo cáo điều tra, nguyên nhân là một trận động đất kéo dài 2 tiếng. Tuy vậy, có rất nhiều nghi kỵ xung quanh sự cố này — thông số kỹ thuật của nhà máy cho thấy trận động đất thực tế không thể ảnh hưởng lớn đến mức đó, và hệ thống bảo vệ lò phản ứng lẽ ra không để vụ nổ xảy ra.",
            "Hậu quả của vụ nổ thực sự khủng khiếp. Dù nhà máy tiêu chuẩn được xây cách khu dân cư 20km, nhưng do dân nhập cư tăng nên thực tế vẫn có người sinh sống trong bán kính 3km quanh nhà máy. Cộng thêm sự cộng hưởng của vụ nổ, bán kính 60km quanh nhà máy đã bị san phẳng thành bình địa, và bán kính 200km trở thành khu vực không thể sinh sống do ô nhiễm phóng xạ. Walter-Elephant cung cấp 12% tổng lượng điện của Cộng hòa Bình Minh và 4% của Liên bang Phương Bắc — đáng nói hơn, đây cũng là nguồn cung cấp điện chính cho dự án New Horizon của cả hai thế lực. Dự án phải tạm hoãn vô thời hạn vì Cộng hòa Bình Minh là bên cung cấp nguyên vật liệu chính. Tổng thống, Phó Tổng thống đương nhiệm và một vài quan chức cao cấp của Cộng hòa Bình Minh phải tuyên bố từ chức ngay lập tức.",
        ],
    },
    {
        marker: "40 năm trước Tái sáng thế",
        kind: "politics",
        paragraphs: [
            "10 năm sau vụ nổ, Cộng hòa Bình Minh suy thoái đi rất nhiều. Các chính phủ lâm thời mới được thành lập nhưng không thể giải quyết các vấn đề tồn đọng, chỉ có thể trì hoãn và đùn đẩy trách nhiệm. Cộng hòa Bình Minh từ nước dẫn đầu 5 thế lực tụt xuống vị trí số 4. Các khoản nợ cứ thế gia tăng và đời sống nhân dân thì lầm than.",
            "Tân tổng thống A.H. Johnson đắc cử, cùng chính phủ lâm thời mới được bầu để trấn áp tình hình. Johnson là người cứng rắn — các chính sách của ông rất hà khắc khi chuyển hướng đất nước sang lấy quân đội làm chủ đạo, nhằm trấn áp tình trạng gia tăng vũ lực trong quần chúng. Các chính sách nhắm đến người nhập cư bị cho là có phần vô nhân đạo: dù thuế cư trú cho dân nhập cư đã giảm bớt, họ lại bị đẩy vào các công việc rủi ro cao hơn và hưởng mức an sinh xã hội thấp hơn.",
            "Quyết định gây tranh cãi nhất của Johnson là cấp phép thành lập Forager Structure Foundation (FSF) và N.M.R.I — một phòng thí nghiệm nghiên cứu đột biến liên quan đến phóng xạ và hoá học. Hai tổ chức này đảm nhiệm việc tìm kiếm, nghiên cứu, cải tiến và tái sử dụng những gì còn sót lại từ vụ nổ nhà máy Walter-Elephant.",
        ],
    },
    {
        marker: "36 năm trước Tái sáng thế",
        kind: "tech",
        quote: "Có thể nói là một bước lên mây.",
        paragraphs: [
            "Khi chính phủ của A.H. Johnson bị nghi ngờ và các cuộc biểu tình nổ ra khắp Cộng hòa Bình Minh, trong tình thế nguy cấp nhất, FSF và N.M.R.I công bố một loại huyết thanh có tác dụng gia tăng sức mạnh và sức lực, tăng khả năng hấp thụ dưỡng chất và giải độc của nội tạng — được quảng bá là 'thức tỉnh tiềm năng tối đa về di truyền' trong mỗi con người. Huyết thanh ban đầu bị nghi ngờ, nhưng chính Johnson đã đứng ra đảm bảo, thậm chí đưa cả gia đình — trong đó có đứa con 3 tuổi — đi tiêm để chứng minh. Những người tin vào chính phủ đã đi tiêm, và huyết thanh thực sự giúp họ khoẻ mạnh hơn: khả năng làm việc cải thiện, thời gian nghỉ ngơi cần thiết giảm xuống, cùng nhiều ưu thế khác. Trong vòng một tháng, mọi người đổ xô đi tiêm. Người già sau khi tiêm khoẻ mạnh hơn, cống hiến được lâu hơn; trẻ con lớn nhanh và phát triển mạnh hơn; con cái của người đã tiêm cũng không bị biến đổi gì bất thường, khiến mọi người càng an tâm.",
            "A.H. Johnson tái đắc cử lần 2 một cách dễ dàng. Nhờ huyết thanh, cơ sở hạ tầng của Cộng hòa Bình Minh được xây nhanh hơn, công việc cần 3 người làm giờ chỉ cần 1. Người ta lại mơ về một tương lai nơi Cộng hòa Bình Minh vươn lên đứng đầu 5 thế lực.",
        ],
    },
    {
        marker: "32 năm trước Tái sáng thế",
        kind: "tech",
        paragraphs: [
            "Huyết thanh dần trở thành vật quốc hữu, không xuất khẩu ra nước ngoài. Tuy nhiên vì số lượng sản xuất có hạn — dù đã mở thêm 1 nhà máy — vẫn không đủ cho người dân sử dụng. Trong 2 năm, số người được tiêm thực tế chỉ đạt 10% dân số Cộng hòa Bình Minh; tính cả dân nhập cư thì tỷ lệ còn thấp hơn nhiều. Hơn nữa, các hoạt chất phóng xạ — nguyên liệu chính để sản xuất — buộc Cộng hòa Bình Minh phải nhập khẩu từ các thế lực khác.",
        ],
    },
    {
        marker: "31 năm trước Tái sáng thế",
        kind: "assassination",
        paragraphs: [
            "Tháng 10, bộ trưởng ngoại giao của Cộng hòa Bình Minh bị ám sát trong phòng riêng, trong chuyến thăm Đế quốc Hắc diệu thạch để bàn về việc mua bán vật liệu phóng xạ. Cộng hòa Bình Minh yêu cầu Đế quốc Hắc diệu thạch giải thích về vấn đề an ninh liên quan. Đế quốc Hắc diệu thạch phủ nhận liên quan đến vụ ám sát, cáo buộc có bên thứ ba can thiệp nhằm gia tăng xung đột.",
            "Tổng thống A.H. Johnson ra thông cáo: Đế quốc Hắc diệu thạch phải đưa ra câu trả lời thỏa đáng, nếu không sẽ phải chịu trả đũa từ Cộng hòa Bình Minh vì cái chết của cựu bộ trưởng ngoại giao.",
            "Tổng thống A.H. Johnson gia tăng số lượng quân đội thường trực tại các vị trí biên giới tiếp giáp với Đế quốc Hắc diệu thạch.",
        ],
    },
    {
        marker: "30 năm trước Tái sáng thế",
        kind: "assassination",
        paragraphs: [
            "Tổng thống A.H. Johnson bị ám sát và qua đời tại nhà riêng; gia đình ông cũng chịu chung số phận. Theo điều tra, chính phủ cáo buộc Đế quốc Hắc diệu thạch là kẻ chủ mưu và phát động chiến tranh đơn phương nhắm vào đế quốc này.",
            "Cuối năm, cuộc chiến tổng lực diễn ra. FSF và N.M.R.I hợp nhất làm một, lấy tên vị founder A.H. Johnson đặt tên — tập đoàn A.H.J ra đời từ đây.",
        ],
    },
    {
        marker: "10 năm trước Tái sáng thế",
        kind: "war",
        paragraphs: [
            "Cuộc chiến từ chỗ chỉ giữa Cộng hòa Bình Minh và Đế quốc Hắc diệu thạch đã lan rộng thành cuộc chiến của tất cả các thế lực: Cộng hòa Bình Minh và Liên bang Phương Bắc chung chiến tuyến — gọi là Khối Chân Trời — đối đầu với Đế quốc Hắc diệu thạch, Liên Minh Thép và Tập đoàn Mechtek — gọi là Khối Đại Lục. Dù quân lực lép vế hơn, nhờ công nghệ hạt nhân và huyết thanh của tập đoàn A.H.J, Khối Chân Trời vẫn có thể đối chọi ngang hàng với 3 thế lực kia.",
            "Cùng năm, công nghệ huyết thanh của A.H.J bị lộ. Ở Đế quốc Hắc diệu thạch, tổ chức Marshall & Colt được thành lập.",
        ],
    },
    {
        marker: "9 năm trước Tái sáng thế",
        kind: "war",
        paragraphs: [
            "Marshall & Colt phát minh ra một loại bom khí hoá học gây biến đổi gen — chỉ cần tiếp xúc trong thời gian ngắn có thể khiến cơ thể biến đổi, mất đi lý trí và trở thành các dạng sống thù địch. Dự án này bị xem là thất bại và bị lên án gay gắt từ các tổ chức quốc tế. Nhưng để giành chiến thắng, Đế quốc Hắc diệu thạch vẫn chủ động sử dụng loại vũ khí này trên chiến trường.",
            "Một nước đi để kéo A.H.J xuống cùng mình: Marshall & Colt công bố nguyên liệu chính trong huyết thanh của A.H.J chính là Dioxin đã được cải tiến — hậu thế gọi là hợp chất Dioxin-X. Trong những chiến dịch đầu tiên sử dụng, quả bom của Marshall & Colt được chứng minh là vũ khí cực kỳ khó kiểm soát do khả năng phát tán rất nhanh trong không khí — theo thống kê, nếu bom gây ảnh hưởng lên đối thủ 10 phần thì 3 phần của chính phe Khối Đại Lục cũng bị ảnh hưởng theo.",
        ],
    },
    {
        marker: "2 năm trước Tái sáng thế",
        kind: "war",
        paragraphs: [
            "Trong vòng 7 năm, nhờ các cải tiến vũ khí, Khối Đại Lục dần đẩy lùi Khối Chân Trời — đất đai của Khối Chân Trời ngày càng bị chiếm đóng. Bản thân A.H.J gần như không can thiệp vào trận chiến; bên cạnh việc cải tiến và cung cấp huyết thanh, họ cũng tìm ra cách cứu chữa cho những người bị biến đổi do bom khí hoá học trên khắp các mặt trận. Họ còn xây dựng 5 khu vực an toàn cực lớn ở các nước để cứu chữa những người bị biến đổi, gọi đây là chiến dịch 'Trung tâm phục hồi nhân đạo và tái thiết kinh tế sau thế chiến'. Các khu vực an toàn này sở hữu công nghệ năng lượng và lọc hoá tiên tiến nhất cùng rất nhiều tiện nghi khác, với sức chứa gần 100 triệu người.",
        ],
    },
];

// Mốc bản lề — ranh giới giữa 2 kỷ nguyên, tách khỏi PRE_TIMELINE để LorePage
// dựng thành 1 khối "chương ngắt" full-width riêng thay vì 1 dòng trong rail.
export const PIVOT = {
    marker: "Tái sáng thế",
    quote: "Thế giới đã kết thúc.",
    paragraphs: [
        "Trận chiến giờ chỉ còn là thủ tục — quân đội Khối Chân Trời không còn khả năng chi viện cho nhau, và vùng đất còn lại của họ cũng chẳng còn bao nhiêu. Khi các lãnh đạo Khối Đại Lục ngồi lại bàn về việc chia lợi ích sau chiến tranh, sự kiện mà tân nhân loại sau này gọi là Tái sáng thế đã xảy ra.",
        "Hàng trăm quả tên lửa được phóng lên từ bên dưới các khu trú ẩn của tập đoàn A.H.J, mang theo loại khí biến đổi hoá học của Marshall & Colt đã được A.H.J cải biến, lan ra khắp thế giới. Bầu trời đêm hôm đó đỏ rực sắc đỏ của hàng loạt tên lửa bay khắp trời. Chỉ những ai ở trong 5 khu trú ẩn mới sống sót.",
    ],
};

// -- Kỷ nguyên 2: sau sự kiện Tái sáng thế ----------------------------------

const POST_TIMELINE = [
    {
        marker: "Năm đầu tiên sau Tái sáng thế",
        kind: "lockdown",
        paragraphs: [
            "Cánh cửa của các khu trú ẩn bị niêm phong, đồng hồ đếm ngược 200 năm hiện trên cánh cổng. Một đoạn video được phát tại quảng trường các khu trú ẩn: CEO của A.H.J đứng ra thừa nhận sự kiện, tuyên bố giải tán tập đoàn và giải thích rằng họ muốn 'thanh lọc' thế giới này. Cánh cửa sẽ chỉ mở sau 200 năm, khi khí độc từ các quả bom thuyên giảm đáng kể và không còn nhiều ảnh hưởng đến con người. Bên ngoài cửa sổ phía sau CEO của A.H.J là hình ảnh những quả bom rơi xuống và nổ tung. Video kết thúc.",
        ],
    },
    {
        marker: "50 năm sau",
        kind: "discovery",
        paragraphs: [
            "Một hacker thiên tài tìm được kẽ hở trong bảo mật của các khu trú ẩn và khai thông kết nối giữa chúng. Từ đó, con người ở các khu trú ẩn có thể liên lạc với nhau, và họ nhận ra AI của A.H.J thực tế không toàn năng như vẫn tưởng.",
        ],
    },
    {
        marker: "70 năm sau",
        kind: "discovery",
        paragraphs: [
            "Sau rất nhiều nỗ lực, AI đã bị tấn công nhiều lần. Con người phát hiện ra rất nhiều hầm ẩn bên dưới các khu trú ẩn — kho vũ khí nóng và lạnh, hệ thống địa đạo, và quan trọng nhất là các cơ sở nghiên cứu công nghệ. Những thứ này lẽ ra chỉ được mở sau 200 năm đóng cửa, nhưng giờ đã bị mở ra trước thời hạn.",
        ],
    },
    {
        marker: "80 năm sau",
        kind: "resource",
        paragraphs: [
            "Dù tài nguyên A.H.J để lại đủ cho tân nhân loại sống trong khu trú ẩn tới 250 năm, và cơ chế AI của tập đoàn vẫn hỗ trợ con người sinh tồn, nhưng vì các cơ sở nghiên cứu ngầm đã bị đột nhập trước thời hạn, nguồn tài nguyên ít ỏi dành cho sinh tồn dần bị chuyển sang những cơ sở này — dẫn đến thiếu hụt nguyên liệu đốt và các thành phần kim loại.",
        ],
    },
    {
        marker: "90 năm sau",
        kind: "founding",
        paragraphs: [
            "Quân đoàn trinh sát, tìm kiếm và bảo vệ tài nguyên (Resource Reconnaissance, Search and Protection Corps) — thường gọi là Quân trinh sát — được thành lập. Mục tiêu của tổ chức là hướng ra bên ngoài các khu trú ẩn để tìm kiếm tài nguyên cần thiết cho việc kiến thiết tân nhân loại. Mục tiêu đầu tiên: phá giải quyền hạn cao nhất của các khu trú ẩn — quyền mở cửa — đồng thời đào tạo quân đội để có thể ra ngoài bất cứ khi nào.",
        ],
    },
    {
        marker: "100 năm sau",
        kind: "reveal",
        quote: "Bên ngoài khu trú ẩn là một thế giới đầy chết chóc.",
        paragraphs: [
            "Cánh cửa đã mở sớm 100 năm so với tính toán của A.H.J, đúng như dự đoán của Quân trinh sát.",
        ],
    },
];

export const TIMELINE = [
    { era: "Tiền Tái sáng thế", entries: PRE_TIMELINE },
    { era: "Hậu Tái sáng thế", entries: POST_TIMELINE },
];
