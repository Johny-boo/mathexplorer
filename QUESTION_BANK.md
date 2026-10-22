# MATH EXPLORER — QUESTION BANK (v1.0)
> **Ngày tạo:** 22/10/2026
> **Nguồn dữ liệu:** 7 đề thi quốc tế (CREST Sample, CREST 2023-24, PIMSO 2025, TIMO Round 1-4)
> **Tổng số dạng:** 45 dạng bài
> **Trạng thái:** 🔴 Chưa có · 🟡 Đang làm · ✅ Đã có

---

## CÁCH ĐỌC TÀI LIỆU

- **Mã dạng:** `[Số nhóm].[Số thứ tự]` (VD: `1.1` = dạng 1 nhóm 1)
- **Ví dụ:** Lấy từ đề gốc, kèm đáp án đúng
- **Cách giải:** Phương pháp tư duy (dùng để viết explanation)
- **Ưu tiên:** `P0` (làm ngay) · `P1` (làm tiếp) · `P2` (làm sau) · `P3` (để tương lai)

---

## NHÓM 1: NUMBER SENSE (10 dạng)

### [1.1] Number Name (2-3 chữ số) — ✅
- **Mô tả:** Đọc số thành chữ hoặc ngược lại.
- **Ví dụ:** 973 = "Nine hundred and seventy-three" (CREST Q12)
- **Cách giải:** Đọc hàng trăm → "hundred" → "and" (nếu có) → hàng chục/đơn vị.
- **Trạng thái:** Có trong `englishQuestions.ts` topic `number` (mới hỗ trợ 2 chữ số).

### [1.2] Place Value Tricky — 🔴
- **Mô tả:** Hỏi số hàng chục/đơn vị theo cách "bẫy".
- **Ví dụ:** 956 = ? tens ? ones → **95 tens 6 ones** (CREST 2023 Q5)
- **Cách giải:** `956 = 95 × 10 + 6`. Trẻ hay nhầm 9 tens 6 ones.
- **Ưu tiên:** P2

### [1.3] Reverse Place Value — 🔴
- **Mô tả:** "7 hundreds 4 ones = ?" → 704.
- **Ví dụ:** CREST 2023 Q19
- **Cách giải:** Ghép hàng trăm → 0 chục → hàng đơn vị.
- **Ưu tiên:** P2

### [1.4] Number Properties (largest/smallest) — 🟡
- **Mô tả:** Tìm số lớn nhất/nhỏ nhất thỏa mãn điều kiện.
- **Ví dụ:** "Largest 3-digit even + smallest 3-digit odd" (PIMSO Q23).
- **Cách giải:** Liệt kê có điều kiện, không lặp chữ số.
- **Ưu tiên:** P2

### [1.5] Expression Comparison — 🔴
- **Mô tả:** So sánh 4 biểu thức hàng trăm/chục.
- **Ví dụ:** "7 hundreds 4 tens - 4 hundreds 15 tens" (CREST 2023 Q26).
- **Cách giải:** Đổi hết về đơn vị, so sánh.
- **Ưu tiên:** P3

### [1.6] Arithmetic Series (tính nhanh) — 🔴
- **Mô tả:** Cộng dãy số có quy luật.
- **Ví dụ:** `1+3+5+...+15` (TIMO R1 Q6) → ghép cặp.
- **Cách giải:** Cặp `(đầu+cuối)`, `(gần đầu + gần cuối)`... → nhân với số cặp.
- **Ưu tiên:** **P0**

### [1.7] Fibonacci Sequence — 🔴
- **Mô tả:** Dãy Fibonacci, tính tổng hoặc số hạng.
- **Ví dụ:** `1,1,2,3,5,8,13,21` — tổng 8 số đầu = 54 (TIMO R1 Q10).
- **Cách giải:** Nhận diện quy luật "số sau = tổng 2 số trước".
- **Ưu tiên:** **P1**

### [1.8] Parity Counting — 🔴
- **Mô tả:** Đếm số chẵn/lẻ trong khoảng.
- **Ví dụ:** "Từ 1-99 có bao nhiêu số KHÔNG phải số lẻ?" (PIMSO Q26) → 49.
- **Cách giải:** Chia đôi khoảng.
- **Ưu tiên:** P2

### [1.9] Constrained Number Construction — 🔴
- **Mô tả:** Lập số từ các chữ số cho trước, không lặp.
- **Ví dụ:** "Lớn nhất có 4 chữ số từ 2,4,6,8" = 8642 (TIMO R3 Q22).
- **Cách giải:** Sắp xếp giảm dần / tăng dần.
- **Ưu tiên:** P2

### [1.10] Counting with Condition — 🔴
- **Mô tả:** Đếm số thỏa mãn điều kiện phức tạp.
- **Ví dụ:** "Có bao nhiêu số 3 chữ số mà hàng đơn vị < 5?" (TIMO R3 Q14) → 450.
- **Cách giải:** `9 × 10 × 5`.
- **Ưu tiên:** P3

---

## NHÓM 2: COMPUTATION & EQUATIONS (5 dạng)

### [2.1] Basic Add/Sub — ✅
- **Mô tả:** Cộng/trừ cơ bản 1-3 chữ số.
- **Ví dụ:** Nhiều đề.
- **Trạng thái:** Đã có (`topic: addsub`).

### [2.2] Basic Mul/Div — ✅
- **Mô tả:** Nhân/chia bảng cửu chương.
- **Trạng thái:** Đã có (`topic: muldiv`).

### [2.3] Equation Both Sides — 🟡
- **Mô tả:** Phương trình có biến cả 2 vế.
- **Ví dụ:** `135 + 48 + x = 534 - 123 + 42` (CREST Q14).
- **Cách giải:** Tính 2 vế đã biết, tìm x.
- **Trạng thái:** Có dạng tương tự trong `cryptarithm` (dùng chữ thay số).

### [2.4] Equation Unknown Both Sides — 🔴
- **Mô tả:** Biến ở cả 2 vế.
- **Ví dụ:** `M + M + M + 114 = 30 + 10×M` (PIMSO Q5).
- **Cách giải:** Gom M về 1 vế.
- **Ưu tiên:** P3

### [2.5] Fill Operators (+, ×) — 🔴
- **Mô tả:** Điền dấu để được đẳng thức đúng.
- **Ví dụ:** `1 _ 1 _ 4 _ 4 _ 5 = 23` (TIMO R3 Q15) → `1+1+4×4+5`.
- **Cách giải:** Thử tổ hợp dấu.
- **Ưu tiên:** **P2**

---

## NHÓM 3: LOGIC & POSITION (5 dạng)

### [3.1] Day Calculation (before/after) — 🔴
- **Mô tả:** Tính thứ trong tuần từ hôm nay/ngày kia/hôm qua.
- **Ví dụ:** "Nếu ngày kia là thứ Tư, 5 ngày nữa là thứ mấy?" (TIMO R1/R3/R4).
- **Cách giải:** Vẽ trục thời gian, cộng/trừ ngày.
- **Ưu tiên:** **P0**

### [3.2] Position in Line — 🟡
- **Mô tả:** Xếp hàng, tìm vị trí từ trước/sau.
- **Ví dụ:** "30 em xếp hàng, Alice thứ 11 từ trước. Từ sau là?" (TIMO R3 Q3) → 20.
- **Cách giải:** `Tổng - Vị trí + 1`.
- **Ưu tiên:** P1

### [3.3] Age Calculation — 🔴
- **Mô tả:** Bài toán tuổi tác.
- **Ví dụ:** "Dan 6 tuổi cách đây 3 năm. 2 năm nữa?" (TIMO R1 Q4) → 11.
- **Cách giải:** `Tuổi hiện tại = tuổi cũ + số năm`, `Tuổi tương lai = hiện tại + số năm`.
- **Ưu tiên:** **P2**

### [3.4] Classmate Count — 🔴
- **Mô tả:** Đếm bạn cùng lớp (loại trừ bản thân).
- **Ví dụ:** "Lớp có 5 trai, 6 gái. Hỏi Michael có mấy bạn?" (TIMO R1 Q1) → 10.
- **Cách giải:** `Tổng - 1` (loại bản thân).
- **Ưu tiên:** P3

### [3.5] Swap Position — ✅
- **Mô tả:** Đổi chỗ 2 nhân vật, hỏi vị trí mới.
- **Trạng thái:** Đã có trong `topic: logic` (`peopleLine` visual).

---

## NHÓM 4: PATTERN (4 dạng)

### [4.1] Arithmetic Sequence (step) — ✅
- **Mô tả:** Dãy cộng/trừ đều.
- **Trạng thái:** Đã có (`topic: pattern`).

### [4.2] Alternating Sequence — 🔴
- **Mô tả:** Dãy xen kẽ 2 quy luật.
- **Ví dụ:** `50, 3, 45, 6, 40, 9, 35, 12, ?` (TIMO R1 Q5) → 30.
- **Cách giải:** Tách 2 dãy (vị trí lẻ, vị trí chẵn).
- **Ưu tiên:** **P2**

### [4.3] Letter Sequence — 🔴
- **Mô tả:** Dãy chữ cái.
- **Ví dụ:** `A, Z, B, Y, C, X, D, W, ?` (TIMO R2 Q2) → Y.
- **Cách giải:** Nhận ra 2 dãy đan xen (tăng/giảm).
- **Ưu tiên:** P3

### [4.4] Visual Pattern — 🟡
- **Mô tả:** Dãy hình ảnh (bánh răng, chấm tròn).
- **Ví dụ:** PIMSO Q20 (hình vuông 1,5,13,25,41,61).
- **Trạng thái:** Đã có component nhưng cần nâng cấp logic dãy bậc 2.

---

## NHÓM 5: GEOMETRY (8 dạng)

### [5.1] Shape Identification — ✅
- **Mô tả:** Nhận diện hình 2D/3D.
- **Trạng thái:** Đã có (`topic: geometry`).

### [5.2] Count Sides/Lines — ✅
- **Mô tả:** Đếm cạnh/đường thẳng.
- **Trạng thái:** Đã có.

### [5.3] Count Squares in Figure — 🔴
- **Mô tả:** Đếm tất cả hình vuông (nhỏ + lớn).
- **Ví dụ:** Hình chữ nhật 2×6 → đếm được 17 (TIMO R3 Q16).
- **Cách giải:** Đếm từng kích thước (1×1, 2×2, 3×3...).
- **Ưu tiên:** **P1**

### [5.4] Count Triangles in Star — 🔴
- **Mô tả:** Đếm tam giác trong ngôi sao 5 cánh.
- **Ví dụ:** TIMO R1 Q18 → 10 tam giác.
- **Cách giải:** Đếm từng loại (nhỏ, vừa, lớn).
- **Ưu tiên:** P2

### [5.5] View from Top/Side (3D) — 🔴
- **Mô tả:** Nhìn khối 3D từ trên/side, đếm ô vuông thấy được.
- **Ví dụ:** TIMO R1 Q17, R2 Q17, R3 Q19, R4 Q19.
- **Cách giải:** Projection - chiếu hình.
- **Ưu tiên:** **P0** (SVG isometric)

### [5.6] Max Lines from N Points — 🔴
- **Mô tả:** N điểm tạo tối đa bao nhiêu đường thẳng.
- **Ví dụ:** 6 điểm → 15 đường (PIMSO Q20).
- **Cách giải:** `N × (N-1) / 2`.
- **Ưu tiên:** P2

### [5.7] Max Squares from N Lines — 🔴
- **Mô tả:** N đường tạo tối đa bao nhiêu hình vuông.
- **Ví dụ:** 6 đường → 5 hình (TIMO R1 Q19).
- **Cách giải:** 4 đường vuông góc + 2 đường giữa → 4 nhỏ + 1 lớn.
- **Ưu tiên:** P3

### [5.8] Shape Composition — 🔴
- **Mô tả:** Hình nào được dùng để vẽ bức tranh.
- **Ví dụ:** "Hình nào được dùng để vẽ robot?" (CREST Q31).
- **Cách giải:** Liệt kê các hình có trong ảnh.
- **Ưu tiên:** P2

---

## NHÓM 6: MEASUREMENT & MONEY (5 dạng)

### [6.1] Read Ruler/Clock/Thermometer — ✅
- **Trạng thái:** Đã có.

### [6.2] Balance Scale (single) — ✅
- **Trạng thái:** Đã có (`topic: algebra` visual balance).

### [6.3] Balance Scale (chain 3) — 🔴
- **Mô tả:** 3 cái cân liên tiếp, sắp xếp thứ tự.
- **Ví dụ:** CREST Q27, Q32.
- **Cách giải:** Xâu chuỗi quan hệ: A > B, B > C → A > B > C.
- **Ưu tiên:** **P1**

### [6.4] Coin Combination — 🔴
- **Mô tả:** Với các đồng xu cho trước, mua được bao nhiêu giá trị.
- **Ví dụ:** "5×$1 + 4×$2 + 5×$5" (TIMO R4 Q25) → 38.
- **Cách giải:** Liệt kê các tổng có thể.
- **Ưu tiên:** **P2**

### [6.5] Shopping Change — 🔴
- **Mô tả:** Mua đồ, tính tiền thừa.
- **Ví dụ:** "23 đô, mua 7 bánh × 2 đô" (TIMO R2 Q5) → 9 đô.
- **Cách giải:** Tổng chi = số lượng × đơn giá, thừa = tổng - chi.
- **Ưu tiên:** P2

---

## NHÓM 7: COMBINATORICS (4 dạng)

### [7.1] Choose K from N — 🔴
- **Mô tả:** Tổ hợp chập K.
- **Ví dụ:** "Chọn 2 từ 10 em, có mấy cách?" (TIMO R4 Q23) → 45.
- **Cách giải:** `N × (N-1) / 2`.
- **Ưu tiên:** **P0**

### [7.2] Multiplication Principle — 🔴
- **Mô tả:** Đếm số cách kết hợp.
- **Ví dụ:** "3 routes home→school, 4 routes school→park" (PIMSO Q28) → 12.
- **Cách giải:** `A × B`.
- **Ưu tiên:** P2

### [7.3] Permutation with Constraint — 🔴
- **Mô tả:** Sắp xếp có điều kiện.
- **Ví dụ:** "Passcode 4 số từ 7,1,6,3, bắt đầu chẵn" (PIMSO Q27) → 6.
- **Cách giải:** Chọn vị trí đặc biệt trước, sau đó hoán vị.
- **Ưu tiên:** P2

### [7.4] Distribute Identical Objects — 🔴
- **Mô tả:** Chia vật giống nhau vào hộp khác nhau (không rỗng).
- **Ví dụ:** "6 hoa vào 3 lọ, không lọ nào trống" (TIMO R1 Q24) → 10.
- **Cách giải:** Liệt kê: 1+1+4, 1+2+3, 2+2+2...
- **Ưu tiên:** P3

---

## NHÓM 8: ADVANCED (4 dạng)

### [8.1] Cryptarithm — ✅
- **Trạng thái:** Đã có (`topic: cryptarithm`).

### [8.2] Visual Algebra (balance with unknown) — ✅
- **Trạng thái:** Đã có (`topic: algebra` visual equation).

### [8.3] Magic Square (3×3) — 🔴
- **Mô tả:** Ma trận 3×3, tổng hàng/cột bằng nhau.
- **Ví dụ:** TIMO R2 Q25.
- **Cách giải:** Tổng dãy = `9×(1+9)/2 = 45`, mỗi hàng = 15.
- **Ưu tiên:** **P1**

### [8.4] Distance (multi-step, filter) — 🟡
- **Trạng thái:** Đã có dạng cơ bản, cần nâng cấp filter (chỉ hỏi cycle, không hỏi walk).

---

## SPRINT PLAN — 13 DẠNG ƯU TIÊN P0 + P1

### P0 (4 dạng — làm trước, ước tính 3 ngày)
| # | Dạng | Ghi chú |
|---|------|---------|
| 1.6 | Arithmetic Series | Logic đơn giản, không cần visual |
| 3.1 | Day Calculation | Logic tuần tự |
| 5.5 | View from Top/Side | Cần SVG 3D isometric |
| 7.1 | Choose K from N | Công thức + liệt kê |

### P1 (4 dạng — làm tiếp, ước tính 3 ngày)
| # | Dạng | Ghi chú |
|---|------|---------|
| 1.7 | Fibonacci | Logic dãy |
| 5.3 | Count Squares in Figure | SVG grid + công thức đếm |
| 6.3 | Balance Scale (chain) | SVG 3 cái cân |
| 8.3 | Magic Square (3×3) | SVG grid + logic tổng 15 |

### P2 (5 dạng — bổ sung sau, ước tính 2 ngày)
| # | Dạng | Ghi chú |
|---|------|---------|
| 2.5 | Fill Operators | Logic thử tổ hợp |
| 3.3 | Age Calculation | Word problem |
| 3.2 | Position in Line | Đã có nền tảng |
| 4.2 | Alternating Sequence | Tách 2 dãy |
| 6.4 | Coin Combination | Liệt kê |

### Tổng: 13 dạng mới
- **Mapping topic:** Tất cả sẽ thuộc các topic hiện có (number, logic, geometry, algebra, pattern) hoặc tạo topic mới (arithmetic_series, day_calc, combinatorics).
- **Thời gian ước tính:** 8 ngày làm việc.

---

## CHECKLIST TRIỂN KHAI

- [ ] Tạo file `QUESTION_BANK.md` (đang làm)
- [ ] Cập nhật `types.ts` — thêm `QuestionVisual` mới nếu cần
- [ ] Code 4 dạng P0 → test
- [ ] Code 4 dạng P1 → test
- [ ] Code 5 dạng P2 → test
- [ ] QC pass → push GitHub