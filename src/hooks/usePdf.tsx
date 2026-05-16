import {PDFDocument, StandardFonts} from 'pdf-lib';
import useStore from "../stores/useStore.tsx"
import dayjs from "dayjs";

export function usePdf() {
    const {getEventById} = useStore()

    async function loadAndDecryptPdf(pw: string) {
        if (!window.crypto || !window.crypto.subtle) {
            console.error("Krypto-Funktionen sind nur über eine sichere Verbindung (HTTPS) verfügbar!")
            alert("Bitte rufen Sie diese Seite über HTTPS auf, um das Dokument zu entschlüsseln.")
            return false
        }

        try {
            // 1. Verschlüsselte Datei laden
            const response = await fetch(`${import.meta.env.BASE_URL}document.dat`);
            const arrayBuffer = await response.arrayBuffer();

            // 2. Komponenten extrahieren (Analog zum Node-Skript)
            const iv = arrayBuffer.slice(0, 12);
            const tag = arrayBuffer.slice(12, 28);
            const encryptedData = arrayBuffer.slice(28);

            // Web Crypto API benötigt die Daten und das Tag in einem Buffer
            const combinedData = new Uint8Array(encryptedData.byteLength + tag.byteLength);
            combinedData.set(new Uint8Array(encryptedData), 0);
            combinedData.set(new Uint8Array(tag), encryptedData.byteLength);

            // 3. Schlüssel aus Passwort generieren
            const encoder = new TextEncoder();
            const keyMaterial = await window.crypto.subtle.importKey(
                'raw', encoder.encode(pw), 'PBKDF2', false, ['deriveKey']
            );

            const key = await window.crypto.subtle.deriveKey(
                {name: 'PBKDF2', salt: encoder.encode('salz'), iterations: 100000, hash: 'SHA-256'},
                keyMaterial,
                {name: 'AES-GCM', length: 256},
                false,
                ['decrypt']
            );

            // 4. Entschlüsseln
            const decryptedBuffer = await window.crypto.subtle.decrypt(
                {name: 'AES-GCM', iv: iv, additionalData: new Uint8Array(0), tagLength: 128},
                key,
                combinedData
            );

            // 5. Blob-URL für die Anzeige erzeugen
            const blob = new Blob([decryptedBuffer], {type: 'application/pdf'});
            return URL.createObjectURL(blob);
            // console.log(pdfUrl);
            // return pdfUrl;
        } catch (err) {
            console.error(err);
            // console.log('Entschlüsselung fehlgeschlagen oder Datei nicht gefunden.');
        }
    }

    function getParticipantsIntroducedNumbers(id: string) {
        const event = getEventById(id)
        if (!event) return

        return event.measures.map((measure) => {
            return event.participants.map((participant, index) => {
                if (measure.participantsIntroduced.some((el) => el.id === participant.id)) {
                    return index + 1
                }
            }).filter((e) => e !== undefined)
        })
    }

    function getParticipantsLiftedNumbers(id: string) {
        const event = getEventById(id)
        if (!event) return

        return event.measures.map((measure) => {
            return event.participants.map((participant, index) => {
                if (measure.participantsLifted.some((el) => el.id === participant.id)) {
                    return index + 1
                }
            }).filter((e) => e !== undefined)
        })
    }

    function insertLineBreaks(text: string, maxChars: number = 45) {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word) => {
            if ((currentLine + word).length > maxChars) {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });

        if (currentLine) {
            lines.push(currentLine.trim());
        }

        // Mappe die Textzeilen in React-Elemente mit <br />
        return lines
    }


    async function generatePdf(pw: string, id: string, action: "save" | "print"): Promise<boolean> {
        const event = getEventById(id)

        try {
            // Vorlage aus dem public-Ordner laden
            const formUrl = await loadAndDecryptPdf(pw) //'/vorlage.pdf';
            if (!formUrl) {
                console.error('Pdf URL is missing')
                return false
            }
            const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

            // PDF-Dokument und dessen interaktives Formular laden
            const pdfDoc = await PDFDocument.load(formPdfBytes, {ignoreEncryption: true});
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

            const pages = pdfDoc.getPages()
            const firstPage = pages[0]
            const secondPage = pages[1]

            // const {width, height} = firstPage.getSize()

            firstPage.drawText(event?.district || "", {
                x: 145,
                y: 547,
                size: 10,
                font: helveticaFont,
            })

            firstPage.drawText(event?.eventNumber || "", {
                x: 145,
                y: 530,
                size: 10,
                font: helveticaFont,
            })

            firstPage.drawText(event?.name || "", {
                x: 290,
                y: 498,
                size: 10,
                font: helveticaFont,
            })

            firstPage.drawText(event?.initials || "", {
                x: 415,
                y: 498,
                size: 10,
                font: helveticaFont,
            })

            // Notfallmanager am Ereignisort
            firstPage.drawText(event?.onSiteFrom ? dayjs(event.onSiteFrom).format("DD.MM.YYYY / HH:mm") : "", {
                x: 475,
                y: 498,
                size: 10,
                font: helveticaFont,
            })
            firstPage.drawText(event?.onSiteUntil ? dayjs(event.onSiteUntil).format("DD.MM.YYYY / HH:mm") : "", {
                x: 590,
                y: 498,
                size: 10,
                font: helveticaFont,
            })

            // Gesamtschutzdauer
            firstPage.drawText(event?.protectionFrom ? dayjs(event.protectionFrom).format("DD.MM.YYYY / HH:mm") : "", {
                x: 90,
                y: 495,
                size: 10,
                font: helveticaFont,
            })
            firstPage.drawText(event?.protectionUntil ? dayjs(event?.protectionUntil).format("DD.MM.YYYY / HH:mm") : "", {
                x: 90,
                y: 470,
                size: 10,
                font: helveticaFont,
            })

            // Beteiligte am Ereignisort
            event?.participants.forEach((participant, index) => {
                firstPage.drawText(participant.organisation, {
                    x: 65,
                    y: 370 - (index * 22),
                    size: 10,
                    font: helveticaFont,
                })
                firstPage.drawText(participant.function, {
                    x: 205,
                    y: 370 - (index * 22),
                    size: 10,
                    font: helveticaFont,
                })
                firstPage.drawText(participant.name, {
                    x: 290,
                    y: 370 - (index * 22),
                    size: 10,
                    font: helveticaFont,
                })
                firstPage.drawText(participant.call, {
                    x: 430,
                    y: 370 - (index * 22),
                    size: 10,
                    font: helveticaFont,
                })
                firstPage.drawText(participant.from ? dayjs(participant.from).format("DD.MM.YYYY / HH:mm") : "", {
                    x: 590,
                    y: 370 - (index * 22),
                    size: 10,
                    font: helveticaFont,
                })
                firstPage.drawText(participant.until ? dayjs(participant.until).format("DD.MM.YYYY / HH:mm") : "", {
                    x: 710,
                    y: 370 - (index * 22),
                    size: 10,
                    font: helveticaFont,
                })
            })


            // Schutzmaßnahmen
            secondPage.drawText(event?.eventNumber || "", {
                x: 625,
                y: 570,
                size: 10,
                font: helveticaFont,
            })


            event?.measures.forEach((measure, index) => {
                secondPage.drawText(measure.locationFrom, {
                    x: 25,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
                secondPage.drawText(measure.locationTo, {
                    x: 125,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
                secondPage.drawText(measure.locationDetails, {
                    x: 225,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
                secondPage.drawText(measure.measure, {
                    x: 350,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
                secondPage.drawText(measure.from ? dayjs(measure.from).format("DD.MM. / HH:mm") : "", {
                    x: 410,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
                secondPage.drawText(event.initials, {
                    x: 565,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
                secondPage.drawText(measure.until ? dayjs(measure.until).format("DD.MM. / HH:mm") : "", {
                    x: 620,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
                secondPage.drawText(event.initials, {
                    x: 785,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
            })

            getParticipantsIntroducedNumbers(id)?.forEach((numbers, index) => {
                secondPage.drawText(JSON.stringify(numbers).slice(1, -1), {
                    x: 490,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
            })
            getParticipantsLiftedNumbers(id)?.forEach((numbers, index) => {
                secondPage.drawText(JSON.stringify(numbers).slice(1, -1), {
                    x: 704,
                    y: 450 - (index * 30),
                    size: 10,
                    font: helveticaFont,
                })
            })

            insertLineBreaks(event?.notes.replace(/[\r\n]+/g, '') || "", 95).map((line, index) => {
                secondPage.drawText(line, {
                    x: 25,
                    y: 171 - (index * 17),
                    size: 8,
                    font: helveticaFont,
                })

            })

            // PDF generieren
            const pdfBytes = await pdfDoc.save();
            // @ts-ignore
            const blob = new Blob([pdfBytes], {type: 'application/pdf'});
            const docUrl = URL.createObjectURL(blob);

            if (action === 'save') {
                // Option A: Datei herunterladen / speichern
                const link = document.createElement('a');
                link.href = docUrl;
                link.download = `${dayjs(event?.protectionFrom).format("YYYYMMDD")}_Schutzmaßnahme_${event?.description}.pdf`;
                link.click();
            } else if (action === 'print') {
                // Option B: In neuem Tab öffnen (zuverlässigste Methode für den Druck)
                const printWindow = window.open(docUrl, '_blank');
                if (printWindow) {
                    printWindow.focus();
                }
            }
            return true
        } catch (error) {
            console.error('Fehler beim Verarbeiten der PDF:', error);
            return false
        }
    }

    return {generatePdf};
}
