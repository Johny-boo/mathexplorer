let preferredVoice: SpeechSynthesisVoice | null = null

export function isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Lắng nghe và chọn giọng đọc tiếng Anh tốt nhất
if (isSpeechSupported()) {
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        // Ưu tiên en-US, nếu không có thì lấy bất kỳ giọng en-* nào
        preferredVoice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
}

export function speak(text: string, level: number = 1) {
    if (!isSpeechSupported()) return

    window.speechSynthesis.cancel() // Hủy âm thanh đang đọc dở (nếu có)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'

    // Tốc độ đọc tăng dần theo Level (0.75 -> 1.0)
    const rates = [0.75, 0.8, 0.85, 0.9, 1.0]
    utterance.rate = rates[Math.max(0, Math.min(level - 1, 4))] || 0.85

    if (preferredVoice) {
        utterance.voice = preferredVoice
    }

    window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
    if (isSpeechSupported()) {
        window.speechSynthesis.cancel()
    }
}