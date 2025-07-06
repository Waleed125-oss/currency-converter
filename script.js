const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const amountInput = document.getElementById("amount");
const rateInfo = document.getElementById("rate-info");
const resultDiv = document.getElementById("result");

// Expanded mapping for currency to ISO 3166-1 alpha-2 country codes
const currencyToCountry = {
  AED: "ae", AFN: "af", ALL: "al", AMD: "am", ANG: "nl", AOA: "ao",
  ARS: "ar", AUD: "au", AWG: "aw", AZN: "az", BAM: "ba", BBD: "bb",
  BDT: "bd", BGN: "bg", BHD: "bh", BIF: "bi", BMD: "bm", BND: "bn",
  BOB: "bo", BRL: "br", BSD: "bs", BTN: "bt", BWP: "bw", BYN: "by",
  BZD: "bz", CAD: "ca", CDF: "cd", CHF: "ch", CLP: "cl", CNY: "cn",
  COP: "co", CRC: "cr", CUP: "cu", CVE: "cv", CZK: "cz", DJF: "dj",
  DKK: "dk", DOP: "do", DZD: "dz", EGP: "eg", ERN: "er", ETB: "et",
  EUR: "eu", FJD: "fj", FKP: "fk", FOK: "fo", GBP: "gb", GEL: "ge",
  GGP: "gg", GHS: "gh", GIP: "gi", GMD: "gm", GNF: "gn", GTQ: "gt",
  GYD: "gy", HKD: "hk", HNL: "hn", HRK: "hr", HTG: "ht", HUF: "hu",
  IDR: "id", ILS: "il", IMP: "im", INR: "in", IQD: "iq", IRR: "ir",
  ISK: "is", JEP: "je", JMD: "jm", JOD: "jo", JPY: "jp", KES: "ke",
  KGS: "kg", KHR: "kh", KID: "ki", KMF: "km", KRW: "kr", KWD: "kw",
  KYD: "ky", KZT: "kz", LAK: "la", LBP: "lb", LKR: "lk", LRD: "lr",
  LSL: "ls", LYD: "ly", MAD: "ma", MDL: "md", MGA: "mg", MKD: "mk",
  MMK: "mm", MNT: "mn", MOP: "mo", MRU: "mr", MUR: "mu", MVR: "mv",
  MWK: "mw", MXN: "mx", MYR: "my", MZN: "mz", NAD: "na", NGN: "ng",
  NIO: "ni", NOK: "no", NPR: "np", NZD: "nz", OMR: "om", PAB: "pa",
  PEN: "pe", PGK: "pg", PHP: "ph", PKR: "pk", PLN: "pl", PYG: "py",
  QAR: "qa", RON: "ro", RSD: "rs", RUB: "ru", RWF: "rw", SAR: "sa",
  SBD: "sb", SCR: "sc", SDG: "sd", SEK: "se", SGD: "sg", SHP: "sh",
  SLE: "sl", SLL: "sl", SOS: "so", SRD: "sr", SSP: "ss", STN: "st",
  SYP: "sy", SZL: "sz", THB: "th", TJS: "tj", TMT: "tm", TND: "tn",
  TOP: "to", TRY: "tr", TTD: "tt", TVD: "tv", TWD: "tw", TZS: "tz",
  UAH: "ua", UGX: "ug", USD: "us", UYU: "uy", UZS: "uz", VES: "ve",
  VND: "vn", VUV: "vu", WST: "ws", XAF: "cm", XCD: "ag", XOF: "bj",
  YER: "ye", ZAR: "za", ZMW: "zm", ZWL: "zw"
};

function setFlag(curr, img) {
  const cc = currencyToCountry[curr];
  if (cc) {
    img.src = `https://flagcdn.com/48x36/${cc}.png`;
    img.alt = cc.toUpperCase() + " flag";
  } else {
    img.src = "https://flagcdn.com/48x36/un.png"; // fallback: UN flag
    img.alt = "Unknown flag";
  }
}

function updateFlags() {
  setFlag(fromCurrency.value, fromFlag);
  setFlag(toCurrency.value, toFlag);
}

async function populateCurrencies() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    const symbols = Object.keys(data.rates);

    symbols.forEach(code => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.text = code;
      fromCurrency.appendChild(opt);
      toCurrency.appendChild(opt.cloneNode(true));
    });

    fromCurrency.value = "USD";
    toCurrency.value = "PKR";
    updateFlags();
  } catch (err) {
    console.error("Dropdown load failed", err);
    resultDiv.innerText = "Could not load currencies.";
  }
}

async function convertCurrency() {
  const amt = parseFloat(amountInput.value);
  if (!amt || amt <= 0) {
    resultDiv.innerText = "Invalid amount.";
    return;
  }
  try {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();

    if (!data.rates[to]) {
      resultDiv.innerText = "Conversion failed.";
      return;
    }

    const rate = data.rates[to];
    rateInfo.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    resultDiv.innerText = `${amt} ${from} = ${(amt * rate).toFixed(2)} ${to}`;
  } catch (err) {
    resultDiv.innerText = "Error during conversion.";
    console.error("Error converting currency", err);
  }
}

populateCurrencies();
fromCurrency.addEventListener("change", updateFlags);
toCurrency.addEventListener("change", updateFlags);
