// database_inj.js
// 存放兒科常用針劑的藥品清單與劑量設定

const db = {
    anti: [
        { 
            name: "Gentamycin inj", generic: "Gentamycin", spec: "80mg/2ml/vial", 
            strength: 80, unitName: "vial",
            dosages: {
                neonate: { min: 4, max: 5, freq: "Q24-48H" },
                infant: { min: 2, max: 2.5, freq: "Q8H" },
                child: { min: 2, max: 2.5, freq: "Q8H" }
            },
            rangeText: "Neonate : 4-5 mg/kg/dose Q24-48H<br>Infant/Child : 2-2.5 mg/kg/dose Q8H",
            note: "UpTodate Lexidrug : Extended-interval dosing : \nInfant/Child : 5 to 7.5 mg/kg/dose QD\nTDM is necessary if duration > 3-5 days"
        },
        { 
            name: "Ampolin inj", generic: "Ampicillin", spec: "500mg/vial", 
            strength: 500, unitName: "vial",
            dosages: {
                neonate: { min: 50, max: 50, freq: "Q6-12H" },
                infant: { min: 12.5, max: 50, freq: "Q6H" },
                child: { min: 12.5, max: 50, freq: "Q6H" }
            },
            rangeText: "Neonate : 50 mg/kg/dose Q6-12H<br>Infant/Child : 12.5 to 50 mg/kg/dose Q6H",
            note: "UpTodate Lexidrug : Infant/Child : Maximum daily dose : 8 g/day\n-> Higher dose : 75-100 mg/dose Q6H for specific infection, Max : 12 g/day"
        },
        { 
            name: "Cefa", generic: "Cefazolin", spec: "1gm/vial", 
            strength: 1000, unitName: "vial",
            dosages: {
                neonate: { min: 25, max: 25, freq: "Q8-12H" },
                infant: { min: 8, max: 33, freq: "Q8H" },
                child: { min: 8, max: 33, freq: "Q8H" }
            },
            rangeText: "Neonate : 25 mg/kg/dose Q8-12H<br>Infant/Child : 8 to 33 mg/kg/dose Q8H"
        },
        { 
            name: "cetazINE inj", generic: "Ceftazidime", spec: "1g/vial", 
            strength: 1000, unitName: "vial",
            dosages: {
                neonate: { min: 50, max: 50, freq: "Q8H" },
                infant: { min: 30, max: 50, freq: "Q8H" },
                child: { min: 30, max: 50, freq: "Q8H" }
            },
            rangeText: "Neonate : 50 mg/kg/dose Q8H<br>Infant/Child : 30-50 mg/kg/dose Q8H",
            note: "UpTodate Lexidrug : Infant/Child : 66-100 mg/kg/dose for Severe P.A. infection"
        },
        { 
            name: "Ceftriaxone Sandoz【2g】", generic: "Ceftriaxone", spec: "2g/vial", 
            strength: 2000, unitName: "vial",
            dosages: {
                neonate: { min: 50, max: 50, freq: "QD" },
                infant: { min: 50, max: 75, freq: "QD" },
                child: { min: 50, max: 75, freq: "QD" }
            },
            rangeText: "Neonate : 50 mg/kg/dose QD<br>Infant/Child : 50-75 mg/kg/dose QD",
            note: "UpTodate Lexidrug : Dosage base on once daily frequency (Q24H or QD)\nInfant/Child : Maximum daily dose : 2 g/day"
        },
        { 
            name: "Cetazone", generic: "Cefmetazole", spec: "500mg/vial", 
            strength: 500, unitName: "vial",
            dosages: {
                neonate: null,
                infant: { min: 8, max: 33, freq: "Q8H" },
                child: { min: 8, max: 33, freq: "Q8H" }
            },
            rangeText: "Child : 8-33 mg/kg/dose Q8H",
            note: "UpTodate Lexidrug : 25-100 mg/kg/day in 2 to 4 divided doses"
        },
        { 
            name: "Claforan", generic: "Cefotaxime", spec: "1g/vial", 
            strength: 1000, unitName: "vial",
            dosages: {
                neonate: { min: 50, max: 50, freq: "Q8-12H" },
                infant: { min: 50, max: 60, freq: "Q8H" },
                child: { min: 50, max: 60, freq: "Q8H" }
            },
            rangeText: "Neonate : 50 mg/kg/dose Q8-12H<br>Infant/Child : 50-60 mg/kg/dose Q8H",
            note: "UpTodate Lexidrug : Infant/Child : \n-> 150-180 mg/kg/day in divided doses every 4 to 8 hours\n-> Maximum daily dose : 2 g/day"
        },
        { 
            name: "Mepem", generic: "Meropenem", spec: "0.25gm/vial", 
            strength: 250, unitName: "vial",
            dosages: {
                neonate: { min: 20, max: 30, freq: "Q8-12H" },
                infant: { min: 20, max: 20, freq: "Q8H" },
                child: { min: 20, max: 20, freq: "Q8H" }
            },
            rangeText: "Neonate : 20-30 mg/kg/dose Q8-12H<br>Infant/Child : 20 mg/kg/dose Q8H"
        },
        { 
            name: "Ocillina", generic: "Oxacillin", spec: "500mg/vial", 
            strength: 500, unitName: "vial",
            dosages: {
                neonate: { min: 25, max: 25, freq: "Q6-12H" },
                infant: { min: 25, max: 50, freq: "Q6H" },
                child: { min: 25, max: 50, freq: "Q6H" }
            },
            rangeText: "Neonate : 25 mg/kg/dose Q6-12H<br>Infant/Child : 25-50 mg/kg/dose Q6H",
            note: "UpTodate Lexidrug : Infant/Child : Maximum daily dose : 12 g/day"
        },
        { 
            name: "Penicillin G【5MU】", generic: "Aq. Penicillin", spec: "500萬U/vial", 
            strength: 5000000, unitName: "vial",
            dosages: {
                neonate: { min: 50000, max: 50000, freq: "Q8-12H", isUnit: true },
                infant: { min: 25000, max: 75000, freq: "Q6H", isUnit: true },
                child: { min: 25000, max: 75000, freq: "Q6H", isUnit: true }
            },
            rangeText: "Neonate : 50,000 units/kg/dose Q8-12H<br>Infant/Child : 25,000-75,000 units/kg/dose Q6H",
            note: "UpTodate Lexidrug : Infant/Child : Maximum daily dose : 24 million units/day"
        },
        { 
            name: "Soonmelt inj", generic: "Amoxicillin/Clavulanate", spec: "A 500, C 100mg/VIAL", 
            strength: 500, unitName: "vial",
            dosages: {
                neonate: { min: 25, max: 25, freq: "Q12H" },
                infant: { min: 25, max: 25, freq: "Q8-12H" },
                child: { min: 25, max: 25, freq: "Q8-12H" }
            },
            rangeText: "Neonate : 25 mg Amox/kg/dose Q12H<br>Infant/Child : 25 mg Amox/kg/dose Q8-12H"
        },
        { 
            name: "U-VANCO inj$", generic: "Vancomycin", spec: "500mg/vial", 
            strength: 500, unitName: "vial",
            dosages: {
                neonate: { min: 15, max: 15, freq: "Q8-24H" },
                infant: { min: 10, max: 15, freq: "Q6H" },
                child: { min: 10, max: 15, freq: "Q6H" }
            },
            rangeText: "Neonate : 15 mg/kg/dose Q8-24H<br>Infant/Child : 10-15 mg/kg/dose Q6H",
            note: "TDM is necessary if duration > 3-5 days"
        },
        { 
            name: "Rapiacta inj", generic: "Peramivir", spec: "300MG/60ML/BAG", 
            strength: 300, unitName: "bag",
            dosages: {
                neonate: null,
                infant: { min: 10, max: 10, freq: "" },
                child: { min: 10, max: 10, freq: "" }
            },
            rangeText: "10 mg/kg/dose",
            note: "6-12 mg/kg/dose also mentioned"
        }
    ],
    non: [
        { 
            name: "Acetamol inj", generic: "Propacetamol", spec: "1g/vial", 
            strength: 1000, unitName: "vial",
            dosages: {
                neonate: null,
                infant: { min: 20, max: 30, freq: "Q6H" },
                child: { min: 20, max: 30, freq: "Q6H" }
            },
            rangeText: "Infant/Child : 20-30 mg/kg/dose Q6H",
            note: "1 g Propacetamol = 0.5 g Paracetamol\nAdjusted from dosage of Acetaminophen"
        },
        { 
            name: "Novamin inj", generic: "Prochlorperazine", spec: "5mg/ml/amp", 
            strength: 5, unitName: "amp",
            dosages: {
                neonate: null,
                infant: null,
                child: { min: 0.1, max: 0.1, freq: "Q8-12H" }
            },
            rangeText: "Child : 0.1 mg/kg, Max : 10 mg/dose Q8-12H",
            note: "UpTodate Lexidrug : dosage for Children ≥2 years weighing ≥9 kg"
        },
        { 
            name: "Escopan inj", generic: "Hyoscine-N-butylbromide", spec: "20mg/ml/amp", 
            strength: 20, unitName: "amp",
            dosages: {
                neonate: null,
                infant: { min: 0.3, max: 0.6, freq: "" },
                child: { min: 0.3, max: 0.6, freq: "" }
            },
            rangeText: "Infant/Child : 0.3-0.6 mg/kg/dose",
            note: "Package insert : Maximum daily dose : 1.5 mg/kg"
        },
        { 
            name: "promeRAN inj", generic: "Metoclopramide", spec: "7.68mg/2ml/amp", 
            strength: 7.68, unitName: "amp",
            dosages: {
                neonate: null,
                infant: null,
                child: { min: 0.1, max: 0.2, freq: "Q6-8H" }
            },
            rangeText: "0.1-0.2 mg/kg/dose Q6-8H",
            note: "Package insert : 兒童按照年齡、體重、症狀嚴重度，每次0.5-2 mL"
        },
        { 
            name: "Ulcertin inj", generic: "Famotidine", spec: "20MG/2ML/AMPU", 
            strength: 20, unitName: "amp",
            dosages: {
                neonate: { min: 0.25, max: 0.5, freq: "QD" },
                infant: { min: 0.25, max: 0.25, freq: "Q12-24H" },
                child: { min: 0.25, max: 0.25, freq: "Q12-24H" }
            },
            rangeText: "Neonate : 0.25-0.5 mg/kg/dose QD<br>Infant/Child : 0.25 mg/kg/dose Q12-24H",
            note: "UpTodate Lexidrug : Stress ulcer prophylaxis, gastric acid suppression : \nInfant/Child : 1-2 mg/kg/day divided Q8-12H\n-> Maximum daily dose : 40 mg/day"
        },
        { 
            name: "Keppra for IVF", generic: "Levetiracetam", spec: "500mg/5ml/vial", 
            strength: 500, unitName: "vial",
            dosages: {
                neonate: null,
                infant: { min: 10, max: 30, freq: "Q12H" },
                child: { min: 10, max: 30, freq: "Q12H" }
            },
            rangeText: "10-30 mg/kg/dose Q12H"
        },
        { 
            name: "Anxicam inj★", generic: "Lorazepam inj★", spec: "2mg/ml/amp", 
            strength: 2, unitName: "amp",
            dosages: {
                neonate: null,
                infant: { min: 0.05, max: 0.1, freq: "" },
                child: { min: 0.05, max: 0.1, freq: "" }
            },
            rangeText: "0.05-0.1 mg/kg/dose Max 4mg"
        },
        { 
            name: "Dormicum(5mg/amp)★", generic: "Midazolam(5mg/amp) inj★", spec: "5mg/ml/amp", 
            strength: 5, unitName: "amp",
            dosages: {
                neonate: null,
                infant: { min: 0.15, max: 0.2, freq: "" },
                child: { min: 0.15, max: 0.2, freq: "" }
            },
            rangeText: "0.15-0.2 mg/kg/dose Max 5mg"
        },
        { 
            name: "Dupin inj★", generic: "Diazepam", spec: "10mg/2ml/amp", 
            strength: 10, unitName: "amp",
            dosages: {
                neonate: null,
                infant: { min: 0.05, max: 0.3, freq: "" },
                child: { min: 0.05, max: 0.3, freq: "" }
            },
            rangeText: "Infant/Child : 0.05 to 0.3 mg/kg/dose"
        }
    ]
};
