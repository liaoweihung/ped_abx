// app_inj.js
// 負責處理針劑網頁的計算與互動邏輯

function renderDrugSelect() {
    const cat = document.getElementById('category').value;
    const select = document.getElementById('drug');
    select.innerHTML = '';
    
    db[cat].forEach((d, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.text = `${d.name} (${d.generic}, ${d.spec})`;
        select.add(opt);
    });
    resetResult();
}

function resetResult() {
    document.getElementById('result-area').style.display = 'none';
    document.getElementById('info-area').style.display = 'none';
}

function calculate() {
    const cat = document.getElementById('category').value;
    const drugIdx = document.getElementById('drug').value;
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (!weight || weight <= 0) {
        alert("請輸入有效體重");
        return;
    }

    const drug = db[cat][drugIdx];
    
    // GA4 追蹤
    if (typeof gtag === 'function' && weight > 0) {
        gtag('event', 'calc_inj_dose', {
            'drug_name': drug.name,
            'category': cat,
            'weight_input': weight
        });
        console.log('📍 GA4 紀錄：針劑計算 - ' + drug.name);
    }

    // 顯示規格標題
    document.getElementById('res-drug-unit').innerText = `規格: ${drug.spec}`;

    // 渲染各年齡層結果
    renderStageRow('neonate', drug.dosages.neonate, weight, drug.strength, drug.unitName);
    renderStageRow('infant', drug.dosages.infant, weight, drug.strength, drug.unitName);
    renderStageRow('child', drug.dosages.child, weight, drug.strength, drug.unitName);

    // 渲染資訊文字
    document.getElementById('info-range').innerHTML = drug.rangeText;
    
    const noteBox = document.getElementById('info-note-box');
    if (drug.note) {
        document.getElementById('info-note').innerText = drug.note;
        noteBox.style.display = 'block';
    } else {
        noteBox.style.display = 'none';
    }

    document.getElementById('result-area').style.display = 'block';
    document.getElementById('info-area').style.display = 'block';
}

function renderStageRow(elementId, doseData, weight, strength, unitName) {
    const valSpan = document.getElementById(`val-${elementId}`);
    const unitSpan = document.getElementById(`unit-${elementId}`);
    const freqDiv = document.getElementById(`freq-${elementId}`);
    const row = document.getElementById(`stage-${elementId}`);

    if (!doseData) {
        valSpan.innerText = "--";
        unitSpan.innerText = "";
        freqDiv.innerText = "無建議";
        row.style.opacity = "0.5";
        return;
    }

    row.style.opacity = "1";
    
    const totalMin = weight * doseData.min;
    const totalMax = weight * doseData.max;
    const vialsMin = totalMin / strength;
    const vialsMax = totalMax / strength;

    let resText = "";
    if (vialsMin === vialsMax) {
        resText = formatNum(vialsMin);
    } else {
        resText = `${formatNum(vialsMin)} ~ ${formatNum(vialsMax)}`;
    }

    valSpan.innerText = resText;
    unitSpan.innerText = unitName;
    freqDiv.innerText = doseData.freq || "";
}

function formatNum(num) {
    return parseFloat(num.toFixed(3));
}

// 網頁初始化載入
renderDrugSelect();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
    });
}
