jsPsych.plugins["free-recall-graded"] = (function () {
    const plugin = {};

    plugin.info = {
        name: "free-recall-graded",
        parameters: {
            instructions: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "Instructions",
                default: "Please type everything you remember from the passage.",
            },
            word_file: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "CSV file with idea units",
                default: null,
            },
            model: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "OpenAI model",
                default: "gpt-4o-mini",
            },
        },
    };

    plugin.trial = async function (display_element, trial) {

        display_element.innerHTML = `
      <div style="max-width:900px;margin:30px auto;">
        <h2 style="text-align:center;margin-bottom:18px;">${trial.instructions}</h2>

        <textarea id="recall-input" rows="10"
          style="width:100%;padding:12px;font-size:16px;box-sizing:border-box;"></textarea>

        <div style="margin-top:14px;text-align:center;">
          <button id="submit-btn" style="padding:10px 18px;font-size:16px;">Submit Recall</button>
        </div>

        <div id="status" style="margin-top:14px;color:#666;text-align:center;"></div>

        <div id="results" style="margin-top:18px;"></div>
      </div>
    `;

        const statusEl = document.getElementById("status");
        const resultsEl = document.getElementById("results");
        const submitBtn = document.getElementById("submit-btn");

        function setStatus(msg, isError = false) {
            statusEl.style.color = isError ? "#b00020" : "#666";
            statusEl.textContent = msg;
        }

       
        function splitSentences(text) {
            if (!text) return [];
            const matches = text.match(/[^.!?]+[.!?]+/g);
            if (matches && matches.length) return matches.map((s) => s.trim()).filter(Boolean);
            return [text.trim()].filter(Boolean);
        }

        function cleanJSON(text) {
            return String(text || "")
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .replace(/[\u0000-\u001F]+/g, "")
                .trim();
        }

        async function loadCSV(path) {
            const resp = await fetch(path, { cache: "no-store" });
            if (!resp.ok) throw new Error(`Failed to fetch CSV (${resp.status}) at: ${path}`);
            const text = await resp.text();

            return new Promise((resolve) => {
                Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const rows = (results.data || []).filter(
                            (r) => r && r["Idea Unit"] && String(r["Idea Unit"]).trim().length > 0
                        );
                        resolve(rows);
                    },
                });
            });
        }

        function renderTable(rows) {
            const safe = (x) => String(x ?? "");
            const html = `
        <h3 style="margin:0 0 10px 0;">Results</h3>
        <div style="overflow:auto;border:1px solid #ddd;border-radius:8px;">
          <table style="border-collapse:collapse;width:100%;font-size:14px;">
            <thead>
              <tr style="background:#f6f6f6;">
                <th style="border-bottom:1px solid #ddd;padding:10px;text-align:left;min-width:260px;">Sentence</th>
                <th style="border-bottom:1px solid #ddd;padding:10px;text-align:left;min-width:160px;">Matched Idea Num</th>
                <th style="border-bottom:1px solid #ddd;padding:10px;text-align:center;min-width:70px;">Score</th>
                <th style="border-bottom:1px solid #ddd;padding:10px;text-align:left;min-width:260px;">Feedback</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                    .map(
                        (r) => `
                <tr>
                  <td style="border-bottom:1px solid #eee;padding:10px;vertical-align:top;">${safe(r.sentence)}</td>
                  <td style="border-bottom:1px solid #eee;padding:10px;vertical-align:top;">${safe(r.matched_unit)}</td>
                  <td style="border-bottom:1px solid #eee;padding:10px;text-align:center;vertical-align:top;">${safe(r.score)}</td>
                  <td style="border-bottom:1px solid #eee;padding:10px;vertical-align:top;">${safe(r.feedback)}</td>
                </tr>
              `
                    )
                    .join("")}
            </tbody>
          </table>
        </div>
      `;
            resultsEl.innerHTML = html;
        }

        
        if (!trial.word_file) {
            setStatus("Error: No word_file provided to the plugin.", true);
            return;
        }

        let ideaUnits = [];
        try {
            setStatus("Loading grading criteria...");
            ideaUnits = await loadCSV(trial.word_file);
            if (!ideaUnits.length) {
                setStatus("Loaded CSV, but found 0 valid idea units (check columns: 'Idea Num' and 'Idea Unit').", true);
                return;
            }
            setStatus(`Loaded ${ideaUnits.length} idea units. Ready.`);
        } catch (e) {
            setStatus(`Failed to load idea units CSV: ${e.message}`, true);
            return;
        }


        async function gradeBatch(sentences, units) {
            const apiKey = window.OPENAI_API_KEY;
            if (!apiKey || apiKey === "PASTE_YOUR_KEY_HERE") {
                throw new Error("OpenAI API key missing. Set window.OPENAI_API_KEY in index.html.");
            }

            const prompt = `
You are grading free recall sentences for scientific accuracy.

Each sentence may match ONE idea unit from the list, or NONE.

Rules:
- Match the sentence to the idea unit that expresses the same scientific idea (paraphrases OK).
- If no idea unit fits, use {"unit":"None","score":0,"feedback":"..."}.
- If it matches, use {"unit":"<Idea Num>","score":1,"feedback":"..."}.
- Return ONLY a JSON array (no markdown, no extra text).

Sentences:
${sentences.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Idea Units (use Idea Num as label):
${units.map((u) => `${u["Idea Num"]}: ${u["Idea Unit"]}`).join("\n")}
      `.trim();

            
            const resp = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: trial.model || "gpt-4o-mini",
                    temperature: 0,
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            if (!resp.ok) {
                const errText = await resp.text().catch(() => "");
                throw new Error(`OpenAI request failed (${resp.status}): ${errText.slice(0, 300)}`);
            }

            const data = await resp.json();
            const raw = cleanJSON(data?.choices?.[0]?.message?.content || "");
            let parsed = [];
            try {
                parsed = JSON.parse(raw);
            } catch {
                
                parsed = [];
            }

            return sentences.map((sentence, i) => {
                const r = parsed[i] || { unit: "Error (no data)", score: 0, feedback: "Model did not return data for this sentence." };
                const unit = r && typeof r.unit === "string" ? r.unit : (r?.unit ? String(r.unit) : "Error");
                const score = Number(r?.score) === 1 ? 1 : 0;
                const feedback = r?.feedback ? String(r.feedback) : "";
                return { sentence, matched_unit: unit, score, feedback };
            });
        }

        
        submitBtn.onclick = async () => {
            resultsEl.innerHTML = "";
            const recallText = document.getElementById("recall-input").value.trim();
            if (!recallText) {
                alert("Please type your recall!");
                return;
            }

            const sentences = splitSentences(recallText);
            if (!sentences.length) {
                alert("Could not find any sentences to grade.");
                return;
            }

            submitBtn.disabled = true;
            setStatus("Grading… please wait.");

            try {
                const graded = await gradeBatch(sentences, ideaUnits);
                setStatus("Done.");
                renderTable(graded);

                jsPsych.finishTrial({
                    recall_text: recallText,
                    graded_sentences: graded,
                    idea_unit_file: trial.word_file,
                    model: trial.model || "gpt-4o-mini",
                });
            } catch (e) {
                setStatus(e.message, true);
                submitBtn.disabled = false;
            }
        };
    };

    return plugin;
})();
