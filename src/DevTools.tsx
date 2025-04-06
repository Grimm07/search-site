// DevTools.tsx

export const DevTools = () => {
    const disableMocks = () => {
        localStorage.removeItem('MOCK_MODE');
        location.reload();
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: '#eee',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            zIndex: 1000,
        }}>
            <strong>Mock Mode</strong>
            <button onClick={disableMocks} style={{ marginLeft: '1rem' }}>Disable</button>
        </div>
    );
};
