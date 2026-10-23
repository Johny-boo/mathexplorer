import type { VocabEntry } from './types'

// Ngân hàng từ vựng (~60 từ)
export const VOCABULARY_BANK: VocabEntry[] = [
    // 1. Số & Đọc số (11-20)
    { id: 'eleven', en: 'eleven', vi: 'mười một', emoji: '11️⃣', group: 'number', level: 1, example: 'Eleven is after ten.', exampleVi: 'Mười một đứng sau mười.' },
    { id: 'twelve', en: 'twelve', vi: 'mười hai', emoji: '12️⃣', group: 'number', level: 1, example: 'A year has twelve months.', exampleVi: 'Một năm có mười hai tháng.' },
    { id: 'thirteen', en: 'thirteen', vi: 'mười ba', emoji: '13️⃣', group: 'number', level: 1, example: 'Thirteen is an odd number.', exampleVi: 'Mười ba là số lẻ.' },
    { id: 'fourteen', en: 'fourteen', vi: 'mười bốn', emoji: '14️⃣', group: 'number', level: 1, example: 'Fourteen days is two weeks.', exampleVi: 'Mười bốn ngày là hai tuần.' },
    { id: 'fifteen', en: 'fifteen', vi: 'mười lăm', emoji: '15️⃣', group: 'number', level: 1, example: 'Fifteen minutes.', exampleVi: 'Mười lăm phút.' },
    { id: 'sixteen', en: 'sixteen', vi: 'mười sáu', emoji: '16️⃣', group: 'number', level: 1, example: 'Sixteen is even.', exampleVi: 'Mười sáu là số chẵn.' },
    { id: 'seventeen', en: 'seventeen', vi: 'mười bảy', emoji: '17️⃣', group: 'number', level: 1, example: 'Seventeen plus one.', exampleVi: 'Mười bảy cộng một.' },
    { id: 'eighteen', en: 'eighteen', vi: 'mười tám', emoji: '18️⃣', group: 'number', level: 1, example: 'Eighteen is almost twenty.', exampleVi: 'Mười tám gần bằng hai mươi.' },
    { id: 'nineteen', en: 'nineteen', vi: 'mười chín', emoji: '19️⃣', group: 'number', level: 1, example: 'Nineteen is an odd number.', exampleVi: 'Mười chín là số lẻ.' },
    { id: 'twenty', en: 'twenty', vi: 'hai mươi', emoji: '2️⃣0️⃣', group: 'number', level: 1, example: 'Twenty plus one is twenty-one.', exampleVi: 'Hai mươi cộng một là hai mươi mốt.' },

    // 2. Phép tính
    { id: 'plus', en: 'plus', vi: 'cộng', emoji: '➕', group: 'operation', level: 1, example: 'Two plus two is four.', exampleVi: 'Hai cộng hai là bốn.' },
    { id: 'minus', en: 'minus', vi: 'trừ', emoji: '➖', group: 'operation', level: 1, example: 'Five minus three is two.', exampleVi: 'Năm trừ ba là hai.' },
    { id: 'times', en: 'times', vi: 'nhân', emoji: '✖️', group: 'operation', level: 1, example: 'Three times two is six.', exampleVi: 'Ba nhân hai là sáu.' },
    { id: 'divided', en: 'divided by', vi: 'chia', emoji: '➗', group: 'operation', level: 1, example: 'Ten divided by two is five.', exampleVi: 'Mười chia hai là năm.' },
    { id: 'altogether', en: 'altogether', vi: 'tất cả', group: 'operation', level: 1, example: 'How many altogether?', exampleVi: 'Có tất cả bao nhiêu?' },
    { id: 'left', en: 'left', vi: 'còn lại', group: 'operation', level: 1, example: 'How many are left?', exampleVi: 'Còn lại bao nhiêu?' },
    { id: 'more', en: 'more', vi: 'nhiều hơn/thêm', group: 'operation', level: 1, example: 'He buys 2 more.', exampleVi: 'Cậu ấy mua thêm 2 cái.' },
    { id: 'equal', en: 'equal', vi: 'bằng nhau', group: 'operation', level: 1, example: 'They are equal.', exampleVi: 'Chúng bằng nhau.' },

    // 3. Câu hỏi
    { id: 'how_many', en: 'How many', vi: 'Có bao nhiêu', emoji: '❓', group: 'question', level: 1, example: 'How many apples?', exampleVi: 'Có bao nhiêu quả táo?' },
    { id: 'what_is', en: 'What is', vi: 'Cái gì là', group: 'question', level: 1, example: 'What is 2 + 2?', exampleVi: '2 + 2 là gì?' },
    { id: 'which', en: 'Which', vi: 'Cái nào', group: 'question', level: 1, example: 'Which is bigger?', exampleVi: 'Cái nào lớn hơn?' },

    // 4. Hình & đo lường (Các từ dùng trong câu hỏi)
    { id: 'shape', en: 'shape', vi: 'hình dạng', emoji: '🔷', group: 'shape', level: 1, example: 'What shape is this?', exampleVi: 'Đây là hình gì?' },
    { id: 'triangle', en: 'triangle', vi: 'hình tam giác', emoji: '🔺', group: 'shape', level: 1, example: 'A triangle has 3 sides.', exampleVi: 'Hình tam giác có 3 cạnh.' },
    { id: 'square', en: 'square', vi: 'hình vuông', emoji: '🟦', group: 'shape', level: 1, example: 'It is a square.', exampleVi: 'Nó là hình vuông.' },
    { id: 'pentagon', en: 'pentagon', vi: 'hình ngũ giác', emoji: '⬟', group: 'shape', level: 1, example: 'A pentagon has 5 sides.', exampleVi: 'Hình ngũ giác có 5 cạnh.' },
    { id: 'hexagon', en: 'hexagon', vi: 'hình lục giác', emoji: '⬢', group: 'shape', level: 1, example: 'A hexagon has 6 sides.', exampleVi: 'Hình lục giác có 6 cạnh.' },
    { id: 'side', en: 'side', vi: 'cạnh', group: 'shape', level: 1, example: 'How many sides?', exampleVi: 'Có bao nhiêu cạnh?' },
    { id: 'circle', en: 'circle', vi: 'hình tròn', emoji: '⭕', group: 'shape', level: 1, example: 'It is a circle.', exampleVi: 'Nó là hình tròn.' },
    { id: 'clock', en: 'clock', vi: 'đồng hồ', emoji: '🕰️', group: 'shape', level: 1, example: 'Look at the clock.', exampleVi: 'Nhìn vào đồng hồ.' },
    { id: 'time', en: 'time', vi: 'thời gian', group: 'shape', level: 1, example: 'What time is it?', exampleVi: 'Bây giờ là mấy giờ?' },

    // 5. Logic
    { id: 'next', en: 'next', vi: 'tiếp theo', group: 'logic', level: 1, example: 'What is next?', exampleVi: 'Tiếp theo là gì?' },
    { id: 'odd', en: 'odd', vi: 'số lẻ / khác biệt', group: 'logic', level: 1, example: 'Find the odd one out.', exampleVi: 'Tìm cái khác biệt.' },
    { id: 'even', en: 'even', vi: 'số chẵn', emoji: '🔢', group: 'logic', level: 1, example: 'Two is an even number.', exampleVi: 'Hai là số chẵn.' },
    { id: 'number', en: 'number', vi: 'con số', emoji: '🔢', group: 'number', level: 1, example: 'Pick a number.', exampleVi: 'Chọn một con số.' },

    // 6. Ngữ cảnh đời sống (Dùng trong câu hỏi)
    { id: 'apple', en: 'apple', vi: 'quả táo', emoji: '🍎', group: 'life', level: 1, example: 'I eat an apple.', exampleVi: 'Tôi ăn một quả táo.' },
    { id: 'pen', en: 'pen', vi: 'cái bút', emoji: '🖊️', group: 'life', level: 1, example: 'I have a pen.', exampleVi: 'Tôi có một cái bút.' },
    { id: 'book', en: 'book', vi: 'quyển sách', emoji: '📕', group: 'life', level: 1, example: 'I read a book.', exampleVi: 'Tôi đọc một quyển sách.' },
    { id: 'box', en: 'box', vi: 'cái hộp', emoji: '📦', group: 'life', level: 1, example: 'Put it in the box.', exampleVi: 'Đặt nó vào hộp.' },
    { id: 'candy', en: 'candy', vi: 'kẹo', emoji: '🍬', group: 'life', level: 1, example: 'She has 3 candies.', exampleVi: 'Cô ấy có 3 cái kẹo.' },
    { id: 'shop', en: 'shop', vi: 'cửa hàng', emoji: '🏪', group: 'life', level: 1, example: 'A shop has pens.', exampleVi: 'Một cửa hàng có bút.' },
    { id: 'Tom', en: 'Tom', vi: 'Tom (tên riêng)', group: 'life', level: 1, example: 'Tom has apples.', exampleVi: 'Tom có táo.' },
    { id: 'Anna', en: 'Anna', vi: 'Anna (tên riêng)', group: 'life', level: 1, example: 'Anna has pens.', exampleVi: 'Anna có bút.' },
    { id: 'Ben', en: 'Ben', vi: 'Ben (tên riêng)', group: 'life', level: 1, example: 'Ben has books.', exampleVi: 'Ben có sách.' },
    { id: 'Lisa', en: 'Lisa', vi: 'Lisa (tên riêng)', group: 'life', level: 1, example: 'Lisa has candies.', exampleVi: 'Lisa có kẹo.' },

    // Bổ sung thêm các từ vựng khác để đủ ~60
    { id: 'table', en: 'table', vi: 'cái bàn', emoji: '🪑', group: 'life', level: 1, example: 'On the table.', exampleVi: 'Trên bàn.' },
    { id: 'chair', en: 'chair', vi: 'cái ghế', emoji: '🪑', group: 'life', level: 1, example: 'Sit on the chair.', exampleVi: 'Ngồi lên ghế.' },
    { id: 'car', en: 'car', vi: 'xe hơi', emoji: '🚗', group: 'life', level: 1, example: 'A red car.', exampleVi: 'Một chiếc xe hơi màu đỏ.' },
    { id: 'cat', en: 'cat', vi: 'con mèo', emoji: '🐱', group: 'life', level: 1, example: 'The cat is sleeping.', exampleVi: 'Con mèo đang ngủ.' },
    { id: 'dog', en: 'dog', vi: 'con chó', emoji: '🐶', group: 'life', level: 1, example: 'The dog runs.', exampleVi: 'Con chó chạy.' },
    { id: 'bird', en: 'bird', vi: 'con chim', emoji: '🐦', group: 'life', level: 1, example: 'The bird flies.', exampleVi: 'Con chim bay.' },
    { id: 'tree', en: 'tree', vi: 'cái cây', emoji: '🌳', group: 'life', level: 1, example: 'A tall tree.', exampleVi: 'Một cái cây cao.' },
    { id: 'flower', en: 'flower', vi: 'bông hoa', emoji: '🌻', group: 'life', level: 1, example: 'A beautiful flower.', exampleVi: 'Một bông hoa đẹp.' },
    { id: 'house', en: 'house', vi: 'ngôi nhà', emoji: '🏠', group: 'life', level: 1, example: 'My house is big.', exampleVi: 'Nhà tôi to.' },
    { id: 'ball', en: 'ball', vi: 'quả bóng', emoji: '⚽', group: 'life', level: 1, example: 'Play with a ball.', exampleVi: 'Chơi với quả bóng.' },
    { id: 'bag', en: 'bag', vi: 'cái cặp', emoji: '🎒', group: 'life', level: 1, example: 'My school bag.', exampleVi: 'Cặp sách của tôi.' },
    { id: 'hat', en: 'hat', vi: 'cái mũ', emoji: '🧢', group: 'life', level: 1, example: 'Wear a hat.', exampleVi: 'Đội mũ.' },
    { id: 'shoe', en: 'shoe', vi: 'đôi giày', emoji: '👟', group: 'life', level: 1, example: 'New shoes.', exampleVi: 'Giày mới.' },
    { id: 'water', en: 'water', vi: 'nước', emoji: '💧', group: 'life', level: 1, example: 'Drink water.', exampleVi: 'Uống nước.' },
    { id: 'milk', en: 'milk', vi: 'sữa', emoji: '🥛', group: 'life', level: 1, example: 'Drink milk.', exampleVi: 'Uống sữa.' },
    { id: 'cake', en: 'cake', vi: 'bánh ngọt', emoji: '🍰', group: 'life', level: 1, example: 'A piece of cake.', exampleVi: 'Một miếng bánh.' },
    { id: 'big', en: 'big', vi: 'to, lớn', group: 'shape', level: 1, example: 'A big box.', exampleVi: 'Một cái hộp to.' },
    { id: 'small', en: 'small', vi: 'nhỏ', group: 'shape', level: 1, example: 'A small pen.', exampleVi: 'Một cái bút nhỏ.' },
    { id: 'long', en: 'long', vi: 'dài', group: 'shape', level: 1, example: 'A long ruler.', exampleVi: 'Một cây thước dài.' },
    { id: 'short', en: 'short', vi: 'ngắn', group: 'shape', level: 1, example: 'A short pencil.', exampleVi: 'Một cây bút chì ngắn.' },

    // Từ vựng Level 2 (Số lớn, phép tính)
    { id: 'hundred', en: 'hundred', vi: 'một trăm', group: 'number', level: 2, example: 'One hundred.', exampleVi: 'Một trăm.' },
    { id: 'thousand', en: 'thousand', vi: 'một nghìn', group: 'number', level: 2, example: 'One thousand.', exampleVi: 'Một nghìn.' },
    { id: 'double', en: 'double', vi: 'gấp đôi', group: 'operation', level: 2, example: 'Double 5 is 10.', exampleVi: 'Gấp đôi 5 là 10.' },
    { id: 'half', en: 'half', vi: 'một nửa', group: 'operation', level: 2, example: 'Half of 10 is 5.', exampleVi: 'Một nửa của 10 là 5.' },
    { id: 'groups', en: 'groups', vi: 'nhóm', group: 'operation', level: 2, example: '3 groups of 4.', exampleVi: '3 nhóm, mỗi nhóm 4 cái.' },
    { id: 'fewer', en: 'fewer', vi: 'ít hơn', group: 'operation', level: 2, example: '2 fewer.', exampleVi: 'Ít hơn 2 cái.' },
    { id: 'corner', en: 'corner', vi: 'góc/đỉnh', group: 'shape', level: 2, example: 'A square has 4 corners.', exampleVi: 'Hình vuông có 4 góc.' },
    { id: 'tallest', en: 'tallest', vi: 'cao nhất', group: 'logic', level: 2, example: 'He is the tallest.', exampleVi: 'Cậu ấy cao nhất.' },
    { id: 'youngest', en: 'youngest', vi: 'nhỏ tuổi nhất', group: 'logic', level: 2, example: 'She is the youngest.', exampleVi: 'Cô ấy nhỏ tuổi nhất.' },
    { id: 'sticker', en: 'sticker', vi: 'hình dán', emoji: '🌟', group: 'life', level: 2, example: 'I have 10 stickers.', exampleVi: 'Tôi có 10 hình dán.' },

    // Từ vựng Level 3 (Bài toán 2 bước)
    { id: 'sell', en: 'sell', vi: 'bán', group: 'life', level: 3, example: 'They sell pens.', exampleVi: 'Họ bán bút.' },
    { id: 'receive', en: 'receive', vi: 'nhận', group: 'life', level: 3, example: 'Receive a gift.', exampleVi: 'Nhận một món quà.' },
    { id: 'pack', en: 'pack', vi: 'đóng gói', group: 'life', level: 3, example: 'Pack the books.', exampleVi: 'Đóng gói sách.' },
    { id: 'equal', en: 'equal', vi: 'bằng nhau', group: 'operation', level: 3, example: 'Equal parts.', exampleVi: 'Các phần bằng nhau.' },
    { id: 'remain', en: 'remain', vi: 'còn lại', group: 'operation', level: 3, example: 'How many remain?', exampleVi: 'Còn lại bao nhiêu?' },

    // Từ vựng Hình học không gian 3D (Level 4 & 5)
    { id: 'cube', en: 'cube', vi: 'khối lập phương', emoji: '🧊', group: 'shape', level: 4, example: 'A cube has 6 square faces.', exampleVi: 'Khối lập phương có 6 mặt hình vuông.' },
    { id: 'solid', en: 'solid', vi: 'khối đặc / hình khối', emoji: '📦', group: 'shape', level: 5, example: 'A solid 3D figure.', exampleVi: 'Một khối hình 3 chiều đặc.' },
    { id: 'layer', en: 'layer', vi: 'tầng / lớp', emoji: '🥞', group: 'shape', level: 4, example: 'Count the cubes layer by layer.', exampleVi: 'Đếm các khối lập phương theo từng tầng.' },
    { id: 'column', en: 'column', vi: 'cột (thẳng đứng)', emoji: '🏛️', group: 'shape', level: 4, example: 'The tallest column has 3 cubes.', exampleVi: 'Cột cao nhất có 3 khối lập phương.' },
    { id: 'height', en: 'height', vi: 'chiều cao', emoji: '📏', group: 'shape', level: 4, example: 'What is the height of the column?', exampleVi: 'Chiều cao của cột là bao nhiêu?' },
    { id: 'hidden', en: 'hidden', vi: 'bị che khuất', emoji: '🙈', group: 'logic', level: 5, example: 'Some cubes are hidden behind.', exampleVi: 'Một số khối bị che khuất ở phía sau.' },
]