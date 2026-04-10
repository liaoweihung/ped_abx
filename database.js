// database.js
// 這裡專門存放所有的藥品資料與體重對照表，方便日後獨立維護更新

const growthChart = {
    0.5: 7.5, 1: 9.5, 2: 12.0, 3: 14.5, 4: 16.5, 5: 18.5, 6: 21.0, 
    7: 24.0, 8: 27.0, 9: 30.5, 10: 34.0, 11: 38.5, 12: 43.0
};

const db = {
    susp: [
        { id: 'aug', name: 'Augmentin (400/57)', conc: 80, hospBasis: 45, hospFreq: 2, assocBasis: 90, assocFreq: 2, unit: 'mL', hospText: '一般感染: 25 mg/kg BID; 嚴重: 45 mg/kg BID', assocText: '80-90 mg amoxicillin/kg/day，bid-tid (建議比例14:1，院內為7:1)' },
        { id: 'baktar', name: 'Sulfacotrim (Baktar)', conc: 8, isAgeBased: true, hospBasis: 0, hospFreq: 2, assocBasis: 10, assocFreq: 2, unit: 'mL', hospText: '6週-5月: 2.5ml BID; 6月-5歲: 5ml BID; 6-12歲: 10ml BID', assocText: '首選反應不佳時 TMP 6-12 mg/kg/day bid' },
        { id: 'zith', name: 'Zithromax', conc: 40, hospBasis: 10, hospFreq: 1, assocBasis: null, unit: 'mL', hospText: '中耳炎: 10 mg/kg (單次或3天); 肺炎: D1 10mg/kg, D2-5 5mg/kg', assocText: '' },
        { id: 'ulexin', name: 'Ulexin (Cephalexin)', conc: 25, hospBasis: 50, hospFreq: 4, assocBasis: null, unit: 'mL', hospText: '<25kg: 25-50 mg/kg/day div 4; >25kg: 250-500mg Q6H', assocText: '' }
    ],
    pow: [
        { id: 'cexime', name: 'Cexime (100mg/cap)', conc: 100, hospBasis: 8, hospFreq: 2, assocBasis: 10, assocFreq: 2, unit: '顆', hospText: '<45kg: 8 mg/kg/day div 1-2; >45kg: 400 mg/day', assocText: '10 mg/kg/day，bid' },
        { id: 'amox', name: 'Amoxicillin (500mg/cap)', conc: 500, hospBasis: 45, hospFreq: 3, assocBasis: 90, assocFreq: 2, unit: '顆', hospText: '<40kg: 40-45 mg/kg; >40kg: 500mg Q8H', assocText: '80-90 mg/kg/day，bid-tid' },
        { id: 'ceflour', name: 'Ceflour (250mg/cap)', conc: 250, hospBasis: 30, hospFreq: 2, assocBasis: 30, assocFreq: 2, unit: '顆', hospText: '3 mo-12 yrs: 30 mg/kg/day bid', assocText: '30 mg/kg/day，bid' },
        { id: 'acylo', name: 'Acylo (400mg/tab)', conc: 400, hospBasis: 80, hospFreq: 4, assocBasis: null, unit: '顆', hospText: '水痘: 20 mg/kg QID (Max 800mg)', assocText: '' },
        { id: 'doxy', name: 'Doxymycin (100mg/cap)', conc: 100, hospBasis: 4.4, hospFreq: 2, assocBasis: null, unit: '顆', hospText: '<45kg: 4.4 mg/kg/day bid; >45kg: 100mg bid', assocText: '' },
        { id: 'cino', name: 'Cinilon (250mg/cap)', conc: 250, hospBasis: 30, hospFreq: 2, assocBasis: null, unit: '顆', hospText: '10-20 mg/kg Q12H (Max 750mg/dose)', assocText: '' },
        { id: 'tamiflu', name: 'Tamiflu (克流感)', type: 'special', unit: '顆', hospText: '', assocText: '' }
    ]
};
