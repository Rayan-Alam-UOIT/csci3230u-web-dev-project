function DataStatus({ status, onRetry, loadingText = "Loading Pokémon…" }) {
    if (status === "loading") {
        return (
        <section className="empty-state-area" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>{loadingText}</p>
        </section>
        );
    }
    
    if (status === "error") {
        return (
        <section className="empty-state-area" role="alert">
            <p>Sorry, we couldn't load Pokémon data. Please check your connection and try again.</p>
            <button type="button" onClick={onRetry}>Try again</button>
        </section>
        );
    }
    
    return null;
}

export default DataStatus;