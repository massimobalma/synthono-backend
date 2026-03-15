const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware per parsing JSON
app.use(express.json());

// Servire file statici
app.use(express.static(path.join(__dirname)));

// Endpoint per l'analisi AI
app.post('/api/analyze', async (req, res) => {
    try {
        const formData = req.body;
        
        const prompt = `
            Analizza questi dati bioenergetici secondo i principi della Medicina Tradizionale Cinese (MTC) e le priorità scientifiche SynthONO:
            
            Dati utente: ${JSON.stringify(formData, null, 2)}
            
            Formatta la risposta ESATTAMENTE così:
            === ANALISI SYNTHONO ===
            [Testo personalizzato con nome utente]
            ANALISI MTC
            [Descrizione squilibri energetici]
            PRIORITÀ BIOCHIMICHE
            [Consigli specifici]
            PROTOCOLLO GRADUALE
            [Fasi con sequenze SynthONO]
            ORARI MTC OTTIMALI
            [Orari specifici]
            === FINE ANALISI ===
        `;

        const difyResponse = await fetch('https://api.dify.ai/v1/chat-messages', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ${process.env.DIFY_API_KEY}'
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: {},
                query: prompt,
                response_mode: "blocking",
                user: "synthono-user"
            })
        });

        if (!difyResponse.ok) {
            throw new Error(`Errore Dify API: ${difyResponse.status}`);
        }

        const difyData = await difyResponse.json();
        const analysis = difyData.answer;

        res.json({ analysis });
    } catch (error) {
        console.error('Errore:', error);
        res.status(500).json({ 
            analysis: "=== ANALISI SYNTHONO ===\nCiao, grazie per aver compilato il questionario.\n\n⚠️ ERRORE TEMPORANEO: L'analisi AI non è disponibile. Riprova più tardi.\n\n=== FINE ANALISI ===" 
        });
    }
});

// Avvio server
app.listen(PORT, () => {
    console.log(`Server avviato! Apri: http://localhost:${PORT}/questionario.html`);
});






