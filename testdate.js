function xl_mod(a, b) {
    return a - b * Math.floor(a / b)
}

function athika_mas(i_year){
    athi = parseInt(xl_mod((i_year - 78) - 0.45222, 2.7118886))
    return athi <= 1
}

function l_day_in_year(i_year){
    if (athika_mas(i_year)){
        return 384
    }
    else if (athika_var(i_year)){
        return 355
    }
    else{
        return 354
    }
}

function athika_surathin(i_year){
    if (i_year % 400 == 0){
        return True
    }
    else if (i_year % 100 == 0){
        return False
    }
    else if (i_year % 4 == 0){
        return True
    }
    else{
        return False
    }
}

function nodi_year(i_year){
    // return 366 if athika_surathin(i_year) else 365
    return athika_surathin(i_year) ? 366 : 365
}

const start_y = [
    [1901, 0.122733000004352], [1906, 0.0191890000045229], [1911, -0.0843549999953059],
    [1916, -0.187898999995135], [1921, -0.291442999994964], [1926, 0.0744250000052413],
    [1931, -0.0291189999945876], [1936, -0.132662999994416], [1941, -0.236206999994245],
    [1946, -0.339750999994074], [1951, -0.443294999993903], [1956, -0.0774269999936981],
    [1961, -0.180970999993527], [1966, -0.284514999993356], [1971, -0.388058999993185],
    [1976, -0.491602999993014], [1981, -0.595146999992842], [1986, -0.698690999992671],
    [1991, -0.332822999992466], [1996, -0.436366999992295], [2001, -0.539910999992124],
    [2006, -0.643454999991953], [2011, 0.253001000008218], [2016, 0.149457000008389],
    [2021, -0.484674999991406], [2026, -0.588218999991235], [2031, 0.308237000008937],
    [2036, 0.204693000009108], [2041, 0.101149000009279], [2046, -0.00239499999055015],
    [2051, -0.105938999990379], [2056, 0.259929000009826], [2061, 0.156385000009997],
    [2066, 0.0528410000101682], [2071, -0.0507029999896607], [2076, -0.15424699998949],
    [2081, -0.257790999989318], [2086, 0.108077000010887], [2091, 0.00453300001105772],
    [2096, -0.0990109999887712], [2101, -0.2025549999886], [2106, -0.306098999988429],
    [2111, -0.409642999988258], [2116, -0.0437749999880528], [2121, -0.147318999987882],
    [2126, -0.250862999987711], [2131, -0.354406999987539], [2136, -0.457950999987368],
    [2141, -0.561494999987197], [2146, -0.665038999987026], [2151, -0.299170999986821],
    [2156, -0.40271499998665], [2161, -0.506258999986479], [2166, -0.609802999986308],
    [2171, -0.713346999986137], [2176, 0.183109000014035], [2181, -0.45102299998576],
    [2186, -0.554566999985589], [2191, 0.341889000014582], [2196, 0.238345000014753],
    [2201, 0.134801000014924], [2206, 0.0312570000150951], [2211, -0.0722869999847338],
    [2216, 0.293581000015471], [2221, 0.190037000015642], [2226, 0.0864930000158135],
    [2231, -0.0170509999840154], [2236, -0.120594999983844], [2241, -0.224138999983673],
    [2246, 0.141729000016532], [2251, 0.038185000016703], [2256, -0.0653589999831259],
    [2261, -0.168902999982955], [2266, -0.272446999982784], [2271, -0.375990999982613],
    [2276, -0.0101229999824075], [2281, -0.113666999982236], [2286, -0.217210999982065],
    [2291, -0.320754999981894], [2296, -0.424298999981723], [2301, -0.527842999981552],
    [2306, -0.631386999981381], [2311, -0.265518999981176], [2316, -0.369062999981005],
    [2321, -0.472606999980834], [2326, -0.576150999980662], [2331, -0.679694999980491],
    [2336, 0.21676100001968], [2341, -0.417370999980115], [2346, -0.520914999979944],
    [2351, -0.624458999979773], [2356, 0.271997000020398], [2361, 0.168453000020569],
    [2366, 0.0649090000207404], [2371, -0.0386349999790885], [2376, 0.327233000021117],
    [2381, 0.223689000021288], [2386, 0.120145000021459], [2391, 0.0166010000216299],
    [2396, -0.086942999978199], [2401, -0.190486999978028], [2406, 0.175381000022177],
    [2411, 0.0718370000223483], [2416, -0.0317069999774806], [2421, -0.135250999977309],
    [2426, -0.238794999977138], [2431, -0.342338999976967], [2436, 0.0235290000232378],
    [2441, -0.0800149999765911], [2446, -0.18355899997642], [2451, -0.287102999976249],
    [2456, -0.390646999976078]
];

function deviation(i_year){
    let f_year = null;
    let f_dev = 0.0;
    
    // In Python, 'reversed(start_y)' is used. 
    // In JavaScript, we can create a temporary reversed copy for iteration.
    const reversed_start_y = [...start_y].reverse();
    
    // 1. Find the starting deviation (f_year, f_dev)
    for (const [year, dev] of reversed_start_y) {
        if (year <= i_year) {
            f_year = year;
            f_dev = dev;
            break;
        }
    }
    
    // 2. Handle cases where no starting year is found
    if (f_year === null) {
        return 0.0;
    }
    
    // 3. Handle case where input year matches the starting year
    if (i_year === f_year) {
        return f_dev;
    }
    
    // 4. Calculate deviation for years between f_year and i_year
    let current_dev = f_dev;
    
    for (let year = f_year + 1; year <= i_year; year++) {
        const prev_year = year - 1;
        let delta;
        
        if (athika_mas(prev_year)) {
            delta = -0.102356;
        } else if (athika_var(prev_year)) {
            delta = -0.632944;
        } else {
            delta = 0.367056;
        }
        
        current_dev += delta;
    }
    
    return current_dev;
}

function athika_var(i_year){
    if (athika_mas(i_year)){
        return False
    }
    else{
        if (athika_mas(i_year + 1)){
            cutoff = 1.69501433191599e-02
        }
        else{
            cutoff = -1.42223099315486e-02
        }
        return deviation(i_year) > cutoff
    }
}

const s_dates = [
  [1902, new Date(1902, 10, 30)], [1912, new Date(1912, 11, 8)],
  [1922, new Date(1922, 10, 19)], [1932, new Date(1932, 10, 27)],
  [1942, new Date(1942, 11, 7)], [1952, new Date(1952, 10, 16)],
  [1962, new Date(1962, 10, 26)], [1972, new Date(1972, 11, 5)],
  [1982, new Date(1982, 10, 15)], [1992, new Date(1992, 10, 24)],
  [2002, new Date(2002, 11, 4)], [2012, new Date(2012, 10, 13)],
  [2022, new Date(2022, 10, 23)], [2032, new Date(2032, 11, 2)],
  [2042, new Date(2042, 11, 12)], [2052, new Date(2052, 10, 21)],
  [2062, new Date(2062, 11, 1)], [2072, new Date(2072, 11, 9)],
  [2082, new Date(2082, 10, 20)], [2092, new Date(2092, 10, 28)],
  [2102, new Date(2102, 11, 9)], [2112, new Date(2112, 10, 18)],
  [2122, new Date(2122, 10, 28)], [2132, new Date(2132, 11, 7)],
  [2142, new Date(2142, 10, 17)], [2152, new Date(2152, 10, 26)],
  [2162, new Date(2162, 11, 6)], [2172, new Date(2172, 10, 15)],
  [2182, new Date(2182, 10, 25)], [2192, new Date(2192, 11, 4)],
  [2202, new Date(2202, 11, 15)], [2212, new Date(2212, 10, 24)],
  [2222, new Date(2222, 11, 4)], [2232, new Date(2232, 11, 12)],
  [2242, new Date(2242, 10, 23)], [2252, new Date(2252, 11, 1)],
  [2262, new Date(2262, 11, 11)], [2272, new Date(2272, 10, 20)],
  [2282, new Date(2282, 10, 30)], [2292, new Date(2292, 11, 9)],
  [2302, new Date(2302, 10, 20)], [2312, new Date(2312, 10, 29)],
  [2322, new Date(2322, 11, 9)], [2332, new Date(2332, 10, 18)],
  [2342, new Date(2342, 10, 28)], [2352, new Date(2352, 11, 7)],
  [2362, new Date(2362, 11, 17)], [2372, new Date(2372, 10, 26)],
  [2382, new Date(2382, 11, 6)], [2392, new Date(2392, 11, 14)],
  [2402, new Date(2402, 10, 25)], [2412, new Date(2412, 11, 3)],
  [2422, new Date(2422, 11, 13)], [2432, new Date(2432, 10, 23)],
  [2442, new Date(2442, 11, 2)], [2452, new Date(2452, 11, 11)]
];

function thl_date(i_date, options = {}) {
  const {
    thai_number = false,
    thai_zodiac = false,
    era = 0,
    z_option = false,
    holiday = false
  } = options;

  // Convert BE input year to CE
  const ce_year = i_date.getFullYear() - 543;

  // Check if CE year is within supported range
  if (ce_year < 1903 || ce_year > 2460) {
    return "ไม่รองรับ";
  }

  // Adjusted date (Gregorian)
  const adjusted_date = new Date(ce_year, i_date.getMonth(), i_date.getDate());

  // Find begin_date from s_dates
  const c_year = ce_year - 1;
  let begin_date = null;
  for (let i = s_dates.length - 1; i >= 0; i--) {
    const [year, date] = s_dates[i];
    if (year <= c_year) {
      begin_date = date;
      break;
    }
  }
  if (!begin_date) return "ไม่รองรับ";

  // Calculate current_date
  let current_date = new Date(begin_date);
  for (let y = current_date.getFullYear() + 1; y < adjusted_date.getFullYear(); y++) {
    const days = l_day_in_year(y);
    current_date.setDate(current_date.getDate() + days);
  }

  const r_day_prev = (new Date(current_date.getFullYear(), 11, 31) - current_date) / (1000 * 60 * 60 * 24);
  const day_of_year = Math.floor((adjusted_date - new Date(adjusted_date.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
  let day_from_one = r_day_prev + day_of_year + 1;
  const nb_l_day_year = l_day_in_year(adjusted_date.getFullYear());

  let th_s = "";
  let th_m = 0;
  let th_z = 0;
  let dofy = day_from_one;

  // Lunar month/day calculations
  if (nb_l_day_year === 354) {
    const months = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];
    for (let j = 0; j < 14; j++) {
      if (dofy <= months[j]) {
        th_m = j + 1;
        break;
      }
      dofy -= months[j];
    }
    if (th_m > 12) {
      th_m -= 12;
      th_z = 1;
    }
    th_s = dofy > 15 ? "แรม " : "ขึ้น ";
    dofy = dofy > 15 ? dofy - 15 : dofy;
  } else if (nb_l_day_year === 355) {
    const months = [29, 30, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 30];
    for (let j = 0; j < 14; j++) {
      if (dofy <= months[j]) {
        th_m = j + 1;
        break;
      }
      dofy -= months[j];
    }
    if (th_m > 12) {
      th_m -= 12;
      th_z = 1;
    }
    th_s = dofy > 15 ? "แรม " : "ขึ้น ";
    dofy = dofy > 15 ? dofy - 15 : dofy;
  } else if (nb_l_day_year === 384) {
    const months = [29, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30];
    for (let j = 0; j < 15; j++) {
      if (dofy <= months[j]) {
        th_m = j + 1;
        break;
      }
      dofy -= months[j];
    }
    if (th_m > 13) {
      th_m -= 13;
      th_z = 1;
    }
    if (th_m === 9) th_m = 88;
    else if ([10, 11, 12].includes(th_m)) th_m -= 2;
    th_s = dofy > 15 ? "แรม " : "ขึ้น ";
    dofy = dofy > 15 ? dofy - 15 : dofy;
  }

  let result = `${th_s}${dofy} ค่ำ เดือน ${th_m}`;

  // Thai number conversion
  if (thai_number) {
    const thai_digits = {
      '0': '๐', '1': '๑', '2': '๒', '3': '๓', '4': '๔',
      '5': '๕', '6': '๖', '7': '๗', '8': '๘', '9': '๙'
    };
    result = result.replace(/\d/g, d => thai_digits[d]);
  }

  // Thai zodiac
  if (thai_zodiac) {
    const zodiac_year = z_option ? adjusted_date.getFullYear() + th_z : adjusted_date.getFullYear();
    const zodiac = th_zodiac(zodiac_year);
    result += ` ปี${zodiac}`;
  }

  // Era formatting
  let era_str = "";
  if (era === 1) {
    era_str = ` พุทธศักราช ${i_date.getFullYear()}`;
  } else if (era === 2) {
    era_str = ` จุลศักราช ${ce_year - 638}`;
  } else if (era === 3) {
    era_str = ` มหาศักราช ${ce_year - 78}`;
  } else if (era === 4) {
    era_str = ` รัตนโกสินทร์ศก ${ce_year - 1781}`;
  } else if (era === 5) {
    era_str = ` คริสตศักราช ${ce_year}`;
  }

  if (thai_number && era_str) {
    const thai_digits = {
      '0': '๐', '1': '๑', '2': '๒', '3': '๓', '4': '๔',
      '5': '๕', '6': '๖', '7': '๗', '8': '๘', '9': '๙'
    };
    era_str = era_str.replace(/\d/g, d => thai_digits[d]);
  }

  result += era_str;

  // Holiday detection
  if (holiday) {
    const holiday_str = th_lunar_holiday(adjusted_date);
    if (holiday_str) result += ` ${holiday_str}`;
  }

  return result.trim();
}

function th_zodiac(i_year){
    zodiac = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"]
    mod = ((i_year - 3) % 12) - 1
    return zodiac[mod]
}

function th_lunar_holiday(i_date) {
  let holidays;

  if (athika_mas(i_date.getFullYear())) {
        holidays = {
            "ขึ้น 15 ค่ำ เดือน 4": "วันมาฆบูชา",
            "ขึ้น 15 ค่ำ เดือน 7": "วันวิสาขบูชา",
            "แรม 8 ค่ำ เดือน 7": "วันอัฏฐมีบูชา",
            "ขึ้น 15 ค่ำ เดือน 88": "วันอาสาฬหบูชา",
            "แรม 1 ค่ำ เดือน 88": "วันเข้าพรรษา",
            "ขึ้น 15 ค่ำ เดือน 11": "วันออกพรรษา",
            "ขึ้น 15 ค่ำ เดือน 12": "วันลอยกระทง"
    };
  } else {
        holidays = {
            "ขึ้น 15 ค่ำ เดือน 3": "วันมาฆบูชา",
            "ขึ้น 15 ค่ำ เดือน 6": "วันวิสาขบูชา",
            "แรม 8 ค่ำ เดือน 6": "วันอัฏฐมีบูชา",
            "ขึ้น 15 ค่ำ เดือน 8": "วันอาสาฬหบูชา",
            "แรม 1 ค่ำ เดือน 8": "วันเข้าพรรษา",
            "ขึ้น 15 ค่ำ เดือน 11": "วันออกพรรษา",
            "ขึ้น 15 ค่ำ เดือน 12": "วันลอยกระทง"
    };
    }

  const lunar_date = thl_date(i_date);
  return holidays[lunar_date] || "";
}

function getChineseNewYear(year) {
  // วันแรกของเดือน 1 ในปฏิทินจีน คือวันตรุษจีน
  const result = solarlunar.lunar2solar(year, 1, 1);
  return new Date(result.cYear, result.cMonth - 1, result.cDay);
}

let nows = new Date();

let yestomorrow = [nows.getDate() - 1, nows.getDate(), nows.getDate() + 1];

for (let dt of yestomorrow) {
  console.log(thl_date(new Date(nows.getFullYear()+543, nows.getMonth(), dt), {holiday: true}))
}
    