import type { QuestionVisual } from '../types'
import { numberOptions } from '../englishDistractors'

export type SpatialBlockConfig = {
    id: string
    nameEn: string
    nameVi: string
    layout: number[][]
    targetCuboid?: { x: number; y: number; z: number }
    recommendedTheme?: 'blue' | 'emerald' | 'amber' | 'purple' | 'multi' | 'rose'
}

export const SPATIAL_CONFIGS: SpatialBlockConfig[] = [
    // 1. Cầu thang 3 bậc chéo
    {
        id: 'staircase_diagonal',
        nameEn: '3-tier diagonal staircase',
        nameVi: 'Cầu thang 3 bậc chéo',
        layout: [
            [3, 2, 1],
            [2, 1, 0],
            [1, 0, 0]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'multi'
    },
    // 2. Bậc thang đôi 2 hàng
    {
        id: 'double_staircase',
        nameEn: 'Double-row staircase',
        nameVi: 'Cầu thang đôi 2 hàng',
        layout: [
            [1, 2, 3],
            [1, 2, 3]
        ],
        targetCuboid: { x: 3, y: 2, z: 3 },
        recommendedTheme: 'blue'
    },
    // 3. Tháp góc chữ L (Corner L-Tower)
    {
        id: 'corner_L_tower',
        nameEn: 'L-shaped corner tower',
        nameVi: 'Tháp góc chữ L',
        layout: [
            [3, 2, 1],
            [2, 0, 0],
            [1, 0, 0]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'amber'
    },
    // 4. Giếng trời rỗng tâm (Courtyard well)
    {
        id: 'courtyard_well',
        nameEn: 'Hollow courtyard well',
        nameVi: 'Giếng trời rỗng tâm',
        layout: [
            [2, 1, 2],
            [1, 0, 1],
            [2, 1, 2]
        ],
        targetCuboid: { x: 3, y: 3, z: 2 },
        recommendedTheme: 'emerald'
    },
    // 5. Dấu cộng 3D cân đối
    {
        id: 'cross_3d',
        nameEn: '3D symmetrical cross',
        nameVi: 'Dấu cộng 3D đối xứng',
        layout: [
            [0, 1, 0],
            [1, 3, 1],
            [0, 1, 0]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'purple'
    },
    // 6. Tháp chữ thập lớn
    {
        id: 'cross_tower_large',
        nameEn: 'Cross tower platform',
        nameVi: 'Tháp chữ thập lớn',
        layout: [
            [0, 2, 0],
            [2, 3, 2],
            [0, 2, 0]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'multi'
    },
    // 7. Cổng vòm chữ U (U-arch)
    {
        id: 'u_arch',
        nameEn: 'U-shaped arch',
        nameVi: 'Cổng chữ U',
        layout: [
            [3, 0, 3],
            [2, 0, 2],
            [1, 1, 1]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'blue'
    },
    // 8. Tượng đài chữ T (T-monolith)
    {
        id: 't_monolith',
        nameEn: 'T-shaped monument',
        nameVi: 'Khối đài chữ T',
        layout: [
            [2, 2, 2],
            [0, 2, 0],
            [0, 1, 0]
        ],
        targetCuboid: { x: 3, y: 3, z: 2 },
        recommendedTheme: 'amber'
    },
    // 9. Kim tự tháp giật cấp (Stepped pyramid)
    {
        id: 'stepped_pyramid',
        nameEn: 'Stepped pyramid',
        nameVi: 'Kim tự tháp giật cấp',
        layout: [
            [1, 1, 1],
            [1, 3, 1],
            [1, 1, 1]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'multi'
    },
    // 10. Kim tự tháp góc (Corner Ziggurat)
    {
        id: 'corner_ziggurat',
        nameEn: 'Corner stepped ziggurat',
        nameVi: 'Tháp tầng giật cấp góc',
        layout: [
            [1, 1, 1],
            [1, 2, 2],
            [1, 2, 3]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'emerald'
    },
    // 11. Bục vinh quang 1-2-3 (Podium)
    {
        id: 'podium_stage',
        nameEn: 'Podium blocks',
        nameVi: 'Bục vinh quang xếp tầng',
        layout: [
            [2, 3, 1],
            [2, 3, 1]
        ],
        targetCuboid: { x: 3, y: 2, z: 3 },
        recommendedTheme: 'amber'
    },
    // 12. Bậc ziczac (Zigzag steps)
    {
        id: 'zigzag_steps',
        nameEn: 'Zigzag steps',
        nameVi: 'Bậc lượn ziczac',
        layout: [
            [3, 1, 0],
            [0, 2, 1],
            [0, 0, 2]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'purple'
    },
    // 13. Khối 3x3x3 khuyết 8 khối (Kangaroo classic)
    {
        id: 'hollow_cube_missing',
        nameEn: 'Incomplete 3x3x3 cube',
        nameVi: 'Khối lập phương khuyết',
        layout: [
            [3, 3, 2],
            [3, 1, 2],
            [2, 2, 1]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'blue'
    },
    // 14. Lâu đài 4 góc trụ (Castle towers)
    {
        id: 'castle_towers',
        nameEn: 'Castle with 4 corner pillars',
        nameVi: 'Lâu đài 4 tháp canh góc',
        layout: [
            [3, 1, 3],
            [1, 1, 1],
            [2, 1, 2]
        ],
        targetCuboid: { x: 3, y: 3, z: 3 },
        recommendedTheme: 'multi'
    },
    // 15. Bục góc 2x2 (2x2 solid corner)
    {
        id: 'corner_2x2_block',
        nameEn: 'Stepped 2x2 platform',
        nameVi: 'Bục góc 2x2 giật bậc',
        layout: [
            [3, 2],
            [2, 1]
        ],
        targetCuboid: { x: 2, y: 2, z: 3 },
        recommendedTheme: 'rose'
    },
    // 16. Khối chữ H nằm ngang
    {
        id: 'h_bridge',
        nameEn: 'Bridge platform',
        nameVi: 'Cầu nối chữ H',
        layout: [
            [2, 1, 2],
            [0, 1, 0],
            [2, 1, 2]
        ],
        targetCuboid: { x: 3, y: 3, z: 2 },
        recommendedTheme: 'emerald'
    }
]

// Tính toán các thông số chuẩn xác cho từng khối
export function calculateSpatialStats(layout: number[][]) {
    const rows = layout.length
    const cols = layout[0]?.length || 0
    let totalCubes = 0
    let maxHeight = 0
    let topViewSquares = 0
    let bottomLayerCubes = 0
    const layerCounts: Record<number, number> = {}

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const h = layout[r][c]
            totalCubes += h
            if (h > maxHeight) maxHeight = h
            if (h > 0) {
                topViewSquares++
                bottomLayerCubes++
            }
            for (let z = 0; z < h; z++) {
                layerCounts[z] = (layerCounts[z] || 0) + 1
            }
        }
    }

    // Đếm số khối bị ẩn hoàn toàn (0 mặt nhìn thấy từ góc isometric)
    // Một khối tại (r, c, z) bị ẩn nếu:
    // - Mặt trên bị che: z + 1 < layout[r][c]
    // - Mặt trái (row + 1) bị che: r + 1 < rows && layout[r + 1][c] > z
    // - Mặt phải (col + 1) bị che: c + 1 < cols && layout[r][c + 1] > z
    let hiddenCubes = 0
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const h = layout[r][c]
            for (let z = 0; z < h; z++) {
                const topCovered = z + 1 < h
                const leftCovered = r + 1 < rows && layout[r + 1][c] > z
                const rightCovered = c + 1 < cols && layout[r][c + 1] > z
                if (topCovered && leftCovered && rightCovered) {
                    hiddenCubes++
                }
            }
        }
    }

    return {
        rows,
        cols,
        totalCubes,
        maxHeight,
        topViewSquares,
        bottomLayerCubes,
        hiddenCubes,
        layerCounts
    }
}

export type GeneratedSpatialQuestion = {
    prompt: string
    promptVi: string
    audioText: string
    answer: string
    options: string[]
    explanation: string[]
    explanationVi: string[]
    vocab: string[]
    visual: QuestionVisual
}

export function generateSpatialQuestion(): GeneratedSpatialQuestion {
    const config = SPATIAL_CONFIGS[Math.floor(Math.random() * SPATIAL_CONFIGS.length)]
    const stats = calculateSpatialStats(config.layout)
    const { totalCubes, maxHeight, topViewSquares, bottomLayerCubes, hiddenCubes } = stats

    // Danh sách các dạng bài toán thi quốc tế (Kangaroo Math, SASMO, AMC 8, TIMO)
    type QuestionKind =
        | 'total_cubes'
        | 'complete_3x3_cube'
        | 'complete_cuboid'
        | 'top_view'
        | 'hidden_cubes'
        | 'bottom_layer'
        | 'highest_layer'
        | 'tallest_pillar'

    const availableKinds: QuestionKind[] = ['total_cubes', 'top_view', 'bottom_layer', 'tallest_pillar']

    // Nếu cấu trúc có thể hoàn thành thành 3x3x3
    if (config.targetCuboid?.x === 3 && config.targetCuboid?.y === 3 && config.targetCuboid?.z === 3 && totalCubes < 27) {
        availableKinds.push('complete_3x3_cube')
    }

    // Nếu có khối hộp mục tiêu khác
    if (config.targetCuboid && !(config.targetCuboid.x === 3 && config.targetCuboid.y === 3 && config.targetCuboid.z === 3)) {
        availableKinds.push('complete_cuboid')
    }

    // Nếu có khối bị che khuất
    if (hiddenCubes > 0) {
        availableKinds.push('hidden_cubes')
    }

    if (maxHeight >= 2) {
        availableKinds.push('highest_layer')
    }

    const kind = availableKinds[Math.floor(Math.random() * availableKinds.length)]

    let prompt = ''
    let promptVi = ''
    let audioText = ''
    let answer = ''
    let options: string[] = []
    let explanation: string[] = []
    let explanationVi: string[] = []
    const vocab: string[] = ['shape', 'cube']

    const visualTheme = config.recommendedTheme || 'multi'
    let visualSubtitle: string | undefined = undefined
    let targetCuboidVisual: { x: number; y: number; z: number } | undefined = undefined

    // 1. Đếm tổng số khối lập phương (Total cubes)
    if (kind === 'total_cubes') {
        prompt = `How many unit cubes are there in this figure?`
        promptVi = `Có bao nhiêu khối lập phương đơn vị tạo thành hình khối này?`
        audioText = `How many cubes are there in this figure?`
        answer = String(totalCubes)
        options = numberOptions(totalCubes, [totalCubes + 1, totalCubes - 1, totalCubes + 2, totalCubes - 2], 1, 40)
        explanation = [
            `🔍 Step 1: Count the cubes column by column or layer by layer.`,
            `🧠 Step 2: Sum the heights of all columns: ${config.layout.flat().filter(v => v > 0).join(' + ')}.`,
            `🎯 Step 3: Total is ${totalCubes} cubes.`
        ]
        explanationVi = [
            `🔍 Bước 1: Đếm số khối theo từng cột hoặc từng tầng.`,
            `🧠 Bước 2: Cộng chiều cao các cột: ${config.layout.flat().filter(v => v > 0).join(' + ')}.`,
            `🎯 Bước 3: Tổng cộng có ${totalCubes} khối lập phương.`
        ]
        visualSubtitle = `Cấu trúc: ${config.nameVi}`
    }

    // 2. Cần thêm bao nhiêu khối để tạo thành khối 3x3x3 hoàn chỉnh (Kangaroo & SASMO)
    else if (kind === 'complete_3x3_cube') {
        const targetVol = 27
        const needed = targetVol - totalCubes
        prompt = `How many more cubes are needed to complete a solid 3 × 3 × 3 cube?`
        promptVi = `Cần thêm bao nhiêu khối lập phương nhỏ nữa để tạo thành một khối lập phương lớn 3 × 3 × 3 đặc hoàn chỉnh?`
        audioText = `How many more cubes are needed to make a 3 by 3 by 3 cube?`
        answer = String(needed)
        options = numberOptions(needed, [needed + 1, needed - 1, needed + 2, needed + 3], 1, 26)
        explanation = [
            `🔍 Step 1: A complete 3 × 3 × 3 cube has 3 × 3 × 3 = 27 unit cubes.`,
            `🧠 Step 2: The current figure currently contains ${totalCubes} cubes.`,
            `🎯 Step 3: Subtract to find the missing cubes: 27 - ${totalCubes} = ${needed} cubes.`
        ]
        explanationVi = [
            `🔍 Bước 1: Khối lập phương lớn 3 × 3 × 3 gồm 3 × 3 × 3 = 27 khối nhỏ.`,
            `🧠 Bước 2: Khối hình hiện tại đang có ${totalCubes} khối.`,
            `🎯 Bước 3: Số khối còn thiếu cần bù thêm: 27 - ${totalCubes} = ${needed} khối.`
        ]
        vocab.push('solid')
        visualSubtitle = `Mục tiêu: Khối 3 × 3 × 3 (27 khối)`
        targetCuboidVisual = { x: 3, y: 3, z: 3 }
    }

    // 3. Cần thêm bao nhiêu khối để tạo thành khối hộp chữ nhật (Complete cuboid)
    else if (kind === 'complete_cuboid') {
        const tgt = config.targetCuboid || { x: 3, y: 3, z: 3 }
        const targetVol = tgt.x * tgt.y * tgt.z
        const needed = targetVol - totalCubes
        const dimStr = `${tgt.x} × ${tgt.y} × ${tgt.z}`
        prompt = `How many more cubes are needed to make a solid ${dimStr} rectangular block?`
        promptVi = `Cần thêm bao nhiêu khối lập phương nữa để tạo thành khối hộp chữ nhật đặc ${dimStr}?`
        audioText = `How many more cubes are needed to make a solid ${tgt.x} by ${tgt.y} by ${tgt.z} block?`
        answer = String(needed)
        options = numberOptions(needed, [needed + 1, needed - 1, needed + 2, needed - 2], 1, targetVol)
        explanation = [
            `🔍 Step 1: A solid ${dimStr} block contains ${tgt.x} × ${tgt.y} × ${tgt.z} = ${targetVol} cubes.`,
            `🧠 Step 2: The current structure has ${totalCubes} cubes.`,
            `🎯 Step 3: ${targetVol} - ${totalCubes} = ${needed} more cubes are required.`
        ]
        explanationVi = [
            `🔍 Bước 1: Khối hộp chữ nhật đặc ${dimStr} gồm ${tgt.x} × ${tgt.y} × ${tgt.z} = ${targetVol} khối.`,
            `🧠 Bước 2: Hình hiện tại đang có ${totalCubes} khối.`,
            `🎯 Bước 3: Lấy ${targetVol} - ${totalCubes} = ${needed} khối cần thêm.`
        ]
        vocab.push('solid')
        visualSubtitle = `Mục tiêu: Khối hộp ${dimStr} (${targetVol} khối)`
        targetCuboidVisual = tgt
    }

    // 4. Nhìn từ trên xuống (Top View / Bird's eye view)
    else if (kind === 'top_view') {
        prompt = `Looking directly from above (Top View), how many square faces are visible?`
        promptVi = `Nhìn thẳng từ trên cao xuống (Hình chiếu bằng), bạn sẽ nhìn thấy bao nhiêu ô vuông?`
        audioText = `Looking directly from above, how many squares can you see?`
        answer = String(topViewSquares)
        options = numberOptions(topViewSquares, [topViewSquares + 1, topViewSquares - 1, totalCubes, topViewSquares + 2], 1, 16)
        explanation = [
            `🔍 Step 1: When looking straight down from above, every column with height ≥ 1 shows exactly 1 square.`,
            `🧠 Step 2: Count the non-empty columns on the ground grid.`,
            `🎯 Step 3: Exactly ${topViewSquares} square faces are visible from above.`
        ]
        explanationVi = [
            `🔍 Bước 1: Khi nhìn thẳng từ trên xuống, mỗi cột có ít nhất 1 khối sẽ để lộ đúng 1 mặt vuông ở đỉnh.`,
            `🧠 Bước 2: Đếm số cột có khối trên mặt phẳng đáy.`,
            `🎯 Bước 3: Ta nhìn thấy đúng ${topViewSquares} ô vuông từ trên cao.`
        ]
        vocab.push('top')
        visualSubtitle = `Góc nhìn: Thẳng từ trên xuống (Top View)`
    }

    // 5. Khối bị che khuất hoàn toàn (Hidden cubes)
    else if (kind === 'hidden_cubes') {
        prompt = `Some cubes are hidden beneath or behind other cubes. How many cubes are completely hidden from this view?`
        promptVi = `Một số khối bị che khuất hoàn toàn dưới hoặc sau các khối khác. Có bao nhiêu khối bị ẩn đi từ góc nhìn này?`
        audioText = `How many cubes are completely hidden from this view?`
        answer = String(hiddenCubes)
        const visibleCubes = totalCubes - hiddenCubes
        options = numberOptions(hiddenCubes, [hiddenCubes + 1, hiddenCubes + 2, Math.max(1, hiddenCubes - 1), hiddenCubes + 3], 0, 15)
        explanation = [
            `🔍 Step 1: The total number of cubes in this figure is ${totalCubes}.`,
            `🧠 Step 2: Count the cubes you can see directly: there are ${visibleCubes} visible cubes.`,
            `🎯 Step 3: Completely hidden cubes = ${totalCubes} - ${visibleCubes} = ${hiddenCubes} cubes.`
        ]
        explanationVi = [
            `🔍 Bước 1: Tổng số khối lập phương trong hình là ${totalCubes} khối.`,
            `🧠 Bước 2: Số khối ta có thể nhìn thấy ít nhất 1 mặt là ${visibleCubes} khối.`,
            `🎯 Bước 3: Số khối bị che khuất hoàn toàn = ${totalCubes} - ${visibleCubes} = ${hiddenCubes} khối.`
        ]
        vocab.push('hidden')
        visualSubtitle = `Góc nhìn 3D Isometric`
    }

    // 6. Số khối ở tầng dưới cùng (Bottom layer)
    else if (kind === 'bottom_layer') {
        prompt = `How many cubes are on the bottom layer (ground floor)?`
        promptVi = `Có bao nhiêu khối lập phương nằm ở tầng dưới cùng (tầng 1)?`
        audioText = `How many cubes are on the bottom layer?`
        answer = String(bottomLayerCubes)
        options = numberOptions(bottomLayerCubes, [bottomLayerCubes + 1, bottomLayerCubes - 1, totalCubes, bottomLayerCubes + 2], 1, 16)
        explanation = [
            `🔍 Step 1: Every column with at least 1 cube rests on a cube at the bottom layer.`,
            `🧠 Step 2: Count all columns with height ≥ 1: there are ${bottomLayerCubes} columns.`,
            `🎯 Step 3: There are ${bottomLayerCubes} cubes on the bottom layer.`
        ]
        explanationVi = [
            `🔍 Bước 1: Mỗi cột có độ cao từ 1 trở lên đều có 1 khối nằm ở tầng đáy.`,
            `🧠 Bước 2: Đếm tất cả các vị trí cột: có ${bottomLayerCubes} cột có khối.`,
            `🎯 Bước 3: Tầng dưới cùng (tầng 1) có đúng ${bottomLayerCubes} khối.`
        ]
        vocab.push('layer')
        visualSubtitle = `Đếm số khối: Tầng 1 (đáy)`
    }

    // 7. Số khối ở tầng cao nhất (Highest layer)
    else if (kind === 'highest_layer') {
        const topLayerCount = stats.layerCounts[maxHeight - 1] || 1
        prompt = `How many cubes are on the highest layer (layer ${maxHeight})?`
        promptVi = `Có bao nhiêu khối lập phương nằm ở tầng cao nhất (tầng ${maxHeight})?`
        audioText = `How many cubes are on the highest layer?`
        answer = String(topLayerCount)
        options = numberOptions(topLayerCount, [topLayerCount + 1, topLayerCount + 2, Math.max(1, topLayerCount - 1)], 1, 10)
        explanation = [
            `🔍 Step 1: The highest columns reach height ${maxHeight}.`,
            `🧠 Step 2: Count how many columns reach this maximum height: ${topLayerCount} column(s).`,
            `🎯 Step 3: Layer ${maxHeight} has ${topLayerCount} cube(s).`
        ]
        explanationVi = [
            `🔍 Bước 1: Chiều cao lớn nhất của khối hình là tầng ${maxHeight}.`,
            `🧠 Bước 2: Đếm số cột đạt độ cao tầng ${maxHeight}: có ${topLayerCount} cột.`,
            `🎯 Bước 3: Tầng ${maxHeight} có đúng ${topLayerCount} khối lập phương.`
        ]
        vocab.push('layer', 'height')
        visualSubtitle = `Đếm số khối: Tầng ${maxHeight} (cao nhất)`
    }

    // 8. Cột cao nhất gồm bao nhiêu khối (Tallest column)
    else {
        prompt = `What is the height of the tallest column of cubes in this figure?`
        promptVi = `Cột cao nhất trong khối hình này gồm bao nhiêu khối lập phương?`
        audioText = `What is the height of the tallest column of cubes?`
        answer = String(maxHeight)
        options = numberOptions(maxHeight, [maxHeight + 1, Math.max(1, maxHeight - 1), maxHeight + 2], 1, 6)
        explanation = [
            `🔍 Step 1: Look at each column from ground to top.`,
            `🧠 Step 2: Find the column that reaches highest into the air.`,
            `🎯 Step 3: The tallest column has ${maxHeight} cubes stacked together.`
        ]
        explanationVi = [
            `🔍 Bước 1: Quan sát chiều cao của từng cột trong hình.`,
            `🧠 Bước 2: Tìm cột vươn cao nhất.`,
            `🎯 Bước 3: Cột cao nhất gồm ${maxHeight} khối lập phương xếp chồng lên nhau.`
        ]
        vocab.push('height', 'column')
        visualSubtitle = `Tìm chiều cao cột cao nhất`
    }

    const visual: QuestionVisual = {
        type: 'iso_blocks',
        layout: config.layout,
        colorTheme: visualTheme,
        subtitle: visualSubtitle,
        targetCuboid: targetCuboidVisual,
        showGridFloor: true
    }

    return {
        prompt,
        promptVi,
        audioText,
        answer,
        options,
        explanation,
        explanationVi,
        vocab,
        visual
    }
}
