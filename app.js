


    let currentMode = 'susp';
    let tamifluAgeMode = 'child';

    function switchTab(mode) {
        currentMode = mode;
        const btns = document.querySelectorAll('.tab-btn');
        if (mode === 'susp') {
            btns[0].classList.add('active');
            btns[1].classList.remove('active');
        } else {
            btns[0].classList.remove('active');
            btns[1].classList.add('active');
        }
        renderSelect();
        hideResult();
        handleDrugChange();
    }

    function renderSelect() {
        const select = document.getElementById('drug');
        select.innerHTML = '';
        db[currentMode].forEach((d, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.text = d.name;
            select.add(opt);
        });
    }

    function handleDrugChange() {
        hideResult();
        const drugIdx = document.getElementById('drug').value;
        const drug = db[currentMode][drugIdx];
        
        const tfModeSelect = document.getElementById('tamiflu-mode-select');
        const tfRenal = document.getElementById('tamiflu-renal-block');
        const tfRef = document.getElementById('tamiflu-ref-container');
        const wGroup = document.getElementById('weight-group');
        const aGroup = document.getElementById('age-group');

        if (drug.id === 'tamiflu') {
            tfModeSelect.style.display = 'flex';
            tfRenal.style.display = 'block'; 
            tfRef.style.display = 'none'; 
            setTamifluMode('child'); // 預設 child
        } else {
            tfModeSelect.style.display = 'none';
            tfRenal.style.display = 'none';
            tfRef.style.display = 'none';
            wGroup.style.display = 'block'; 
            aGroup.style.display = 'block';
        }
    }

    function setTamifluMode(mode) {
        tamifluAgeMode = mode;
        document.getElementById('btn-infant').classList.toggle('active', mode === 'infant');
        document.getElementById('btn-child').classList.toggle('active', mode === 'child');
        document.getElementById('btn-adult').classList.toggle('active', mode === 'adult');
        
        const crTrigger = document.getElementById('cr-calc-trigger');
        const crCalc = document.getElementById('cr-calculator');
        const egfrHint = document.getElementById('egfr-hint');
        const wGroup = document.getElementById('weight-group');
        const aGroup = document.getElementById('age-group');

        if (mode === 'adult') {
            crTrigger.style.display = 'none';
            crCalc.style.display = 'none';
            egfrHint.innerHTML = "* 成人請直接輸入檢驗數值 (MDRD/CKD-EPI)<br><span style='color:#666; font-size:12px; display:block; margin-top:6px; line-height:1.4;'>本網頁工具採取「直接對應」的邏輯，將計算或輸入的 eGFR 數值 直接拿來對照仿單上的 CrCl 分級 (60, 30, 10)。</span>";
            wGroup.style.display = 'none'; 
            aGroup.style.display = 'none';
        } else {
            crTrigger.style.display = 'block';
            egfrHint.innerHTML = "* 兒科適用 Bedside Schwartz 公式：<br><span style='font-weight:bold; color:#2980b9; display:block; margin-top:4px;'>eGFR = 0.413 × 身高 (cm) / Cr (mg/dL)</span>";
            wGroup.style.display = 'block';
            aGroup.style.display = 'block';
        }
        hideResult();
    }
    
    function toggleCrCalc() {
        const calc = document.getElementById('cr-calculator');
        calc.style.display = calc.style.display === 'none' ? 'block' : 'none';
    }

    function calcSchwartz() {
        const h = parseFloat(document.getElementById('calc-height').value);
        const cr = parseFloat(document.getElementById('calc-cr').value);
        if (!h || !cr) { alert('請輸入身高與肌酸酐'); return; }
        const egfr = (0.413 * h) / cr;
        document.getElementById('egfr-input').value = egfr.toFixed(1);
        checkRenalStatus();
    }

    function checkRenalStatus() {
        const egfrVal = parseFloat(document.getElementById('egfr-input').value);
        const badge = document.getElementById('renal-status-badge');
        if (!egfrVal && egfrVal !== 0) { badge.style.display = 'none'; return; }
        badge.style.display = 'inline-block';
        if (egfrVal > 60) { badge.style.backgroundColor = '#27ae60'; badge.innerText = '正常'; } 
        else if (egfrVal >= 30) { badge.style.backgroundColor = '#f39c12'; badge.innerText = '30-60 (BID)'; } 
        else if (egfrVal >= 10) { badge.style.backgroundColor = '#e67e22'; badge.innerText = '10-30 (QD)'; } 
        else { badge.style.backgroundColor = '#c0392b'; badge.innerText = 'ESRD/洗腎'; }
    }

    function estimateWeight() {
        const age = parseFloat(document.getElementById('age').value);
        const weightInput = document.getElementById('weight');
        const msgDiv = document.getElementById('estimate-msg');
        if (!age || age <= 0) { alert("請先輸入有效的年齡"); return; }
        let estWeight = 0;
        let lookupAge = (age < 1) ? 0.5 : Math.round(age);
        if (growthChart[lookupAge]) estWeight = growthChart[lookupAge];
        else estWeight = (age * 2) + 8;
        weightInput.value = estWeight;
        msgDiv.innerText = `💡 已填入參考體重: ${estWeight} kg`;
        msgDiv.style.display = 'block';
    }

    function hideResult() {
        document.getElementById('results-container').querySelectorAll('.result-card').forEach(el => el.style.display = 'none');
        document.getElementById('guide-container').style.display = 'none';
        document.getElementById('tamiflu-ref-container').style.display = 'none';
        document.getElementById('estimate-msg').style.display = 'none';
    }

    // === 新增：組合治療動態反推功能 ===
    function recalcCombo() {
        const weight = parseFloat(document.getElementById('weight').value);
        const actualDose = parseFloat(document.getElementById('combo-actual-dose').value) || 0;
        const drugIdx = document.getElementById('drug').value;
        const drug = db[currentMode][drugIdx];

        if (!weight || weight <= 0) return;

        let targetDailyMg = weight * 90; // 目標 90 mg/kg/day

        if (drug.id === 'aug') {
            // 輸入的是 Augmentin mL BID
            let augDailyMg = actualDose * 2 * 80; // mL * 2次 * 80mg/mL
            let gapMg = targetDailyMg - augDailyMg;
            
            if (gapMg > 0) {
                let capsNeeded = gapMg / 500;
                document.getElementById('val-combo').innerText = `+ Amoxicillin (500) ${capsNeeded.toFixed(2)}`;
                document.getElementById('unit-combo').innerText = "顆 / 天";
                document.getElementById('text-combo').innerText = `補足差額 ${gapMg.toFixed(0)} mg/day (可分BID給予)`;
                document.getElementById('text-combo').style.display = 'inline-block';
            } else {
                document.getElementById('val-combo').innerText = "✔️ 總量已達標";
                document.getElementById('unit-combo').innerText = "(無需添加)";
                document.getElementById('text-combo').style.display = 'none';
            }
        } else if (drug.id === 'amox') {
            // 輸入的是 Amoxicillin 總顆數/天
            let amoxDailyMg = actualDose * 500;
            let gapMg = targetDailyMg - amoxDailyMg;
            
            if (gapMg > 0) {
                let augMlPerDay = gapMg / 80;
                let augMlBid = augMlPerDay / 2;
                document.getElementById('val-combo').innerText = `+ Augmentin Susp ${augMlBid.toFixed(1)}`;
                document.getElementById('unit-combo').innerText = "mL BID";
                document.getElementById('text-combo').innerText = `補足差額 ${gapMg.toFixed(0)} mg/day`;
                document.getElementById('text-combo').style.display = 'inline-block';
            } else {
                document.getElementById('val-combo').innerText = "✔️ 總量已達標";
                document.getElementById('unit-combo').innerText = "(無需添加)";
                document.getElementById('text-combo').style.display = 'none';
            }
        }
    }
    
    function calculate() {
        const drugIdx = document.getElementById('drug').value;
        const drug = db[currentMode][drugIdx];
        const weight = parseFloat(document.getElementById('weight').value);

        // --- 👇 新增：追蹤口服計算動作 👇 ---
        if (typeof gtag === 'function' && weight > 0) {
            gtag('event', 'calc_oral_dose', {
                'drug_name': drug.name, // 紀錄是哪種藥，例如: Augmentin
                'weight_input': weight, // 紀錄輸入的體重
                'app_version': '20251231'
            });
            console.log('📍 GA4 紀錄：口服計算 - ' + drug.name);
        }
        // --- 👆 新增結束 👆 ---
        
        // ... (Tamiflu logic remains same)
        if (drug.id === 'tamiflu') {
            const egfrInput = document.getElementById('egfr-input').value;
            const egfr = egfrInput ? parseFloat(egfrInput) : 100;
            let targetDoseMg = 0; let freqText = "BID x 5天"; let warning = "";
            if (tamifluAgeMode === 'adult') { targetDoseMg = 75; } 
            else {
                if (!weight || weight <= 0) { alert('請輸入有效體重'); return; }
                if (tamifluAgeMode === 'infant') {
                    if (weight > 10) warning = "⚠️ 體重 > 10kg 但選擇未滿1歲，仿單無建議劑量。";
                    else targetDoseMg = weight * 3;
                } else {
                    if (weight <= 15) targetDoseMg = 30; else if (weight <= 23) targetDoseMg = 45;
                    else if (weight <= 40) targetDoseMg = 60; else targetDoseMg = 75;
                }
            }
            if (egfr >= 60) {} else if (egfr >= 30) { targetDoseMg = 30; freqText = "BID (腎功能 30-60)"; warning += (tamifluAgeMode === 'adult') ? "⚠️ 成人腎功能不全：調整為 30mg BID。" : "⚠️ 依腎功能調整為 30mg BID。"; } else if (egfr >= 10) { targetDoseMg = 30; freqText = "QD (腎功能 10-30)"; warning += "⚠️ 依腎功能調整為 30mg QD。"; } else { warning += "⚠️ eGFR < 10，請參考下方透析建議。"; }
            const kidView = document.getElementById('tf-kid-view');
            const adultView = document.getElementById('tf-adult-view');
            const headerTitle = document.getElementById('tf-header-title');
            if (tamifluAgeMode === 'adult') {
                let capsPerDose = targetDoseMg / 75; 
                document.getElementById('val-tamiflu-adult').innerText = Number.isInteger(capsPerDose) ? capsPerDose : capsPerDose.toFixed(1);
                document.getElementById('freq-tamiflu-adult').innerText = freqText;
                document.getElementById('dose-tamiflu-adult-mg').innerText = targetDoseMg;
                headerTitle.innerText = "💊 克流感服用劑量";
                kidView.style.display = 'none'; adultView.style.display = 'block';
            } else {
                let totalCaps = 0; if (targetDoseMg > 0) totalCaps = (targetDoseMg * 10) / 75;
                document.getElementById('val-tamiflu').innerText = Number.isInteger(totalCaps) ? totalCaps : totalCaps.toFixed(1);
                document.getElementById('dose-tamiflu-mg').innerText = targetDoseMg.toFixed(0);
                document.getElementById('freq-tamiflu').innerText = freqText;
                headerTitle.innerText = "🦠 克流感調配 (50mL)";
                kidView.style.display = 'block'; adultView.style.display = 'none';
            }
            document.getElementById('warning-tamiflu').innerText = warning;
            document.getElementById('res-card-tamiflu').style.display = 'block';
            document.getElementById('tamiflu-ref-container').style.display = 'block';
            ['tf-ref-child', 'tf-ref-infant', 'tf-ref-adult'].forEach(id => document.getElementById(id).style.display = 'none');
            if (tamifluAgeMode === 'infant') document.getElementById('tf-ref-infant').style.display = 'block';
            else if (tamifluAgeMode === 'adult') document.getElementById('tf-ref-adult').style.display = 'block';
            else document.getElementById('tf-ref-child').style.display = 'block';
            return;
        }

        // --- 一般藥品計算邏輯 ---
        const age = parseFloat(document.getElementById('age').value);
        if (!weight || weight <= 0) { alert('請輸入有效體重'); return; }

        let hospDose = 0; let hospNote = '';
        if (drug.id === 'baktar') {
            if (isNaN(age)) { alert('Baktar 需輸入年齡'); return; }
            if (age < 0.5) hospDose = 2.5; else if (age <= 5) hospDose = 5; else hospDose = 10;
        } 
        else if (drug.id === 'ulexin' && weight > 25) { hospDose = 10; hospNote = '(>25kg固定)'; }
        else if (currentMode === 'pow') {
            let dailyMg = weight * drug.hospBasis;
            let isAdult = false;
            if (drug.id === 'cexime' && weight > 45) { dailyMg = 400; isAdult = true; }
            if (drug.id === 'amox' && weight >= 40) { dailyMg = 1500; isAdult = true; } 
            if (drug.id === 'doxy' && weight > 45) { dailyMg = 200; isAdult = true; }
            if (drug.id === 'acylo' && weight > 40) { dailyMg = 3200; isAdult = true; }
            hospDose = (dailyMg / drug.hospFreq) / drug.conc;
            if (isAdult) hospNote = '(成人劑量)';
        } else {
            hospDose = (weight * drug.hospBasis / drug.conc) / drug.hospFreq;
        }

        const hospDoseText = currentMode === 'pow' ? (Number.isInteger(hospDose) ? hospDose : hospDose.toFixed(2)) : hospDose.toFixed(1);
        document.getElementById('val-hosp').innerText = hospDoseText + (hospNote ? "*" : "");
        document.getElementById('unit-hosp').innerText = drug.unit;
        let fTextH = drug.hospFreq === 1 ? 'QD' : (drug.hospFreq === 2 ? 'BID' : (drug.hospFreq === 3 ? 'TID' : 'QID'));
        if (drug.id === 'ulexin') fTextH = 'Q6H';
        document.getElementById('freq-hosp').innerText = fTextH;
        document.getElementById('res-card-hosp').style.display = 'block';

        const assocCard = document.getElementById('res-card-assoc');
        if (drug.assocBasis) {
            let dailyMgAssoc = weight * drug.assocBasis;
            let assocDose = (dailyMgAssoc / drug.conc) / drug.assocFreq;
            if (currentMode === 'pow' && drug.id === 'cexime' && weight > 45) assocDose = 2; 
            
            const assocDoseText = currentMode === 'pow' ? (Number.isInteger(assocDose) ? assocDose : assocDose.toFixed(2)) : assocDose.toFixed(1);
            document.getElementById('val-assoc').innerText = assocDoseText;
            document.getElementById('unit-assoc').innerText = drug.unit;
            let fTextA = drug.assocFreq === 1 ? 'QD' : (drug.assocFreq === 2 ? 'BID' : (drug.assocFreq === 3 ? 'TID' : 'QID'));
            document.getElementById('freq-assoc').innerText = fTextA;
            document.getElementById('warning-assoc').innerText = (drug.id === 'aug') ? "⚠️ 依 90mg/kg 計算。院內配方比例 7:1，請留意腹瀉。" : "";
            assocCard.style.display = 'block';
            document.getElementById('text-assoc-box').style.display = 'block';
            document.getElementById('text-assoc').innerText = drug.assocText;
        } else {
            assocCard.style.display = 'none';
            document.getElementById('text-assoc-box').style.display = 'none';
        }

        // --- 組合治療邏輯 (動態輸入版) ---
        const comboCard = document.getElementById('res-card-combo');

        if (drug.id === 'aug') {
            document.getElementById('combo-target-mg').innerText = (weight * 90).toFixed(0);
            document.getElementById('combo-input-label').innerText = "若醫師開立 Augmentin 水劑：";
            document.getElementById('combo-input-unit').innerText = "mL BID";
            
            // 帶入預設的院內建議劑量 (方便直接算)
            let defaultAugBid = ((weight * 45 / 80) / 2).toFixed(1);
            document.getElementById('combo-actual-dose').value = defaultAugBid;
            
            comboCard.style.display = 'block';
            recalcCombo(); // 觸發計算
            
        } else if (drug.id === 'amox') {
            document.getElementById('combo-target-mg').innerText = (weight * 90).toFixed(0);
            document.getElementById('combo-input-label').innerText = "若醫師開立 Amox 膠囊：";
            document.getElementById('combo-input-unit').innerText = "顆 / 天 (總量)";
            
            // 預設帶入 1 顆/天 讓醫師/藥師參考
            document.getElementById('combo-actual-dose').value = 1;
            
            comboCard.style.display = 'block';
            recalcCombo(); // 觸發計算
            
        } else {
            comboCard.style.display = 'none';
        }

        // 顯示指南與建議資訊
        document.getElementById('guide-container').style.display = 'block';
        document.getElementById('text-hosp').innerText = drug.hospText + (hospNote ? " " + hospNote : "");
    }

    // --- 👇 網頁初始化與啟動 👇 ---
    renderSelect();
    handleDrugChange();
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js'); });
    }


