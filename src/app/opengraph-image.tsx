import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Vibe-OS Portfolio';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#F3E5AB', // Manila
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    border: '20px solid #5B92E5', // Cadet
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid #36454F', // Charcoal
                        padding: '40px 80px',
                        background: '#FFFFFF',
                        boxShadow: '10px 10px 0px 0px #36454F',
                    }}
                >
                    <h1
                        style={{
                            fontSize: 60,
                            color: '#36454F',
                            marginBottom: 20,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}
                    >
                        Vibe-OS
                    </h1>
                    <div
                        style={{
                            background: '#36454F',
                            color: '#F3E5AB',
                            padding: '10px 20px',
                        }}
                    >
                        AIO | Portfolio
                    </div>
                    <div
                        style={{
                            marginTop: 40,
                            fontSize: 16,
                            color: '#8A9A5B', // Sage
                        }}
                    >
                        [SYSTEM READY]
                    </div>
                </div>
            </div >
        ),
        {
            ...size,
        }
    );
}
