import { Component, ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style= {{ padding: '50px', textAlign: 'center', fontFamily: 'Nunito, sans-serif' }
        }>
            <h1>Ối! Đã có lỗi xảy ra 😢</h1>
                < p > Nhấn nút bên dưới để tải lại nhé.</p>
                    < button onClick = {() => window.location.reload()
    } style = {{ marginTop: '20px', padding: '10px 20px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Tải lại trang
            </button>
            </div>
            )
        }
return this.props.children
    }
}