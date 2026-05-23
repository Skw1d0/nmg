export default function useOpenWebsites() {
    function openAPN(ds100: string | undefined): void {
        if (!ds100) return;

        const link = document.createElement("a");
        link.href = `https://trassenfinder.de/apn/${ds100}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();

        // window.open(`https://trassenfinder.de/apn/${ds100}`, "_blank");
    }

    function openOpenrailwaymaps(lat: number | undefined, lon: number | undefined): void {
        if (!lat || !lon) return;

        const link = document.createElement("a");
        link.href = `https://www.openrailwaymap.org/?lat=${lat}&lon=${lon}&zoom=16`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
        // window.open(
        //     `https://www.openrailwaymap.org/?lat=${lat}&lon=${lon}&zoom=16`,
        //     "_blank"
        // );
    }

    function openGoogleMaps(
        lat: number | undefined,
        lon: number | undefined
    ) {
        if (!lat || !lon) return;

        const link = document.createElement("a");
        link.href = `https://maps.google.com/maps?q=${lat},${lon}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();

        // window.open(`https://maps.google.com/maps?q=${lat},${lon}`, "_blank");
    }

    return {openAPN, openOpenrailwaymaps, openGoogleMaps}
}

