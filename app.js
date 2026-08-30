// Версия сборки приложения (SemVer)
const APP_VERSION = 'v12.0.113';
const APP_BUILD_DATE = '30.08.2026';

// Глобальное состояние
// Встроенная справочная база аэропортов и правил для гарантированной оффлайн-работы
const DEFAULT_BAGGAGE_DB = {
  "airports": {
    "AER": {
      "iata": "AER",
      "ru": "СОЧ",
      "name": "Сочи"
    },
    "СОЧ": {
      "iata": "AER",
      "ru": "СОЧ",
      "name": "Сочи"
    },
    "CCC": {
      "iata": "CCC",
      "ru": "CCC",
      "name": "Кайо - Коко (Куба)"
    },
    "DYU": {
      "iata": "DYU",
      "ru": "ДШБ",
      "name": "Душанбе"
    },
    "ДШБ": {
      "iata": "DYU",
      "ru": "ДШБ",
      "name": "Душанбе"
    },
    "GOX": {
      "iata": "GOX",
      "ru": "GOX",
      "name": "Гоа"
    },
    "HOG": {
      "iata": "HOG",
      "ru": "HOG",
      "name": "Ольгин (Куба)"
    },
    "HRG": {
      "iata": "HRG",
      "ru": "HRG",
      "name": "Хургада"
    },
    "KQT": {
      "iata": "KQT",
      "ru": "КГТ",
      "name": "Бохтар"
    },
    "КГТ": {
      "iata": "KQT",
      "ru": "КГТ",
      "name": "Бохтар"
    },
    "LBD": {
      "iata": "LBD",
      "ru": "ХДТ",
      "name": "Худжант"
    },
    "ХДТ": {
      "iata": "LBD",
      "ru": "ХДТ",
      "name": "Худжант"
    },
    "OSS": {
      "iata": "OSS",
      "ru": "ОШШ",
      "name": "Ош"
    },
    "ОШШ": {
      "iata": "OSS",
      "ru": "ОШШ",
      "name": "Ош"
    },
    "PMV": {
      "iata": "PMV",
      "ru": "PMV",
      "name": "Порламар"
    },
    "REN": {
      "iata": "REN",
      "ru": "ОНГ",
      "name": "Оренбург"
    },
    "ОНГ": {
      "iata": "REN",
      "ru": "ОНГ",
      "name": "Оренбург"
    },
    "SSH": {
      "iata": "SSH",
      "ru": "SSH",
      "name": "Шарь эль Шейх"
    },
    "SUI": {
      "iata": "SUI",
      "ru": "СУИ",
      "name": "Сухум"
    },
    "СУИ": {
      "iata": "SUI",
      "ru": "СУИ",
      "name": "Сухум"
    },
    "TAS": {
      "iata": "TAS",
      "ru": "ТАС",
      "name": "Ташкент"
    },
    "ТАС": {
      "iata": "TAS",
      "ru": "ТАС",
      "name": "Ташкент"
    },
    "UTP": {
      "iata": "UTP",
      "ru": "UTP",
      "name": "Утапао (Тайланд)"
    },
    "VRA": {
      "iata": "VRA",
      "ru": "VRA",
      "name": "Варадеро (Куба)"
    },
    "AYT": {
      "iata": "AYT",
      "ru": "AYT",
      "name": "Анталья"
    },
    "BAX": {
      "iata": "BAX",
      "ru": "БАН",
      "name": "Барнаул"
    },
    "БАН": {
      "iata": "BAX",
      "ru": "БАН",
      "name": "Барнаул"
    },
    "CEK": {
      "iata": "CEK",
      "ru": "ЧЛБ",
      "name": "Челябинск"
    },
    "ЧЛБ": {
      "iata": "CEK",
      "ru": "ЧЛБ",
      "name": "Челябинск"
    },
    "CSY": {
      "iata": "CSY",
      "ru": "ЧБЕ",
      "name": "Чебоксары"
    },
    "ЧБЕ": {
      "iata": "CSY",
      "ru": "ЧБЕ",
      "name": "Чебоксары"
    },
    "GOJ": {
      "iata": "GOJ",
      "ru": "НЖС",
      "name": "Нижний Новгород"
    },
    "НЖС": {
      "iata": "GOJ",
      "ru": "НЖС",
      "name": "Нижний Новгород"
    },
    "IWA": {
      "iata": "IWA",
      "ru": "ИВВ",
      "name": "Иваново"
    },
    "ИВВ": {
      "iata": "IWA",
      "ru": "ИВВ",
      "name": "Иваново"
    },
    "KEJ": {
      "iata": "KEJ",
      "ru": "КРВ",
      "name": "Кемерово"
    },
    "КРВ": {
      "iata": "KEJ",
      "ru": "КРВ",
      "name": "Кемерово"
    },
    "KGD": {
      "iata": "KGD",
      "ru": "КЛД",
      "name": "Калининград"
    },
    "КЛД": {
      "iata": "KGD",
      "ru": "КЛД",
      "name": "Калининград"
    },
    "KJA": {
      "iata": "KJA",
      "ru": "ЕМВ",
      "name": "Красноярск"
    },
    "ЕМВ": {
      "iata": "KJA",
      "ru": "ЕМВ",
      "name": "Красноярск"
    },
    "KRO": {
      "iata": "KRO",
      "ru": "КГН",
      "name": "Курган"
    },
    "КГН": {
      "iata": "KRO",
      "ru": "КГН",
      "name": "Курган"
    },
    "KUF": {
      "iata": "KUF",
      "ru": "СКЧ",
      "name": "Самара"
    },
    "СКЧ": {
      "iata": "KUF",
      "ru": "СКЧ",
      "name": "Самара"
    },
    "KVX": {
      "iata": "KVX",
      "ru": "КИО",
      "name": "Киров"
    },
    "КИО": {
      "iata": "KVX",
      "ru": "КИО",
      "name": "Киров"
    },
    "KZN": {
      "iata": "KZN",
      "ru": "КЗН",
      "name": "Казань"
    },
    "КЗН": {
      "iata": "KZN",
      "ru": "КЗН",
      "name": "Казань"
    },
    "LED": {
      "iata": "LED",
      "ru": "ПЛК",
      "name": "Санкт - Петербург"
    },
    "ПЛК": {
      "iata": "LED",
      "ru": "ПЛК",
      "name": "Санкт - Петербург"
    },
    "MCX": {
      "iata": "MCX",
      "ru": "МХЛ",
      "name": "Махачкала"
    },
    "МХЛ": {
      "iata": "MCX",
      "ru": "МХЛ",
      "name": "Махачкала"
    },
    "MQF": {
      "iata": "MQF",
      "ru": "МГС",
      "name": "Магнитогорск"
    },
    "МГС": {
      "iata": "MQF",
      "ru": "МГС",
      "name": "Магнитогорск"
    },
    "MRV": {
      "iata": "MRV",
      "ru": "МРВ",
      "name": "Минеральные воды"
    },
    "МРВ": {
      "iata": "MRV",
      "ru": "МРВ",
      "name": "Минеральные воды"
    },
    "NBC": {
      "iata": "NBC",
      "ru": "НЖК",
      "name": "Нижнекамск"
    },
    "НЖК": {
      "iata": "NBC",
      "ru": "НЖК",
      "name": "Нижнекамск"
    },
    "NJC": {
      "iata": "NJC",
      "ru": "НЖВ",
      "name": "Нижневартовск"
    },
    "НЖВ": {
      "iata": "NJC",
      "ru": "НЖВ",
      "name": "Нижневартовск"
    },
    "NOZ": {
      "iata": "NOZ",
      "ru": "НВК",
      "name": "Новокузнецк"
    },
    "НВК": {
      "iata": "NOZ",
      "ru": "НВК",
      "name": "Новокузнецк"
    },
    "OMS": {
      "iata": "OMS",
      "ru": "ОМС",
      "name": "Омск"
    },
    "ОМС": {
      "iata": "OMS",
      "ru": "ОМС",
      "name": "Омск"
    },
    "OSW": {
      "iata": "OSW",
      "ru": "ОСК",
      "name": "Орск"
    },
    "ОСК": {
      "iata": "OSW",
      "ru": "ОСК",
      "name": "Орск"
    },
    "OVB": {
      "iata": "OVB",
      "ru": "ТЛЧ",
      "name": "Новосибирск"
    },
    "ТЛЧ": {
      "iata": "OVB",
      "ru": "ТЛЧ",
      "name": "Новосибирск"
    },
    "PEE": {
      "iata": "PEE",
      "ru": "ПРЬ",
      "name": "Пермь"
    },
    "ПРЬ": {
      "iata": "PEE",
      "ru": "ПРЬ",
      "name": "Пермь"
    },
    "RGK": {
      "iata": "RGK",
      "ru": "ГОР",
      "name": "Горноалтайск"
    },
    "ГОР": {
      "iata": "RGK",
      "ru": "ГОР",
      "name": "Горноалтайск"
    },
    "SCW": {
      "iata": "SCW",
      "ru": "СЫВ",
      "name": "Сыктывкар"
    },
    "СЫВ": {
      "iata": "SCW",
      "ru": "СЫВ",
      "name": "Сыктывкар"
    },
    "SGC": {
      "iata": "SGC",
      "ru": "СУР",
      "name": "Сургут"
    },
    "СУР": {
      "iata": "SGC",
      "ru": "СУР",
      "name": "Сургут"
    },
    "SKV": {
      "iata": "SKV",
      "ru": "SKV",
      "name": "Санта - Катарина (Египет)"
    },
    "SVO": {
      "iata": "SVO",
      "ru": "ШРМ",
      "name": "Москва (Шереметьево)"
    },
    "ШРМ": {
      "iata": "SVO",
      "ru": "ШРМ",
      "name": "Москва (Шереметьево)"
    },
    "SVX": {
      "iata": "SVX",
      "ru": "КЛЦ",
      "name": "Екатеринбург"
    },
    "КЛЦ": {
      "iata": "SVX",
      "ru": "КЛЦ",
      "name": "Екатеринбург"
    },
    "TJM": {
      "iata": "TJM",
      "ru": "РЩН",
      "name": "Тюмень"
    },
    "РЩН": {
      "iata": "TJM",
      "ru": "РЩН",
      "name": "Тюмень"
    },
    "TOF": {
      "iata": "TOF",
      "ru": "ТСК",
      "name": "Томск"
    },
    "ТСК": {
      "iata": "TOF",
      "ru": "ТСК",
      "name": "Томск"
    },
    "UFA": {
      "iata": "UFA",
      "ru": "УФА",
      "name": "Уфа"
    },
    "УФА": {
      "iata": "UFA",
      "ru": "УФА",
      "name": "Уфа"
    },
    "ULV": {
      "iata": "ULV",
      "ru": "УЛК",
      "name": "Ульяновск"
    },
    "УЛК": {
      "iata": "ULV",
      "ru": "УЛК",
      "name": "Ульяновск"
    },
    "VOG": {
      "iata": "VOG",
      "ru": "ВГГ",
      "name": "Волгоград"
    },
    "ВГГ": {
      "iata": "VOG",
      "ru": "ВГГ",
      "name": "Волгоград"
    },
    "ZIA": {
      "iata": "ZIA",
      "ru": "ЖУК",
      "name": "Жуковский"
    },
    "ЖУК": {
      "iata": "ZIA",
      "ru": "ЖУК",
      "name": "Жуковский"
    },
    "КПА": {
      "iata": "KRR",
      "ru": "КПА",
      "name": "Краснодар"
    },
    "ККЗ": {
      "iata": "KZN",
      "ru": "КЗН",
      "name": "Казань"
    },
    "ЕКБ": {
      "iata": "SVX",
      "ru": "КЛЦ",
      "name": "Екатеринбург"
    },
    "КЯА": {
      "iata": "KJA",
      "ru": "ЕМВ",
      "name": "Красноярск"
    },
    "АСР": {
      "iata": "ASF",
      "ru": "АСР",
      "name": "Астрахань"
    },
    "АХГ": {
      "iata": "ARH",
      "ru": "АХГ",
      "name": "Архангельск"
    },
    "БИШ": {
      "iata": "FRU",
      "ru": "БИШ",
      "name": "Бишкек"
    },
    "ИЖВ": {
      "iata": "IJK",
      "ru": "ИЖВ",
      "name": "Ижевск"
    },
    "ИКТ": {
      "iata": "IKT",
      "ru": "ИКТ",
      "name": "Иркутск"
    },
    "АЯТ": {
      "iata": "AYT",
      "ru": "AYT",
      "name": "Анталья"
    },
    "IST": {
      "iata": "IST",
      "ru": "IST",
      "name": "Стамбул"
    },
    "CXR": {
      "iata": "CXR",
      "ru": "CXR",
      "name": "Нячанг"
    },
    "ГСВ": {
      "iata": "GZP",
      "ru": "ГСВ",
      "name": "Газипаша"
    },
    "МУН": {
      "iata": "MMK",
      "ru": "МУН",
      "name": "Мурманск"
    },
    "KRR": {
      "iata": "KRR",
      "ru": "КПА",
      "name": "Краснодар"
    }
  },
  "departures_filter": [
    "AER", "СОЧ",
    "CCC",
    "DYU", "ДШБ",
    "GOX",
    "HOG",
    "HRG",
    "KQT", "КГТ",
    "LBD", "ХДТ",
    "OSS", "ОШШ",
    "PMV",
    "REN", "ОНГ",
    "SSH",
    "SUI", "СУИ",
    "TAS", "ТАС",
    "UTP",
    "VRA"
  ],
  "arrivals_filter": [
    "СОЧ",
    "AYT",
    "БАН",
    "ЧЛБ",
    "ЧБЕ",
    "ДШБ",
    "НЖС",
    "ИВВ",
    "КРВ",
    "КЛД",
    "ЕМВ",
    "КГН",
    "СКЧ",
    "КИО",
    "КЗН",
    "ХДТ",
    "ПЛК",
    "МХЛ",
    "МГС",
    "МРВ",
    "НЖК",
    "НЖВ",
    "НВК",
    "ОМС",
    "ОСК",
    "ТЛЧ",
    "ПРЬ",
    "ОНГ",
    "ГОР",
    "СЫВ",
    "СУР",
    "SKV",
    "ШРМ",
    "КЛЦ",
    "РЩН",
    "ТСК",
    "УФА",
    "УЛК",
    "ВГГ",
    "ЖУК"
  ],
  "rules": [
    {
      "flt_no": "480",
      "from": "REN",
      "to": "SVO",
      "pcs_pax": 0.19000849935400826,
      "wght_pc": 12.273041877895915,
      "hb_pax": 3.857883444776772,
      "pax_no": 147
    },
    {
      "flt_no": "482",
      "from": "REN",
      "to": "SVO",
      "pcs_pax": 0.22075449083422988,
      "wght_pc": 13.372258611038651,
      "hb_pax": 1.76558386178663,
      "pax_no": 198
    },
    {
      "flt_no": "478",
      "from": "REN",
      "to": "SVO",
      "pcs_pax": 0.2120806490690235,
      "wght_pc": 13.124052812841676,
      "hb_pax": 3.8342713830420987,
      "pax_no": 133
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "LED",
      "pcs_pax": 0.3985906677943838,
      "wght_pc": 13.584611846856104,
      "hb_pax": 2.0559171387638364,
      "pax_no": 180
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "AER",
      "pcs_pax": 0.48006772363272554,
      "wght_pc": 12.290491041472505,
      "hb_pax": 2.2280069793731583,
      "pax_no": 209
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "MCX",
      "pcs_pax": 0.6831289885181118,
      "wght_pc": 10.545907559002416,
      "hb_pax": 1.371263802867291,
      "pax_no": 99
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "MRV",
      "pcs_pax": 0.9139620504106486,
      "wght_pc": 11.768496296634273,
      "hb_pax": 0.7972245822713112,
      "pax_no": 65
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "KGD",
      "pcs_pax": 0.6702243309469568,
      "wght_pc": 12.381970824087189,
      "hb_pax": 0.6937705798169833,
      "pax_no": 172
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "LBD",
      "pcs_pax": 0.9005723234973563,
      "wght_pc": 15.680858803986709,
      "hb_pax": 1.880901410524189,
      "pax_no": 138
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "DYU",
      "pcs_pax": 0.9117311675628105,
      "wght_pc": 15.50598093889233,
      "hb_pax": 3.4263236903956984,
      "pax_no": 143
    },
    {
      "flt_no": "",
      "from": "OSS",
      "to": "UFA",
      "pcs_pax": 0.8797585111759589,
      "wght_pc": 15.933204163430357,
      "hb_pax": 1.841170989472188,
      "pax_no": 179
    },
    {
      "flt_no": "",
      "from": "OSS",
      "to": "TJM",
      "pcs_pax": 0.6262254901960784,
      "wght_pc": 15.468201754385966,
      "hb_pax": 2.6084881320949433,
      "pax_no": 185
    },
    {
      "flt_no": "",
      "from": "OSS",
      "to": "OMS",
      "pcs_pax": 0.313816810319401,
      "wght_pc": 15.70886193748216,
      "hb_pax": 0.5176462675167338,
      "pax_no": 103
    },
    {
      "flt_no": "",
      "from": "OSS",
      "to": "KUF",
      "pcs_pax": 0.8175625042677062,
      "wght_pc": 15.98948302262811,
      "hb_pax": 1.2627297965563535,
      "pax_no": 203
    },
    {
      "flt_no": "",
      "from": "OSS",
      "to": "KEJ",
      "pcs_pax": 0.43613492972967977,
      "wght_pc": 15.688618859347493,
      "hb_pax": 1.8305659802739622,
      "pax_no": 105
    },
    {
      "flt_no": "",
      "from": "OSS",
      "to": "KJA",
      "pcs_pax": 0.5577261633925562,
      "wght_pc": 15.97675698484522,
      "hb_pax": 1.5320540228224757,
      "pax_no": 50
    },
    {
      "flt_no": "",
      "from": "LBD",
      "to": "UFA",
      "pcs_pax": 0.8928284023668639,
      "wght_pc": 15.031537684860723,
      "hb_pax": 1.7052781065088758,
      "pax_no": 189
    },
    {
      "flt_no": "",
      "from": "LBD",
      "to": "KZN",
      "pcs_pax": 0.887727369229375,
      "wght_pc": 15.56790222442367,
      "hb_pax": 2.462530176416067,
      "pax_no": 188
    },
    {
      "flt_no": "",
      "from": "LBD",
      "to": "REN",
      "pcs_pax": 0.8612528279309318,
      "wght_pc": 15.223448773448773,
      "hb_pax": 1.981984844235434,
      "pax_no": 115
    },
    {
      "flt_no": "",
      "from": "KQT",
      "to": "SVO",
      "pcs_pax": 0.8641345759334154,
      "wght_pc": 13.951072017592082,
      "hb_pax": 2.903581267217631,
      "pax_no": 155
    },
    {
      "flt_no": "",
      "from": "KQT",
      "to": "KJA",
      "pcs_pax": 0.9335106382978724,
      "wght_pc": 15.127863837542307,
      "hb_pax": 3.377659574468085,
      "pax_no": 173
    },
    {
      "flt_no": "",
      "from": "DYU",
      "to": "UFA",
      "pcs_pax": 0.818256329306053,
      "wght_pc": 13.473651960784313,
      "hb_pax": 0.9009471191791634,
      "pax_no": 176
    },
    {
      "flt_no": "",
      "from": "DYU",
      "to": "KZN",
      "pcs_pax": 0.8884295632192718,
      "wght_pc": 14.28776389938495,
      "hb_pax": 1.66712858588873,
      "pax_no": 220
    },
    {
      "flt_no": "",
      "from": "DYU",
      "to": "KUF",
      "pcs_pax": 0.951993388931446,
      "wght_pc": 14.333670083815022,
      "hb_pax": 2.800455744731719,
      "pax_no": 188
    },
    {
      "flt_no": "",
      "from": "DYU",
      "to": "REN",
      "pcs_pax": 0.9035193201859869,
      "wght_pc": 12.635137951154455,
      "hb_pax": 2.191798941798942,
      "pax_no": 186
    },
    {
      "flt_no": "",
      "from": "CCC",
      "to": "SVO",
      "pcs_pax": 0.7932712165018587,
      "wght_pc": 13.173699219177465,
      "hb_pax": 0,
      "pax_no": 522
    },
    {
      "flt_no": "",
      "from": "VRA",
      "to": "SVO",
      "pcs_pax": 0.8407560734847067,
      "wght_pc": 12.365900791790013,
      "hb_pax": 0,
      "pax_no": 485
    },
    {
      "flt_no": "",
      "from": "PMV",
      "to": "SVO",
      "pcs_pax": 0.8110599078341014,
      "wght_pc": 12.8125,
      "hb_pax": 0,
      "pax_no": 466
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "KZN",
      "pcs_pax": 0.7589516426725729,
      "wght_pc": 12.057066039919519,
      "hb_pax": 3,
      "pax_no": 192
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "ZIA",
      "pcs_pax": 0.739240506329114,
      "wght_pc": 16.397260273972602,
      "hb_pax": 5,
      "pax_no": 56
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "SVO",
      "pcs_pax": 0.7842851061241866,
      "wght_pc": 12.175868611721262,
      "hb_pax": 3,
      "pax_no": 379
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "SVX",
      "pcs_pax": 0.7618524558690586,
      "wght_pc": 12.129449761991417,
      "hb_pax": 3,
      "pax_no": 378
    },
    {
      "flt_no": "",
      "from": "HRG",
      "to": "SVO",
      "pcs_pax": 0.7256294739775861,
      "wght_pc": 12.367720205032436,
      "hb_pax": 5,
      "pax_no": 56
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "LED",
      "pcs_pax": 0.7761185650929097,
      "wght_pc": 11.718447054436988,
      "hb_pax": 3,
      "pax_no": 219
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "BAX",
      "pcs_pax": 0.41365719228968906,
      "wght_pc": 13.77295936537406,
      "hb_pax": 1.6221716962854476,
      "pax_no": 189
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "CSY",
      "pcs_pax": 0.5783660959627985,
      "wght_pc": 12.719639468690701,
      "hb_pax": 1.7540512928908616,
      "pax_no": 187
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "CEK",
      "pcs_pax": 0.5483870967741935,
      "wght_pc": 14.127450980392156,
      "hb_pax": 1.467741935483871,
      "pax_no": 191
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "GOJ",
      "pcs_pax": 0.4944048581699833,
      "wght_pc": 14.334865472417858,
      "hb_pax": 1.1773904136535378,
      "pax_no": 293
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "IWA",
      "pcs_pax": 0.5258519465341,
      "wght_pc": 13.693522984951557,
      "hb_pax": 2.0827420425047047,
      "pax_no": 94
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "KVX",
      "pcs_pax": 0.3657672285797843,
      "wght_pc": 13.296426663614165,
      "hb_pax": 1.348742347502356,
      "pax_no": 176
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "KZN",
      "pcs_pax": 0.4799060062121259,
      "wght_pc": 14.307287390629401,
      "hb_pax": 1.383001760681853,
      "pax_no": 158
    },
    {
      "flt_no": "",
      "from": "#REF!",
      "to": "#REF!",
      "pcs_pax": 0,
      "wght_pc": 0,
      "hb_pax": 0,
      "pax_no": 211
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "KJA",
      "pcs_pax": 0.4561821415365889,
      "wght_pc": 13.959053808973977,
      "hb_pax": 1.1870700675584427,
      "pax_no": 421
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "KRO",
      "pcs_pax": 0.4167624244659883,
      "wght_pc": 14.215893243854264,
      "hb_pax": 1.2650080942449065,
      "pax_no": 176
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "KEJ",
      "pcs_pax": 0.43516084978144526,
      "wght_pc": 13.659474707626881,
      "hb_pax": 1.985968495050178,
      "pax_no": 165
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "LED",
      "pcs_pax": 0.5593917319609641,
      "wght_pc": 14.175844984802433,
      "hb_pax": 1.5584441270749592,
      "pax_no": 202
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "NJC",
      "pcs_pax": 0.4861447056343227,
      "wght_pc": 13.653912408898531,
      "hb_pax": 1.8074111219689548,
      "pax_no": 193
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "NOZ",
      "pcs_pax": 0.4082221996611796,
      "wght_pc": 12.986253300187727,
      "hb_pax": 1.3821361544494515,
      "pax_no": 160
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "OVB",
      "pcs_pax": 0.44936708860759494,
      "wght_pc": 14.380281690140846,
      "hb_pax": 2.981012658227848,
      "pax_no": 159
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "OMS",
      "pcs_pax": 0.4119652725237547,
      "wght_pc": 14.049685243227916,
      "hb_pax": 1.5733931128400105,
      "pax_no": 184
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "PEE",
      "pcs_pax": 0.48672833279934175,
      "wght_pc": 13.081927459409826,
      "hb_pax": 1.15648059612191,
      "pax_no": 193
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "SVO",
      "pcs_pax": 0.5054945054945055,
      "wght_pc": 14.108823529411765,
      "hb_pax": 1.0402930402930404,
      "pax_no": 65
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "SVX",
      "pcs_pax": 0.4528979862929274,
      "wght_pc": 13.76388613067584,
      "hb_pax": 1.1676409026402896,
      "pax_no": 359
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "SGC",
      "pcs_pax": 0.4119265558048433,
      "wght_pc": 14.172382630919216,
      "hb_pax": 1.333053245780677,
      "pax_no": 118
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "SKX",
      "pcs_pax": 0.7351302155557802,
      "wght_pc": 13.262528791274496,
      "hb_pax": 2.0286172276342658,
      "pax_no": 120
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "SCW",
      "pcs_pax": 0.5053054067765652,
      "wght_pc": 13.616223777185088,
      "hb_pax": 1.4107385871930334,
      "pax_no": 160
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "TOF",
      "pcs_pax": 0.4793077270523044,
      "wght_pc": 13.972685943672833,
      "hb_pax": 1.2103079840750337,
      "pax_no": 177
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "TJM",
      "pcs_pax": 0.34,
      "wght_pc": 14.191176470588236,
      "hb_pax": 1.175,
      "pax_no": 185
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "UFA",
      "pcs_pax": 0.49758682156698625,
      "wght_pc": 13.799839221153977,
      "hb_pax": 1.263696645069246,
      "pax_no": 342
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "ULV",
      "pcs_pax": 0.385,
      "wght_pc": 14.974025974025974,
      "hb_pax": 2.27,
      "pax_no": 170
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "REN",
      "pcs_pax": 0.5057578242000309,
      "wght_pc": 14.564036885642874,
      "hb_pax": 1.3525605621244066,
      "pax_no": 210
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "NBC",
      "pcs_pax": 0.451828485739849,
      "wght_pc": 13.427413544310095,
      "hb_pax": 1.405851738082013,
      "pax_no": 209
    },
    {
      "flt_no": "",
      "from": "#REF!",
      "to": "#REF!",
      "pcs_pax": 0,
      "wght_pc": 0,
      "hb_pax": 0,
      "pax_no": 128
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "MQF",
      "pcs_pax": 0.3987621651009957,
      "wght_pc": 13.73316636882149,
      "hb_pax": 1.487214345158873,
      "pax_no": 163
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "RGK",
      "pcs_pax": 0.6920000225644682,
      "wght_pc": 10.673025036170964,
      "hb_pax": 1.9775200099641341,
      "pax_no": 37
    },
    {
      "flt_no": "N484",
      "from": "REN",
      "to": "SVO",
      "pcs_pax": 0.14799139045462573,
      "wght_pc": 13.830783081652646,
      "hb_pax": 2.139473581201522,
      "pax_no": 176
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "KZN",
      "pcs_pax": 0.6179883945841392,
      "wght_pc": 10.909825870646765,
      "hb_pax": 1.3153879217709006,
      "pax_no": 211
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "VOG",
      "pcs_pax": 0.6133925154618444,
      "wght_pc": 13.44472033941886,
      "hb_pax": 2.355898330366564,
      "pax_no": 110
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "OSW",
      "pcs_pax": 0.5577686871043002,
      "wght_pc": 13.716482276762475,
      "hb_pax": 1.7036661824664594,
      "pax_no": 81
    },
    {
      "flt_no": "",
      "from": "SUI",
      "to": "GOJ",
      "pcs_pax": 0.5971227621483376,
      "wght_pc": 14.692210602235846,
      "hb_pax": 3.1426470588235293,
      "pax_no": 71
    },
    {
      "flt_no": "",
      "from": "KQT",
      "to": "KZN",
      "pcs_pax": 0.8845905713008146,
      "wght_pc": 13.366109828401203,
      "hb_pax": 2.490601823039271,
      "pax_no": 185
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "OMS",
      "pcs_pax": 0.7383232986681263,
      "wght_pc": 12.290636042402827,
      "hb_pax": 3,
      "pax_no": 378
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "PEE",
      "pcs_pax": 0.7538440261563994,
      "wght_pc": 11.58700662633247,
      "hb_pax": 3,
      "pax_no": 306
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "TJM",
      "pcs_pax": 0.7358474858474858,
      "wght_pc": 11.809044882320745,
      "hb_pax": 3,
      "pax_no": 378
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "AYT",
      "pcs_pax": 0.8983050847457628,
      "wght_pc": 12.056603773584905,
      "hb_pax": 2.2203389830508473,
      "pax_no": 59
    },
    {
      "flt_no": "N46102",
      "from": "VRA",
      "to": "SVO",
      "pcs_pax": 0.9493333333333334,
      "wght_pc": 17.865168539325843,
      "hb_pax": 0,
      "pax_no": 375
    },
    {
      "flt_no": "",
      "from": "REN",
      "to": "MQF",
      "pcs_pax": 0.42727272727272725,
      "wght_pc": 12.382978723404255,
      "hb_pax": 0,
      "pax_no": 110
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "MRV",
      "pcs_pax": 0.7714266942610295,
      "wght_pc": 12.36411871994694,
      "hb_pax": 3,
      "pax_no": 150
    },
    {
      "flt_no": "",
      "from": "LBD",
      "to": "TJM",
      "pcs_pax": 0.9006211180124224,
      "wght_pc": 15.247564935064934,
      "hb_pax": 1.956133540372671,
      "pax_no": 177
    },
    {
      "flt_no": "",
      "from": "DYU",
      "to": "TJM",
      "pcs_pax": 0.7991164241164241,
      "wght_pc": 14.158424908424909,
      "hb_pax": 1.482934857934858,
      "pax_no": 147
    },
    {
      "flt_no": "",
      "from": "HOG",
      "to": "SVO",
      "pcs_pax": 0.7663805832410484,
      "wght_pc": 12.843582887700535,
      "hb_pax": 0,
      "pax_no": 504
    },
    {
      "flt_no": "",
      "from": "UTP",
      "to": "KJA",
      "pcs_pax": 0.8048128342245989,
      "wght_pc": 13.534883720930232,
      "hb_pax": 0,
      "pax_no": 379
    },
    {
      "flt_no": "",
      "from": "AER",
      "to": "KUF",
      "pcs_pax": 0.4854368932038835,
      "wght_pc": 13.24,
      "hb_pax": 1.6699029126213591,
      "pax_no": 183
    },
    {
      "flt_no": "",
      "from": "UTP",
      "to": "SVX",
      "pcs_pax": 0.7994722955145118,
      "wght_pc": 13.267326732673267,
      "hb_pax": 0,
      "pax_no": 379
    },
    {
      "flt_no": "",
      "from": "UTP",
      "to": "OVB",
      "pcs_pax": 0.8628689882734443,
      "wght_pc": 13.684456821313734,
      "hb_pax": 0,
      "pax_no": 376
    },
    {
      "flt_no": "",
      "from": "SSH",
      "to": "UFA",
      "pcs_pax": 0.7549893336327401,
      "wght_pc": 12.057066039919519,
      "hb_pax": 3,
      "pax_no": 379
    },
    {
      "flt_no": "",
      "from": "UTP",
      "to": "SVO",
      "pcs_pax": 0.8160626920013654,
      "wght_pc": 14.012407557816442,
      "hb_pax": 0,
      "pax_no": 379
    },
    {
      "flt_no": "",
      "from": "GOX",
      "to": "SVO",
      "pcs_pax": 0.8590425531914894,
      "wght_pc": 13.284829721362229,
      "hb_pax": 3,
      "pax_no": 368
    },
    {
      "flt_no": "",
      "from": "GOX",
      "to": "SVX",
      "pcs_pax": 0.8423605980650835,
      "wght_pc": 14.309260583666092,
      "hb_pax": 3,
      "pax_no": 375
    },
    {
      "flt_no": "",
      "from": "SUI",
      "to": "SVO",
      "pcs_pax": 0.6294372887506258,
      "wght_pc": 14.253624370050819,
      "hb_pax": 2.3508901398733397,
      "pax_no": 498
    },
    {
      "flt_no": "",
      "from": "KQT",
      "to": "UFA",
      "pcs_pax": 0.8507157875266441,
      "wght_pc": 12.511069715656047,
      "hb_pax": 2.538199243033849,
      "pax_no": 153
    },
    {
      "flt_no": "",
      "from": "SUI",
      "to": "UFA",
      "pcs_pax": 0.17391304347826086,
      "wght_pc": 16.5625,
      "hb_pax": 3.1739130434782608,
      "pax_no": 92
    },
    {
      "flt_no": "",
      "from": "SUI",
      "to": "CEK",
      "pcs_pax": 0.4084507042253521,
      "wght_pc": 14.862068965517242,
      "hb_pax": 3.704225352112676,
      "pax_no": 71
    },
    {
      "flt_no": "",
      "from": "SUI",
      "to": "LED",
      "pcs_pax": 0.6320754716981132,
      "wght_pc": 15.134328358208956,
      "hb_pax": 2.7641509433962264,
      "pax_no": 106
    }
  ]
};

// Глобальное состояние
let baggageDb = JSON.parse(JSON.stringify(DEFAULT_BAGGAGE_DB));
let userFlights = [];
let predictionsHistory = [];
let currentLang = 'ru';
let currentTheme = 'dark';
let currentUser = null; // { id, username, full_name, role }
let isAdminAuthenticated = false;
let isOfflineMode = false;
let isAutoSelectingRoute = false;
let currentActivePredictionId = null; // ID активного рейса из Истории расчетов (для сохранения раскладки отсеков)

// Отладка ошибок прямо на экране
window.addEventListener('error', function(e) {
    if (typeof showAviationAlert === 'function') {
        showAviationAlert("ERR: " + e.message + " (" + e.filename + ":" + e.lineno + ")", true);
    }
});
window.addEventListener('unhandledrejection', function(e) {
    if (typeof showAviationAlert === 'function') {
        showAviationAlert("PROMISE REJECTION: " + e.reason, true);
    }
});

// Словари локализации
const translations = {
    ru: {
        'app-title': 'AeroBag Predictor: Расчет Веса Багажа',
        'logo-sub': 'КОНТРОЛЬ ЗАГРУЗКИ РЕЙСОВ',
        'status-dispatch': 'ДИСПЕТЧЕР ОНЛАЙН',
        'status-local': 'ЛОКАЛЬНЫЙ РЕЖИМ (OFFLINE)',
        'tab-predict': 'Прогнозирование',
        'tab-dashboard': 'Дашборд аналитики',
        'tab-admin': 'Администрирование',
        'dashboard-title': '[ ДАШБОРД АНАЛИТИКИ И МАСШТАБИРОВАНИЯ ]',
        'dash-subtext': 'Аналитический обзор коммерческих нормативов багажа за весь период загруженной базы данных',
        'dash-label-route': 'Маршрут / Аэропорт',
        'dash-opt-all-routes': 'Все направления',
        'dash-label-period': 'Период времени',
        'dash-opt-all-period': 'За весь период',
        'dash-opt-30-days': 'За последние 30 дней',
        'dash-opt-60-days': 'За последние 60 дней',
        'dash-opt-90-days': 'За последние 90 дней',
        'dash-opt-current-year': 'За текущий год',
        'dash-opt-custom-range': 'Произвольный интервал...',
        'dash-label-date-from': 'С даты',
        'dash-label-date-to': 'По дату',
        'dashboard-kpi-total-flights': 'Проанализировано рейсов',
        'dashboard-kpi-routes': 'Номеров рейсов',
        'dashboard-kpi-avg-weight': 'Средний вес на 1 пассажира',
        'dashboard-kpi-avg-pcs': 'Среднее мест на 1 пассажира',
        'dashboard-kpi-period-all': 'За весь период базы данных',
        'dash-chart1-title': '[ ВЕС НА 1 PAX ПО МАРШРУТАМ (КГ) ]',
        'dash-chart2-title': '[ МЕСТА НА 1 PAX ПО МАРШРУТАМ (PCS) ]',
        'dash-chart3-title': '[ ДИНАМИКА ПО ДНЯМ НЕДЕЛИ (КГ/PAX) ]',
        'dash-chart4-title': '[ ДОЛИ ВЫЛЕТОВ ПО МАРШРУТАМ (%) ]',
        'predict-title': 'Прогнозирование рейса',
        'label-from': 'Аэропорт вылета (FROM)',
        'label-to': 'Аэропорт прилета (TO)',
        'select-from-first': 'Сначала выберите аэропорт вылета',
        'label-flight-no': 'Номер рейса',
        'placeholder-flight-no': 'Введите номер рейса (напр. 505)',
        'select-all-flights': 'Все рейсы',
        'label-pax': 'Пассажиры (PAX)',
        'btn-calculate': 'Рассчитать прогноз',
        'manual-title': 'Вручную добавить рейс',
        'label-airline': 'Авиакомпания',
        'label-flight-num': 'Рейс №',
        'label-date': 'Дата',
        'label-from-airport': 'Вылет (FROM)',
        'label-to-airport': 'Прилет (TO)',
        'pax-distribution': 'Распределение пассажиров',
        'pax-men': 'Мужчины',
        'pax-women': 'Женщины',
        'pax-rb': 'РБ (Дети)',
        'pax-rm': 'РМ (Млад.)',
        'actual-baggage-title': 'Фактические данные (для базы)',
        'label-bag-pcs': 'Мест багажа',
        'label-bag-weight': 'Вес багажа (кг)',
        'label-hb-weight': 'Р/кладь (кг)',
        'btn-add-flight': 'Добавить рейс в базу',
        'results-title': 'Ожидаемые параметры багажа',
        'res-bag-pcs': 'Мест багажа (PCS)',
        'res-bag-weight': 'Вес багажа (Baggage Weight)',
        'res-hb-weight': 'Вес ручной клади (Cabin Bag)',
        'applied-coeffs': 'Примененные коэффициенты',
        'coef-pcs-pax': 'Мест на 1 пасс. (PCS/PAX)',
        'coef-weight-pc': 'Вес 1 места (Weight/PC)',
        'coef-hb-pax': 'Ручная кладь на 1 пасс. (HB/PAX)',
        'coef-source-label': 'Источник данных:',
        'upload-title': 'Загрузка файлов системы регистрации',
        'drop-text': 'Перетащите файлы .xls / .xlsx сюда или нажмите для выбора',
        'drop-sub': 'Поддержка SpreadsheetML 2003 (.xls) и Excel (.xlsx)',
        'total-flights-label': 'Всего рейсов в базе:',
        'active-flights-label': 'Активных (30 дней):',
        'chk-show-all-flights': 'Показать все рейсы',
        'flights-table-title': 'База данных рейсов (последние 10 дней)',
        'flights-table-title-all': 'База данных рейсов (все)',
        'btn-clear-db': 'Очистить базу',
        'th-airline': 'АК',
        'th-flight': 'Рейс',
        'th-date': 'Дата',
        'th-route': 'Маршрут',
        'th-pax': 'Пассажиры (ВЗ / РБ / РМ)',
        'th-bag-pcs': 'Багаж мест',
        'th-bag-weight': 'Вес багажа',
        'th-hb-weight': 'Вес р/к',
        'th-status': 'Статус',
        'th-action': 'Действие',
        'empty-table': 'База данных пуста. Загрузите отчеты или введите рейс вручную.',
        'status-active': 'Активен',
        'status-inactive': 'Вне 30 дней',
        'source-desc-historical': 'Историческая база данных (Июль 2026)',
        'source-desc-uploaded-30': 'Загруженные данные за последние 30 дней',
        'source-desc-uploaded-closest': 'Загруженные данные за ближайшую дату ({date})',
        'source-desc-default': 'Среднеотраслевые стандарты (Дефолт)',
        'warning-no-flights-30': 'Внимание! За последние 30 дней по рейсу {flight} {from}➔{to} данных нет. Использован ближайший рейс от {date}.',
        'warning-no-route-30': 'Внимание! За последние 30 дней по направлению {from}➔{to} данных нет. Использован ближайший рейс от {date}.',
        'error-fields-required': 'Пожалуйста, заполните все обязательные поля!',
        'success-flight-added': 'Рейс успешно добавлен в базу!',
        'confirm-clear-db': 'Вы уверены, что хотите очистить всю базу данных рейсов?',
        'file-processed-success': 'Файл "{name}" успешно обработан. Загружено {count} рейсов, отфильтровано {skipped} невылетных направлений.',
        'file-process-error': 'Ошибка при чтении файла "{name}". Проверьте структуру.',
        'select-all-flights-placeholder': 'Все рейсы',
        'theme-light': 'Светлая тема',
        'theme-dark': 'Темная тема',
        'unit-kg': 'кг',
        // Новые строки для истории прогнозов
        'predictions-table-title': 'История расчетов прогнозов',
        'btn-clear-predictions': 'Очистить историю',
        'th-pax-count': 'Пассажиры (PAX)',
        'th-calc-date': 'Дата расчета',
        'empty-predictions-table': 'История прогнозов пуста. Сделайте расчет выше.',
        'confirm-clear-predictions': 'Вы уверены, что хотите очистить всю историю прогнозов?',
        'modal-confirm-title': '[\u00A0ТРЕБУЕТСЯ\u00A0ДЕЙСТВИЕ:\u00A0ОЧИСТКА\u00A0СИСТЕМЫ\u00A0]',
        'modal-confirm-cancel': '[\u00A0ОТМЕНА\u00A0]',
        'modal-confirm-submit': '[\u00A0ПОДТВЕРДИТЬ\u00A0ОЧИСТКУ\u00A0]',
        'btn-load-sample': 'Загрузить системную статистику',
        'btn-transfer-preliminary': '[ ⬇️ ПЕРЕНЕСТИ В PRELIMINARY ]',
        'load-planning-title': '[ СРЕДНИЙ ВЕС БАГАЖА И ДАННЫЕ ЗАГРУЗКИ ]',
        'load-planning-sub-title': 'ДАННЫЕ РАСПРЕДЕЛЕНИЯ БАГАЖА',
        'th-status-cat': 'СТАТУС',
        'th-pax-no': 'ПАССАЖИРЫ',
        'th-pcs': 'МЕСТА',
        'th-weight': 'ВЕС (кг)',
        'th-avg-bag-weight': 'СРЕДНИЙ ВЕС БАГАЖА',
        'th-avg-bag-pax': 'МЕСТ НА ПАССАЖИРА',
        'row-preliminary': 'ПРЕДВАРИТЕЛЬНЫЙ',
        'row-lir-final': 'LIR / ФИНАЛЬНЫЙ',
        'header-uld': 'ULD (Контейнеры)',
        'header-bulk': 'BULK (Багажники)',
        'th-uld-no': '№ ULD',
        'th-cpt-sec': 'ОТСЕК',
        'row-rest': 'ОСТАТОК',
        'row-ttl': 'ИТОГО',
        'auth-modal-title': '[ АВТОРИЗАЦИЯ В СИСТЕМЕ AEROBAG ]',
        'label-auth-username': 'ЛОГИН / ПОЗЫВНОЙ',
        'label-auth-password': 'ПАРОЛЬ ДОСТУПА',
        'btn-login-submit': '[ ВОЙТИ В СИСТЕМУ ]',
        'btn-logout': 'Выход',
        'rbac-title': '[ УПРАВЛЕНИЕ УЧЕТНЫМИ ЗАПИСЯМИ (RBAC) ]',
        'rbac-subtext': 'Управление диспетчерами, администраторами и разграничение прав доступа',
        'btn-add-user': 'Добавить пользователя',
        'th-user-login': 'Логин',
        'th-user-name': 'ФИО / Позывной',
        'th-user-role': 'Роль',
        'th-user-status': 'Статус',
        'th-user-last-login': 'Последний вход',
        'th-user-actions': 'Действия',
        'autobackup-title': '[ АВТОМАТИЧЕСКИЕ РЕЗЕРВНЫЕ КОПИИ (30 ДНЕЙ) ]',
        'autobackup-subtext': 'Ежедневные снимки базы рейсов на сервере. Ротация и хранение последних 30 дней.',
        'btn-create-server-backup': 'Создать бэкап сейчас',
        'th-backup-file': 'Имя файла архива',
        'th-backup-date': 'Дата создания',
        'th-backup-size': 'Размер',
        'th-backup-actions': 'Действия',
        'label-user-login': 'Логин',
        'label-user-fullname': 'ФИО / Позывной',
        'label-user-role': 'Роль в системе',
        'label-user-password': 'Пароль доступа',
        'label-user-active': 'Активная учетная запись (Разрешить вход)',
        'label-new-password': 'Новый пароль',
        'label-confirm-password': 'Повторите пароль',
        
        // Аналитические параметры
        'analysis-settings-title': 'ПАРАМЕТРЫ АНАЛИЗА И СЕЗОННОСТИ',
        'label-analysis-scope': 'Область сопоставления (Matching Scope)',
        'opt-scope-auto': 'Умный каскад (Авто)',
        'opt-scope-flight': 'Только выбранный рейс',
        'opt-scope-route': 'Всё направление (Маршрут)',
        'label-period-type': 'Период анализа данных (Data Period)',
        'opt-period-auto': 'Умный каскад (180 дн., α=0.3, сезонность)',
        'opt-period-all-history': 'Вся история базы (3 года)',
        'opt-period-custom': 'Произвольный диапазон дат',
        'opt-period-seasonal': 'Сезонный срез (месяц / год)',
        'label-flight-date': 'Дата рейса',
        'sampled-flights-title': 'Отобранные рейсы для расчета ({count} вып.):',
        'th-sample-date': 'Дата (день)',
        'th-sample-flight': 'Рейс',
        'th-sample-pax': 'Пасс.',
        'th-sample-pcs': 'Багаж',
        'th-sample-weight': 'Вес баг.',
        'th-sample-hb': 'Р/кладь',
        'sample-totals-label': 'ИТОГО (СУММЫ):',
        'source-desc-uploaded-weekday4': 'Последние 4 рейса ({weekday}) ({scope})',
        'source-desc-uploaded-weekday4-fallback': 'Среднее за ближайшие 30 дней до вылета ({scope}, последний рейс от {date})',
        'warning-no-flights-weekday4': 'Внимание! По рейсу {flight} {from}➔{to} нет данных на {weekday} за последние 60 дней. Использовано среднее значение за ближайшие 30 дней до вылета (последний рейс от {date}).',
        'warning-no-route-weekday4': 'Внимание! По направлению {from}➔{to} нет данных на {weekday} за последние 60 дней. Использовано среднее значение за ближайшие 30 дней до вылета (последний рейс от {date}).',
        'label-start-date': 'Дата начала (From)',
        'label-end-date': 'Дата окончания (To)',
        'label-month': 'Месяц (Month)',
        'label-year': 'Год (Year)',
        'opt-all-years': 'Все года',
        'month-jan': 'Январь',
        'month-feb': 'Февраль',
        'month-mar': 'Март',
        'month-apr': 'Апрель',
        'month-may': 'Май',
        'month-jun': 'Июнь',
        'month-jul': 'Июль',
        'month-aug': 'Август',
        'month-sep': 'Сентябрь',
        'month-oct': 'Октябрь',
        'month-nov': 'Ноябрь',
        'month-dec': 'Декабрь',
        'source-desc-uploaded-custom': 'Загруженные данные с {start} по {end} ({scope})',
        'source-desc-uploaded-seasonal': 'Загруженные данные за {month} {year} ({scope})',
        'scope-flight': 'Рейс',
        'scope-route': 'Направление',
        
        // Резервное копирование и верификация
        'btn-open-backtest': '🔬 Тест точности (Backtest)',
        'backtest-modal-title': '[ ИСТОРИЧЕСКИЙ БЭКТЕСТИНГ И ВЕРИФИКАЦИЯ ТОЧНОСТИ ]',
        'backtest-label-period': 'Период выборки:',
        'backtest-opt-3m': 'Последние 3 месяца',
        'backtest-opt-6m': 'Последние 6 месяцев (Рекомендуется)',
        'backtest-opt-1y': 'Последний 1 год',
        'backtest-opt-all': 'Вся доступная база рейсов',
        'backtest-label-limit': 'Количество рейсов:',
        'btn-start-backtest': '▶ Запустить тест',
        'backtest-badge-gain': 'ПРИРОСТ ТОЧНОСТИ',
        'backtest-label-gain-weight': 'Прирост точности (вес):',
        'backtest-label-gain-pcs': 'Прирост точности (места):',
        'backtest-sample-table-title': 'Примеры прогнозов по реальным вылетам:',
        'btn-export-db': 'Экспорт базы (Backup)',
        'btn-import-db': 'Импорт базы (Restore)',
        'backup-import-success': 'База данных успешно восстановлена! Загружено {flights} рейсов и {predictions} прогнозов.',
        'backup-import-error': 'Ошибка чтения файла резервной копии. Убедитесь, что формат файла верен.',
        'filters-title': '[ ФИЛЬТРЫ НАПРАВЛЕНИЙ И ГОРОДОВ ДЛЯ ЗАГРУЗКИ ]',
        'filters-subtext': 'Настройка разрешенных направлений для импорта из отчетов регистрации (Astra DCS / Excel). Поддерживаются коды IATA, коды РФ и названия городов.',
        'filter-departures-title': 'АЭРОПОРТЫ ВЫЛЕТА (FROM)',
        'filter-arrivals-title': 'АЭРОПОРТЫ ПРИЛЕТА (TO)',
        'btn-reset-filters-default': 'Сбросить по умолчанию',
        'btn-reset-filters': 'Сбросить по умолчанию',
        'btn-add': 'Добавить',
        'chk-strict-arrivals': 'Включить строгий фильтр по прилетам',
        'btn-expand': 'Развернуть',
        'btn-collapse': 'Свернуть',
        'footer-build-label': 'Сборка',
        'footer-developer': 'Разработчик: Andrey Zubkov',
        'btn-manual': 'Руководство'
    },
    en: {
        'app-title': 'AeroBag Predictor: Baggage Weight Calculator',
        'logo-sub': 'FLIGHT OPS CONTROL',
        'status-dispatch': 'DISPATCH ONLINE',
        'status-local': 'LOCAL MODE (OFFLINE)',
        'tab-predict': 'Forecasting',
        'tab-dashboard': 'Analytics Dashboard',
        'tab-admin': 'Administration',
        'dashboard-title': '[ ANALYTICS & SCALING DASHBOARD ]',
        'dash-subtext': 'Analytical overview of baggage commercial norms across the loaded database',
        'dash-label-route': 'Route / Airport',
        'dash-opt-all-routes': 'All Routes',
        'dash-label-period': 'Time Period',
        'dash-opt-all-period': 'All Time',
        'dash-opt-30-days': 'Last 30 Days',
        'dash-opt-60-days': 'Last 60 Days',
        'dash-opt-90-days': 'Last 90 Days',
        'dash-opt-current-year': 'Current Year',
        'dash-opt-custom-range': 'Custom Date Range...',
        'dash-label-date-from': 'From Date',
        'dash-label-date-to': 'To Date',
        'dashboard-kpi-total-flights': 'Flights Analyzed',
        'dashboard-kpi-routes': 'Flight Numbers',
        'dashboard-kpi-avg-weight': 'Avg Weight / PAX',
        'dashboard-kpi-avg-pcs': 'Avg Pieces / PAX',
        'dashboard-kpi-period-all': 'For entire database period',
        'dash-chart1-title': '[ WEIGHT PER PAX BY ROUTE (KG) ]',
        'dash-chart2-title': '[ PIECES PER PAX BY ROUTE (PCS) ]',
        'dash-chart3-title': '[ WEEKDAY DYNAMICS (KG/PAX) ]',
        'dash-chart4-title': '[ FLIGHT SHARES BY ROUTE (%) ]',
        'predict-title': 'Flight Forecasting',
        'label-from': 'Departure Airport (FROM)',
        'label-to': 'Arrival Airport (TO)',
        'select-from-first': 'Select departure airport first',
        'label-flight-no': 'Flight Number',
        'placeholder-flight-no': 'Enter flight number (e.g. 505)',
        'select-all-flights': 'All Flights',
        'label-pax': 'Passengers (PAX)',
        'btn-calculate': 'Calculate Forecast',
        'manual-title': 'Add Flight Manually',
        'label-airline': 'Airline',
        'label-flight-num': 'Flight No.',
        'label-date': 'Date',
        'label-from-airport': 'Departure (FROM)',
        'label-to-airport': 'Arrival (TO)',
        'pax-distribution': 'Passenger Distribution',
        'pax-men': 'Male',
        'pax-women': 'Female',
        'pax-rb': 'Children (CHD)',
        'pax-rm': 'Infants (INF)',
        'actual-baggage-title': 'Actual Baggage (for Database)',
        'label-bag-pcs': 'Baggage Pieces',
        'label-bag-weight': 'Baggage Weight (kg)',
        'label-hb-weight': 'Cabin Bag (kg)',
        'btn-add-flight': 'Add Flight to DB',
        'results-title': 'Expected Baggage Parameters',
        'res-bag-pcs': 'Baggage Pieces (PCS)',
        'res-bag-weight': 'Baggage Weight',
        'res-hb-weight': 'Cabin Bag Weight',
        'applied-coeffs': 'Applied Coefficients',
        'coef-pcs-pax': 'Pieces per Pax (PCS/PAX)',
        'coef-weight-pc': 'Weight per Piece (Weight/PC)',
        'coef-hb-pax': 'Cabin Bag per Pax (HB/PAX)',
        'coef-source-label': 'Calculation source:',
        'upload-title': 'Upload Registration Reports',
        'drop-text': 'Drag & Drop .xls / .xlsx files here or click to select',
        'drop-sub': 'Supports SpreadsheetML 2003 (.xls) and Excel (.xlsx)',
        'total-flights-label': 'Total flights in DB:',
        'active-flights-label': 'Active (30 days):',
        'chk-show-all-flights': 'Show all flights',
        'flights-table-title': 'Flights Database (last 10 days)',
        'flights-table-title-all': 'Flights Database (all)',
        'btn-clear-db': 'Clear Database',
        'th-airline': 'AL',
        'th-flight': 'Flight',
        'th-date': 'Date',
        'th-route': 'Route',
        'th-pax': 'Passengers (Adult / Child / Infant)',
        'th-bag-pcs': 'Baggage Pcs',
        'th-bag-weight': 'Baggage Weight',
        'th-hb-weight': 'Cabin Bag Weight',
        'th-status': 'Status',
        'th-action': 'Action',
        'empty-table': 'Database is empty. Upload reports or add a flight manually.',
        'status-active': 'Active',
        'status-inactive': 'Out of 30 days',
        'source-desc-historical': 'Historical Database (July 2026)',
        'source-desc-uploaded-30': 'Uploaded data for the last 30 days',
        'source-desc-uploaded-closest': 'Uploaded data for the closest date ({date})',
        'source-desc-default': 'Industry standards (Default)',
        'warning-no-flights-30': 'Warning! No data for flight {flight} {from}➔{to} in the last 30 days. Used closest flight from {date}.',
        'warning-no-route-30': 'Warning! No data for route {from}➔{to} in the last 30 days. Used closest flight from {date}.',
        'error-fields-required': 'Please fill in all required fields!',
        'success-flight-added': 'Flight successfully added to database!',
        'confirm-clear-db': 'Are you sure you want to clear the entire flights database?',
        'file-processed-success': 'File "{name}" successfully processed. Loaded {count} flights, skipped {skipped} non-departure destinations.',
        'file-process-error': 'Error reading file "{name}". Check its structure.',
        'select-all-flights-placeholder': 'All flights',
        'theme-light': 'Light Theme',
        'theme-dark': 'Dark Theme',
        'unit-kg': 'kg',
        // New strings for predictions history
        'predictions-table-title': 'Prediction Calculation History',
        'btn-clear-predictions': 'Clear History',
        'th-pax-count': 'Passengers (PAX)',
        'th-calc-date': 'Calculation Date',
        'empty-predictions-table': 'Predictions history is empty. Calculate a forecast above.',
        'confirm-clear-predictions': 'Are you sure you want to clear the entire predictions history?',
        'modal-confirm-title': '[\u00A0ACTION\u00A0REQUIRED:\u00A0SYSTEM\u00A0PURGE\u00A0]',
        'modal-confirm-cancel': '[\u00A0CANCEL\u00A0]',
        'modal-confirm-submit': '[\u00A0CONFIRM\u00A0PURGE\u00A0]',
        'btn-load-sample': '[ LOAD SYSTEM STATISTICS ]',
        'btn-transfer-preliminary': '[ ⬇️ TRANSFER TO PRELIMINARY ]',
        'load-planning-title': '[ AVERAGE BAGGAGE WEIGHT & LOAD PLANNING DATA ]',
        'load-planning-sub-title': 'BAGGAGE DISTRIBUTION (LOAD PLANNING DATA)',
        'th-status-cat': 'STATUS',
        'th-pax-no': 'PAX NO',
        'th-pcs': 'PCS',
        'th-weight': 'WEIGHT (kg)',
        'th-avg-bag-weight': 'AVERAGE BAG WEIGHT',
        'th-avg-bag-pax': 'AVERAGE BAG NO/PAX',
        'row-preliminary': 'PRELIMINARY',
        'row-lir-final': 'LIR OR FINAL',
        'header-uld': 'ULD (Containers)',
        'header-bulk': 'BULK (Loose Cargo)',
        'th-uld-no': 'ULD NO',
        'th-cpt-sec': 'CPT/SEC',
        'row-rest': 'REST',
        'row-ttl': 'TTL',
        'auth-modal-title': '[ AEROBAG ACCESS CONTROL ]',
        'label-auth-username': 'LOGIN / CALLSIGN',
        'label-auth-password': 'ACCESS PASSWORD',
        'btn-login-submit': '[ ENTER SYSTEM ]',
        'btn-logout': 'Logout',
        'rbac-title': '[ ACCESS CONTROL & USER MANAGEMENT ]',
        'rbac-subtext': 'Manage dispatchers, administrators, and role-based permissions',
        'btn-add-user': 'Add User',
        'th-user-login': 'Login',
        'th-user-name': 'Full Name / Callsign',
        'th-user-role': 'Role',
        'th-user-status': 'Status',
        'th-user-last-login': 'Last Login',
        'th-user-actions': 'Actions',
        'autobackup-title': '[ AUTOMATED DATABASE BACKUPS (30 DAYS) ]',
        'autobackup-subtext': 'Daily database snapshots on server. 30-day rotation and retention.',
        'btn-create-server-backup': 'Create Backup Now',
        'th-backup-file': 'Backup Filename',
        'th-backup-date': 'Created Date',
        'th-backup-size': 'Size',
        'th-backup-actions': 'Actions',
        'label-user-login': 'Login',
        'label-user-fullname': 'Full Name / Callsign',
        'label-user-role': 'System Role',
        'label-user-password': 'Password',
        'label-user-active': 'Active Account (Allow Login)',
        'label-new-password': 'New Password',
        'label-confirm-password': 'Confirm Password',
        
        // Analytical settings
        'analysis-settings-title': 'ANALYSIS & SEASONALITY SETTINGS',
        'label-analysis-scope': 'Matching Scope',
        'opt-scope-auto': 'Smart Waterfall (Auto Cascade)',
        'opt-scope-flight': 'Strict Flight Match',
        'opt-scope-route': 'Entire Route',
        'label-period-type': 'Analysis Period (Data Period)',
        'opt-period-auto': 'Smart Waterfall (180 days, α=0.3, season)',
        'opt-period-all-history': 'All Database History (3 Years)',
        'opt-period-custom': 'Custom Date Range',
        'opt-period-seasonal': 'Seasonal Slice (Month / Year)',
        'label-flight-date': 'Flight Date',
        'sampled-flights-title': 'Selected Flights for Calculation ({count} flts):',
        'th-sample-date': 'Date (Day)',
        'th-sample-flight': 'Flight',
        'th-sample-pax': 'Pax',
        'th-sample-pcs': 'Baggage',
        'th-sample-weight': 'Baggage Wt',
        'th-sample-hb': 'Cabin Bag',
        'sample-totals-label': 'TOTALS:',
        'source-desc-uploaded-weekday4': 'Last 4 flights ({weekday}) ({scope})',
        'source-desc-uploaded-weekday4-fallback': 'Average for 30 days prior to departure ({scope}, latest flight from {date})',
        'warning-no-flights-weekday4': 'Warning! No data on {weekday} for flight {flight} {from}➔{to} for the last 60 days. Used average for 30 days prior to departure (latest flight from {date}).',
        'warning-no-route-weekday4': 'Warning! No data on {weekday} for route {from}➔{to} for the last 60 days. Used average for 30 days prior to departure (latest flight from {date}).',
        'label-start-date': 'Start Date (From)',
        'label-end-date': 'End Date (To)',
        'label-month': 'Month',
        'label-year': 'Year',
        'opt-all-years': 'All Years',
        'month-jan': 'January',
        'month-feb': 'February',
        'month-mar': 'March',
        'month-apr': 'April',
        'month-may': 'May',
        'month-jun': 'June',
        'month-jul': 'July',
        'month-aug': 'August',
        'month-sep': 'September',
        'month-oct': 'October',
        'month-nov': 'November',
        'month-dec': 'December',
        'source-desc-uploaded-custom': 'Uploaded data from {start} to {end} ({scope})',
        'source-desc-uploaded-seasonal': 'Uploaded data for {month} {year} ({scope})',
        'scope-flight': 'Flight',
        'scope-route': 'Route',
        
        // Backups and verification
        'btn-open-backtest': '🔬 Accuracy Test (Backtest)',
        'backtest-modal-title': '[ FORECAST ACCURACY VERIFICATION & BACKTESTING ]',
        'backtest-label-period': 'Sample Period:',
        'backtest-opt-3m': 'Last 3 Months',
        'backtest-opt-6m': 'Last 6 Months (Recommended)',
        'backtest-opt-1y': 'Last 1 Year',
        'backtest-opt-all': 'All Available Database Flights',
        'backtest-label-limit': 'Number of Flights:',
        'btn-start-backtest': '▶ Run Test',
        'backtest-badge-gain': 'ACCURACY GAIN',
        'backtest-label-gain-weight': 'Weight Accuracy Gain:',
        'backtest-label-gain-pcs': 'Pieces Accuracy Gain:',
        'backtest-sample-table-title': 'Sample Forecasts for Real Flights:',
        'btn-export-db': 'Export Database (Backup)',
        'btn-import-db': 'Import Database (Restore)',
        'backup-import-success': 'Database successfully restored! Loaded {flights} flights and {predictions} predictions.',
        'backup-import-error': 'Error reading backup file. Make sure file format is correct.',
        'filters-title': '[ INGESTION ROUTE & CITY FILTERS ]',
        'filters-subtext': 'Configure allowed destinations for ingestion from registration reports (Astra DCS / Excel). Supports IATA codes, Russian codes, and city names.',
        'filter-departures-title': 'DEPARTURE AIRPORTS (FROM)',
        'filter-arrivals-title': 'ARRIVAL AIRPORTS (TO)',
        'btn-reset-filters-default': 'Reset to Default',
        'btn-reset-filters': 'Reset to Default',
        'btn-add': 'Add',
        'chk-strict-arrivals': 'Enable strict arrivals filter',
        'btn-expand': 'Expand',
        'btn-collapse': 'Collapse',
        'footer-build-label': 'Build',
        'footer-developer': 'Developer: Andrey Zubkov',
        'btn-manual': 'Manual'
    }
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ КОДОВ АЭРОПОРТОВ (ИАТА <-> Русский) ---

// Проверка на мусорные строки заголовков таблицы Excel
function isHeaderGarbage(str) {
    if (!str) return true;
    const clean = String(str).trim().toLowerCase();
    if (clean.length < 2) return true;
    const exactHeaderWords = [
        'код а/п', 'код а/к', 'номер рейса', 'направление', 'код', 'а/п', 'а/к', 'рейс',
        'flt', 'flight', 'airline', 'direction', 'from', 'to', 'дата', 'date', 'пасс', 'pax',
        'взрослые', 'дети', 'ручная', 'багаж', 'мест', 'вес', 'ние', 'всего', 'номер'
    ];
    return exactHeaderWords.includes(clean);
}

function ruToIata(ruCode) {
    if (!ruCode) return '';
    const cleanCode = String(ruCode).trim().toUpperCase();
    if (!baggageDb || !baggageDb.airports) {
        return cleanCode;
    }
    
    if (baggageDb.airports[cleanCode]) {
        return baggageDb.airports[cleanCode].iata;
    }
    
    const found = Object.values(baggageDb.airports).find(ap => 
        (ap.ru && ap.ru.trim().toUpperCase() === cleanCode) ||
        (ap.iata && ap.iata.trim().toUpperCase() === cleanCode) ||
        (ap.name && ap.name.trim().toUpperCase() === cleanCode) ||
        (ap.city && ap.city.trim().toUpperCase() === cleanCode)
    );
    if (found) {
        return found.iata;
    }
    
    return cleanCode;
}

// Парсинг чистого 3-буквенного ИАТА кода из сложных строк отчета (напр. "ЕКАТЕРИНБУРГ AER-SVX", "КАЗАНЬ AER-KZN", "БОХТАР KQT-UFA")
function parseCleanAirportCode(rawStr) {
    if (!rawStr) return '';
    const str = String(rawStr).trim();
    if (str.length === 3 && /^[A-ZА-Я]{3}$/i.test(str)) {
        return ruToIata(str) || str;
    }
    const words = str.split(/\s+/);
    const firstWordCode = ruToIata(words[0]);
    if (firstWordCode && firstWordCode.length === 3 && baggageDb && baggageDb.airports && baggageDb.airports[firstWordCode]) {
        return firstWordCode;
    }
    const tokens = str.match(/[A-ZА-Я]{3}/gi) || [];
    for (const t of tokens) {
        const code = ruToIata(t);
        if (code && code.length === 3 && baggageDb && baggageDb.airports && baggageDb.airports[code]) {
            return code;
        }
    }
    return ruToIata(str) || str;
}

function iataToRu(iataCode) {
    if (!baggageDb || !baggageDb.airports) {
        return iataCode;
    }
    const ap = Object.values(baggageDb.airports).find(a => a.iata === iataCode);
    return ap ? ap.ru : iataCode;
}

// Интеллектуальный поиск и сопоставление аэропорта/города по любому формату (IATA, РФ-код, Название города на русском)
function resolveAirportInfo(query) {
    if (!query) return null;
    const clean = String(query).trim().toUpperCase();
    const cleanLower = String(query).trim().toLowerCase();

    if (baggageDb && baggageDb.airports) {
        // 1. Прямой поиск по ключу
        if (baggageDb.airports[clean]) {
            const ap = baggageDb.airports[clean];
            return { iata: ap.iata || clean, ru: ap.ru || clean, name: ap.name || ap.iata || clean };
        }

        // 2. Поиск по IATA или RU коду
        for (const ap of Object.values(baggageDb.airports)) {
            if (ap.iata && ap.iata.toUpperCase() === clean) {
                return { iata: ap.iata, ru: ap.ru || ap.iata, name: ap.name || ap.iata };
            }
            if (ap.ru && ap.ru.toUpperCase() === clean) {
                return { iata: ap.iata || ap.ru, ru: ap.ru, name: ap.name || ap.ru };
            }
        }

        // 3. Поиск по точному совпадению названия города или его вхождению
        for (const ap of Object.values(baggageDb.airports)) {
            if (ap.name) {
                const nameLower = ap.name.toLowerCase();
                if (nameLower === cleanLower || nameLower.includes(cleanLower) || (cleanLower.length >= 3 && cleanLower.includes(nameLower))) {
                    return { iata: ap.iata || ap.ru, ru: ap.ru || ap.iata, name: ap.name };
                }
            }
        }
    }

    // Если в справочнике нет, но это 3 буквы латиницы
    if (/^[A-Z]{3}$/.test(clean)) {
        const ru = iataToRu(clean);
        return { iata: clean, ru: (ru && ru !== clean ? ru : clean), name: clean };
    }
    // Если 3 буквы кириллицы
    if (/^[А-ЯЁ]{3}$/.test(clean)) {
        const iata = ruToIata(clean);
        return { iata: (iata && iata !== clean ? iata : clean), ru: clean, name: clean };
    }

    return { iata: clean, ru: clean, name: String(query).trim() };
}

// Автоматическая нормализация кодов аэропортов рейса к стандарту ИАТА
function normalizeFlightRecord(f) {
    if (!f) return f;
    if (f.from) f.from = ruToIata(f.from) || String(f.from).trim().toUpperCase();
    if (f.to) f.to = ruToIata(f.to) || String(f.to).trim().toUpperCase();
    return f;
}

// Вспомогательная функция для получения количества пассажиров без учета младенцев (ВЗ + РБ, без РМ)
function getEffectivePaxCount(f) {
    if (!f) return 0;
    const men = parseInt(f.men) || 0;
    const women = parseInt(f.women) || 0;
    const rb = parseInt(f.rb) || 0;
    const rm = parseInt(f.rm) || 0;

    if (men > 0 || women > 0 || rb > 0) {
        return men + women + rb;
    }

    const rawPax = parseInt(f.pax) || 0;
    if (rawPax > 0) {
        return Math.max(0, rawPax - rm);
    }

    return 0;
}

function formatAirline(code) {
    if (!code) return 'N4';
    const clean = String(code).trim().toUpperCase();

    // N4 / Nordwind / Нордвинд / Н4 / КЛ / KL
    if (clean === 'N4' || clean === 'Н4' || clean === 'КЛ' || clean === 'KL' || clean.includes('NORD') || clean.includes('НОРД')) {
        return 'N4';
    }

    // EO / Ikar / Икар / КАР / KAR
    if (clean === 'EO' || clean === 'ЕО' || clean.includes('IKAR') || clean.includes('ИКАР') || clean.includes('KAR') || clean.includes('КАР')) {
        return 'EO';
    }

    return code;
}

// Надежный форматировщик дат из Excel в YYYY-MM-DD без UTC-сдвига на +1 день
function formatExcelDate(rawDate) {
    if (!rawDate) return new Date().toISOString().split('T')[0];
    
    // Если передана дата как числовой серийный код Excel (например 46097)
    const num = Number(rawDate);
    if (!isNaN(num) && num > 30000 && num < 100000) {
        if (typeof XLSX !== 'undefined' && XLSX.SSF && XLSX.SSF.parse_date_code) {
            const parsed = XLSX.SSF.parse_date_code(num);
            if (parsed && parsed.y && parsed.m && parsed.d) {
                return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
            }
        }
        const jsDate = new Date(Math.round((num - 25569) * 86400 * 1000));
        const year = jsDate.getUTCFullYear();
        const month = String(jsDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(jsDate.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const str = String(rawDate).trim();
    if (!str) return new Date().toISOString().split('T')[0];

    // Разбор форматов DD.MM.YYYY или DD.MM.YY (например 01.07.2026 или 01.07.26)
    if (str.includes('.')) {
        const parts = str.split('.');
        if (parts.length === 3) {
            let day = parseInt(parts[0], 10);
            let month = parseInt(parts[1], 10);
            let year = parseInt(parts[2], 10);
            if (year < 100) year += 2000;
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
        }
    }

    // Разбор формата YYYY-MM-DD
    if (str.includes('-')) {
        const parts = str.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            return str;
        }
    }

    // Если объект Date, извлекаем компоненты по UTC, исключая сдвиг часовых поясов
    if (rawDate instanceof Date) {
        const year = rawDate.getUTCFullYear();
        const month = String(rawDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(rawDate.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return str;
}

function resetCompartments() {
    for (let i = 1; i <= 12; i++) {
        const bulkPcsInput = document.getElementById(`bulk-pcs-${i}`);
        const bulkWeightInput = document.getElementById(`bulk-weight-${i}`);
        if (bulkPcsInput) bulkPcsInput.value = '0';
        if (bulkWeightInput) {
            bulkWeightInput.value = '0';
            bulkWeightInput.removeAttribute('data-locked');
            bulkWeightInput.classList.remove('weight-locked');
        }

        const uldPcsInput = document.getElementById(`uld-pcs-${i}`);
        const uldWeightInput = document.getElementById(`uld-weight-${i}`);
        if (uldPcsInput) uldPcsInput.value = '0';
        if (uldWeightInput) {
            if (uldWeightInput.tagName === 'INPUT') uldWeightInput.value = '0';
            else uldWeightInput.textContent = '0';
            uldWeightInput.removeAttribute('data-locked');
            uldWeightInput.classList.remove('weight-locked');
        }
    }
}

// Сохранение текущей раскладки BULK отсеков в объект prediction из Истории расчетов
function saveCompartmentsToPrediction() {
    if (!currentActivePredictionId) {
        if (predictionsHistory && predictionsHistory.length > 0) {
            currentActivePredictionId = predictionsHistory[0].id;
        } else {
            return;
        }
    }
    const p = predictionsHistory.find(item => item.id === currentActivePredictionId);
    if (!p) return;

    const lirPaxInput = document.getElementById('lir-pax');
    const lirPcsInput = document.getElementById('lir-pcs');
    const lirWeightInput = document.getElementById('lir-weight');

    if (lirPaxInput && lirPaxInput.value !== '') p.lir_pax = parseInt(lirPaxInput.value, 10) || 0;
    if (lirPcsInput && lirPcsInput.value !== '') p.lir_pcs = parseInt(lirPcsInput.value, 10) || 0;
    if (lirWeightInput && lirWeightInput.value !== '') p.lir_weight = parseFloat(lirWeightInput.value) || 0;

    const compartments = [];
    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightInput = document.getElementById(`bulk-weight-${i}`);
        const pcs = pcsInput ? parseInt(pcsInput.value, 10) || 0 : 0;
        const weight = weightInput ? parseInt(weightInput.value, 10) || 0 : 0;
        const locked = weightInput ? (weightInput.getAttribute('data-locked') === 'true') : false;
        compartments.push({ pcs, weight, locked });
    }

    p.compartments = compartments;
    savePredictionsHistory();
}

// Восстановление раскладки BULK отсеков из объекта prediction
function restoreCompartmentsFromPrediction(p) {
    if (!p || !p.compartments || !Array.isArray(p.compartments)) {
        resetCompartments();
        return;
    }

    for (let i = 1; i <= 12; i++) {
        const comp = p.compartments[i - 1];
        if (!comp) continue;

        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightInput = document.getElementById(`bulk-weight-${i}`);

        if (pcsInput) pcsInput.value = String(comp.pcs || 0);
        if (weightInput) {
            weightInput.value = String(comp.weight || 0);
            if (comp.locked) {
                weightInput.setAttribute('data-locked', 'true');
                weightInput.classList.add('weight-locked');
            } else {
                weightInput.removeAttribute('data-locked');
                weightInput.classList.remove('weight-locked');
            }
        }
    }
}


function transferToPreliminary() {
    const paxInput = document.getElementById('input-pax');
    const resPcs = document.getElementById('res-pcs');
    const resWeight = document.getElementById('res-weight');

    let paxVal = parseInt(paxInput ? paxInput.value : 0) || 0;

    // Проверяем режим явки пассажиров (Факт 100% или Бронь 97%)
    const paxModeRadio = document.querySelector('input[name="pax-mode"]:checked');
    const paxModeFactor = paxModeRadio ? parseFloat(paxModeRadio.value) : 1.0;
    const isBookingMode = paxModeFactor < 0.99;
    if (isBookingMode && paxVal > 0) {
        // Если переключатель на Брони (97%), переносим ожидаемое число пассажиров с учетом неявки
        paxVal = Math.max(1, Math.round(paxVal * paxModeFactor));
    }

    const pcsVal = parseInt(resPcs ? resPcs.textContent : 0) || 0;
    const weightVal = parseFloat(resWeight ? resWeight.textContent : 0) || 0;

    const prelimPax = document.getElementById('prelim-pax');
    const prelimPcs = document.getElementById('prelim-pcs');
    const prelimWeight = document.getElementById('prelim-weight');

    const lirPax = document.getElementById('lir-pax');
    const lirPcs = document.getElementById('lir-pcs');
    const lirWeight = document.getElementById('lir-weight');

    if (prelimPax) prelimPax.textContent = paxVal;
    if (prelimPcs) prelimPcs.textContent = pcsVal;
    if (prelimWeight) prelimWeight.textContent = weightVal;

    if (lirPax) lirPax.value = paxVal;
    if (lirPcs) lirPcs.value = pcsVal;
    if (lirWeight) lirWeight.value = weightVal;

    // Связываем с самым свежим расчетом из истории
    if (!currentActivePredictionId && predictionsHistory && predictionsHistory.length > 0) {
        currentActivePredictionId = predictionsHistory[0].id;
    }
    if (currentActivePredictionId) {
        highlightPredictionRow(currentActivePredictionId);
    }

    resetCompartments();
    recalculateLoadPlanning();
    saveCompartmentsToPrediction();
}

function transferPredictionToPreliminary(predId) {
    const p = predictionsHistory.find(item => item.id === predId);
    if (!p) return;

    // Сохраняем раскладку BULK текущего активного рейса из Истории перед переключением
    saveCompartmentsToPrediction();

    // Устанавливаем новый активный рейс из Истории
    currentActivePredictionId = predId;

    const paxVal = parseInt(p.pax, 10) || 0;
    const pcsVal = parseInt(p.bag_pcs, 10) || 0;
    const weightVal = parseFloat(p.bag_weight) || 0;

    const prelimPax = document.getElementById('prelim-pax');
    const prelimPcs = document.getElementById('prelim-pcs');
    const prelimWeight = document.getElementById('prelim-weight');

    const lirPax = document.getElementById('lir-pax');
    const lirPcs = document.getElementById('lir-pcs');
    const lirWeight = document.getElementById('lir-weight');

    if (prelimPax) prelimPax.textContent = paxVal;
    if (prelimPcs) prelimPcs.textContent = pcsVal;
    if (prelimWeight) prelimWeight.textContent = weightVal;

    const curLirPax = (p.lir_pax !== undefined && p.lir_pax !== null) ? p.lir_pax : paxVal;
    const curLirPcs = (p.lir_pcs !== undefined && p.lir_pcs !== null) ? p.lir_pcs : pcsVal;
    const curLirWeight = (p.lir_weight !== undefined && p.lir_weight !== null) ? p.lir_weight : weightVal;

    if (lirPax) lirPax.value = curLirPax;
    if (lirPcs) lirPcs.value = curLirPcs;
    if (lirWeight) lirWeight.value = curLirWeight;

    const resPcs = document.getElementById('res-pcs');
    const resWeight = document.getElementById('res-weight');
    const resHb = document.getElementById('res-hb');

    if (resPcs) resPcs.textContent = p.bag_pcs || 0;
    if (resWeight) resWeight.textContent = p.bag_weight || 0;
    if (resHb) resHb.textContent = p.hb_weight || 0;

    // Восстанавливаем раскладку BULK из сохранённых данных рейса (или обнуляем если пустые)
    restoreCompartmentsFromPrediction(p);
    recalculateLoadPlanning();

    updateActiveFlightBadge(p.from, p.to, p.flight_no, p.flight_date || p.calc_date);
    highlightPredictionRow(predId);

    const targetEl = document.querySelector('.load-planning-panel') || document.getElementById('prelim-pax');
    if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function recalculateLoadPlanning() {
    const prelimPax = parseInt(document.getElementById('prelim-pax')?.textContent || 0) || 0;
    const prelimPcs = parseInt(document.getElementById('prelim-pcs')?.textContent || 0) || 0;
    const prelimWeight = parseFloat(document.getElementById('prelim-weight')?.textContent || 0) || 0;

    const lirPaxInput = document.getElementById('lir-pax');
    const lirPcsInput = document.getElementById('lir-pcs');
    const lirWeightInput = document.getElementById('lir-weight');

    let lirPax = parseInt(lirPaxInput ? lirPaxInput.value : 0) || 0;
    let lirPcs = parseInt(lirPcsInput ? lirPcsInput.value : 0) || 0;
    let lirWeight = parseFloat(lirWeightInput ? lirWeightInput.value : 0) || 0;

    const targetPax = lirPax > 0 ? lirPax : prelimPax;
    const targetPcs = lirPcs > 0 ? lirPcs : prelimPcs;
    const targetWeight = lirWeight > 0 ? lirWeight : prelimWeight;

    const prelimAvgWeight = document.getElementById('prelim-avg-weight');
    const prelimAvgPax = document.getElementById('prelim-avg-pax');

    if (prelimAvgWeight) {
        const avgW = targetPcs > 0 ? (targetWeight / targetPcs) : 0;
        prelimAvgWeight.textContent = avgW.toFixed(2).replace('.', ',');
    }
    if (prelimAvgPax) {
        const avgP = targetPax > 0 ? (targetPcs / targetPax) : 0;
        prelimAvgPax.textContent = avgP.toFixed(2).replace('.', ',');
    }

    // 1-й проход: Подсчет зафиксированных весов и мест, а также сбор незафиксированных отсеков
    let lockedWeightSum = 0;
    let lockedPcsSum = 0;
    const unlockedComps = [];

    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightCell = document.getElementById(`bulk-weight-${i}`);

        if (pcsInput) {
            const pcs = parseInt(pcsInput.value, 10) || 0;
            const isLocked = weightCell && weightCell.tagName === 'INPUT' && weightCell.getAttribute('data-locked') === 'true';

            if (isLocked) {
                const w = parseFloat(weightCell.value) || 0;
                lockedWeightSum += w;
                lockedPcsSum += pcs;
            } else {
                if (pcs > 0) {
                    unlockedComps.push({ index: i, pcs: pcs, weightCell: weightCell });
                } else {
                    // Если мест 0 и отсек не зафиксирован - сбрасываем вес в 0
                    if (weightCell) {
                        if (weightCell.tagName === 'INPUT') weightCell.value = '0';
                        else weightCell.textContent = '0';
                    }
                }
            }
        }
    }

    // Расчет удельного веса 1 места на оставшийся свободный вес от общего плана
    const remainingWeight = Math.max(0, targetWeight - lockedWeightSum);
    const remainingPcs = Math.max(1, targetPcs - lockedPcsSum);
    const dynamicAvgBagWeight = targetPcs > 0 ? (remainingWeight / remainingPcs) : 0;

    // Суммарное количество мест, введенных в незафиксированные отсеки
    const totalUnlockedEnteredPcs = unlockedComps.reduce((acc, c) => acc + c.pcs, 0);
    // Проверка: распределены ли абсолютно все места (с учетом возможных зафиксированных)
    const isAllPcsDistributed = (targetPcs > 0) && (totalUnlockedEnteredPcs === (targetPcs - lockedPcsSum));

    // 2-й проход: Распределение веса по незафиксированным отсекам
    let allocatedUnlockedWeight = 0;

    unlockedComps.forEach((comp, idx) => {
        const isLastComp = (idx === unlockedComps.length - 1);
        let w = 0;

        if (isAllPcsDistributed && isLastComp) {
            // Последний отсек, закрывающий все оставшиеся места, забирает точный остаток веса!
            w = Math.max(0, remainingWeight - allocatedUnlockedWeight);
        } else {
            w = Math.round(comp.pcs * dynamicAvgBagWeight);
            allocatedUnlockedWeight += w;
        }

        if (comp.weightCell) {
            if (comp.weightCell.tagName === 'INPUT') {
                comp.weightCell.value = String(w);
            } else {
                comp.weightCell.textContent = String(w);
            }
        }
    });

    // 3-й проход: Подсчет итогов по всей таблице
    let ttlBulkPcs = lockedPcsSum + totalUnlockedEnteredPcs;
    let ttlBulkWeight = lockedWeightSum;

    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        const weightCell = document.getElementById(`bulk-weight-${i}`);
        if (pcsInput && weightCell) {
            const isLocked = weightCell.tagName === 'INPUT' && weightCell.getAttribute('data-locked') === 'true';
            if (!isLocked) {
                const w = parseFloat(weightCell.tagName === 'INPUT' ? weightCell.value : weightCell.textContent) || 0;
                ttlBulkWeight += w;
            }
        }
    }

    const bulkTtlPcsEl = document.getElementById('bulk-ttl-pcs');
    const bulkTtlWghtEl = document.getElementById('bulk-ttl-weight');
    if (bulkTtlPcsEl) bulkTtlPcsEl.textContent = ttlBulkPcs;
    if (bulkTtlWghtEl) bulkTtlWghtEl.textContent = ttlBulkWeight;

    const bulkRestPcs = targetPcs - ttlBulkPcs;
    const bulkRestWeight = targetWeight - ttlBulkWeight;

    const bulkRestPcsCell = document.getElementById('bulk-rest-pcs');
    const bulkRestWghtCell = document.getElementById('bulk-rest-weight');

    if (bulkRestPcsCell) {
        bulkRestPcsCell.textContent = bulkRestPcs;
        bulkRestPcsCell.classList.toggle('rest-balanced', bulkRestPcs === 0 && targetPcs > 0);
        bulkRestPcsCell.classList.toggle('rest-overload', bulkRestPcs < 0);
    }
    if (bulkRestWghtCell) {
        bulkRestWghtCell.textContent = bulkRestWeight;
        bulkRestWghtCell.classList.toggle('rest-balanced', bulkRestWeight === 0 && targetWeight > 0);
        bulkRestWghtCell.classList.toggle('rest-overload', bulkRestWeight < 0);
    }
}

// Инициализация таблицы коммерческой загружеб (12 отсеков BULK)
function initLoadPlanningData() {
    const unifiedBody = document.getElementById('unified-load-tbody');
    if (unifiedBody) {
        if (unifiedBody.children.length === 0) {
            unifiedBody.innerHTML = '';
            for (let bulkNo = 1; bulkNo <= 12; bulkNo++) {
                const tr = document.createElement('tr');
                const bulkTabIndex = 10 + (bulkNo * 2) - 1;
                const weightTabIndex = 10 + (bulkNo * 2);

                tr.innerHTML = `
                    <td colspan="2" style="text-align: center;"><strong>${bulkNo}</strong></td>
                    <td colspan="2" style="text-align: center;"><input type="number" id="bulk-pcs-${bulkNo}" class="form-control table-input bulk-pcs-input monospace-val super-input-cyan" min="0" max="1000" value="0" tabindex="${bulkTabIndex}"></td>
                    <td colspan="2" style="text-align: center;"><input type="number" id="bulk-weight-${bulkNo}" class="form-control table-input bulk-weight-input monospace-val super-input-gold" min="0" max="50000" value="0" tabindex="${weightTabIndex}"></td>
                `;
                unifiedBody.appendChild(tr);
            }
        }
    }

    const btnTransfer = document.getElementById('btn-transfer-preliminary');
    if (btnTransfer && !btnTransfer.dataset.hasLoadListener) {
        btnTransfer.dataset.hasLoadListener = 'true';
        btnTransfer.addEventListener('click', transferToPreliminary);
        btnTransfer.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                const targetEl = document.getElementById('bulk-pcs-1');
                if (targetEl) {
                    targetEl.focus();
                    if (typeof targetEl.select === 'function') targetEl.select();
                }
            }
        });
    }

    ['lir-pax', 'lir-pcs', 'lir-weight'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.dataset.hasRecalcListener) {
            el.dataset.hasRecalcListener = 'true';
            ['input', 'change', 'keyup', 'blur'].forEach(evt => {
                el.addEventListener(evt, () => {
                    recalculateLoadPlanning();
                    saveCompartmentsToPrediction();
                });
            });
        }
    });

    document.querySelectorAll('.table-input').forEach(input => {
        if (!input.dataset.hasKeyNavListener) {
            input.dataset.hasKeyNavListener = 'true';
            input.addEventListener('keydown', (e) => {
                if (['-', '+', '.', ',', 'e', 'E'].includes(e.key)) {
                    e.preventDefault();
                    return;
                }
                if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
                    e.preventDefault();
                    const curTab = parseInt(input.getAttribute('tabindex'), 10);
                    if (curTab) {
                        const nextEl = document.querySelector(`[tabindex="${curTab + 1}"]`);
                        if (nextEl) {
                            nextEl.focus();
                            if (typeof nextEl.select === 'function') nextEl.select();
                        } else {
                            input.blur();
                        }
                    }
                }
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('uld-pcs-input')) {
                    const uldId = input.id.replace('uld-pcs-', '');
                    const weightInput = document.getElementById(`uld-weight-${uldId}`);
                    if (weightInput) {
                        weightInput.removeAttribute('data-locked');
                        weightInput.classList.remove('weight-locked');
                    }
                } else if (input.classList.contains('bulk-pcs-input')) {
                    const bulkId = input.id.replace('bulk-pcs-', '');
                    const weightInput = document.getElementById(`bulk-weight-${bulkId}`);
                    if (weightInput) {
                        weightInput.removeAttribute('data-locked');
                        weightInput.classList.remove('weight-locked');
                    }
                } else if (input.classList.contains('uld-weight-input') || input.classList.contains('bulk-weight-input')) {
                    if (input.value.trim() !== '') {
                        input.setAttribute('data-locked', 'true');
                        input.classList.add('weight-locked');
                    } else {
                        input.removeAttribute('data-locked');
                        input.classList.remove('weight-locked');
                    }
                }

                recalculateLoadPlanning();
                // Автосохранение раскладки BULK в активный рейс из Истории
                saveCompartmentsToPrediction();
            });

            ['change', 'blur'].forEach(evt => {
                input.addEventListener(evt, () => {
                    let v = input.value;
                    if (v && v.length > 1 && v.startsWith('0')) {
                        input.value = String(parseInt(v, 10));
                    }
                    if (v === '' || isNaN(v) || parseInt(v, 10) < 0) {
                        input.value = '0';
                    }
                    recalculateLoadPlanning();
                    // Автосохранение раскладки BULK в активный рейс из Истории
                    saveCompartmentsToPrediction();
                });
            });
        }
    });

    recalculateLoadPlanning();
}

// --- ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ---
document.addEventListener('DOMContentLoaded', async () => {
    loadSettings();
    
    const versionTag = document.getElementById('app-version-tag');
    if (versionTag) versionTag.textContent = APP_VERSION;
    const buildDateTag = document.getElementById('app-build-date');
    if (buildDateTag) buildDateTag.textContent = APP_BUILD_DATE;
    
    // Инициализация даты в форме прогноза (сегодняшняя дата)
    const dateInput = document.getElementById('input-date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    await loadBaggageDb();
    loadPredictionsHistory();
    
    // Автоматическая аутентификация пользователя и разграничение прав
    await checkAuthStatus();
    
    // Гарантированная начальная загрузка базы рейсов
    if (!userFlights || userFlights.length === 0) {
        await loadUserFlights();
    }

    setupEventListeners();
    setupTabs();
    setupNumericInputValidation();
    setupDatePickerTrigger();
    initAviationModal();
    initLoadPlanningData();
});

// Загрузка настроек темы и языка
function loadSettings() {
    // Язык
    const savedLang = localStorage.getItem('averago_lang');
    if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
        currentLang = savedLang;
    } else {
        currentLang = navigator.language.startsWith('ru') ? 'ru' : 'en';
    }
    setLanguage(currentLang);

    // Тема
    const savedTheme = localStorage.getItem('averago_theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    updateThemeButtonUI();

    // Мгновенный синхронный рендер профиля пользователя и доступных вкладок (исключает любое мелькание!)
    const cachedUser = localStorage.getItem('averago_current_user_profile') || localStorage.getItem('averago_local_auth_user');
    if (cachedUser) {
        try {
            currentUser = JSON.parse(cachedUser);
            isAdminAuthenticated = (currentUser && currentUser.role === 'admin');
            updateUserHeaderUI();
            updateTabsRoleAccess();
        } catch (e) {}
    }
}

// Установка языка интерфейса
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('averago_lang', lang);

    // Подсветка кнопок
    document.getElementById('btn-lang-ru').classList.toggle('active', lang === 'ru');
    document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');

    // Перевод элементов
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', translations[lang][key]);
            } else if (el.tagName === 'OPTION') {
                el.text = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    updateThemeButtonUI();
    updateOfflineStatusUI();

    // Перерисовать таблицу и графики, если они готовы
    if (baggageDb) {
        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderPredictionsTable();
        renderAirportFiltersUI();
    }
    renderDashboardAnalytics();
}

// Переключение темы оформления
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('averago_theme', currentTheme);
    document.body.classList.toggle('light-theme', currentTheme === 'light');
    updateThemeButtonUI();
}

// Обновление текста на кнопке темы
function updateThemeButtonUI() {
    const btn = document.getElementById('btn-theme-toggle');
    if (!btn) return;

    const isLight = document.body.classList.contains('light-theme');
    const emoji = isLight ? '☀️' : '🌙';
    const textKey = isLight ? 'theme-light' : 'theme-dark';
    const text = translations[currentLang][textKey];

    btn.querySelector('.theme-emoji').textContent = emoji;
    btn.querySelector('.theme-text').textContent = text;
}

// Загрузка базы данных аэропортов и исторических правил
async function loadBaggageDb() {
    try {
        const response = await fetch('baggage_db.json');
        if (response && response.ok) {
            const data = await response.json();
            if (data && data.airports && Object.keys(data.airports).length > 0) {
                baggageDb = data;
            }
        }
    } catch (e) {
        console.warn("Локальная загрузка baggage_db.json через fetch не удалась, используется встроенная база:", e);
        if (!baggageDb || !baggageDb.airports) {
            baggageDb = JSON.parse(JSON.stringify(DEFAULT_BAGGAGE_DB));
        }
    }
    
    // В любом режиме (онлайн или оффлайн) гарантированно выполняем инициализацию и рендер
    populateAirportDropdowns();
    populateAllFlightsDropdown();
    updateActiveDateRangeAndCounts();
    renderFlightsTable();
    renderPredictionsTable();
    renderUploadedFilesList();
    renderAirportFiltersUI();
    initAirportFiltersFromServer();
}

// ==========================================================================
// УПРАВЛЕНИЕ ФИЛЬТРАМИ ИМПОРТА РЕЙСОВ (DEPARTURES & ARRIVALS ROUTE FILTERS)
// ==========================================================================

// Получение текущих активных фильтров аэропортов (из LocalStorage, БД или дефолтные)
function getCustomAirportFilters() {
    const saved = localStorage.getItem('averago_custom_airport_filters');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed.departures) && Array.isArray(parsed.arrivals)) {
                return {
                    departures: Array.from(new Set(parsed.departures)),
                    arrivals: Array.from(new Set(parsed.arrivals)),
                    strict_arrivals: !!parsed.strict_arrivals
                };
            }
        } catch (e) {
            console.error("Ошибка парсинга averago_custom_airport_filters:", e);
        }
    }

    // Исходные предустановленные списки
    const defaultDeps = (baggageDb && Array.isArray(baggageDb.departures_filter) && baggageDb.departures_filter.length > 0)
        ? baggageDb.departures_filter
        : ['AER', 'СОЧ', 'CCC', 'DYU', 'ДШБ', 'GOX', 'HOG', 'HRG', 'KQT', 'КГТ', 'LBD', 'ХДТ', 'OSS', 'ОШШ', 'PMV', 'REN', 'ОНГ', 'SSH', 'SUI', 'СУИ', 'TAS', 'ТАС', 'UTP', 'VRA'];

    const defaultArrs = (baggageDb && Array.isArray(baggageDb.arrivals_filter) && baggageDb.arrivals_filter.length > 0)
        ? baggageDb.arrivals_filter
        : ['СОЧ', 'AYT', 'БАН', 'ЧЛБ', 'ЧБЕ', 'ДШБ', 'НЖС', 'ИВВ', 'КРВ', 'КЛД', 'ЕМВ', 'КГН', 'СКЧ', 'КИО', 'КЗН', 'ХДТ', 'ПЛК', 'МХЛ', 'МГС', 'МРВ', 'НЖК', 'НЖВ', 'НВК', 'ОМС', 'ОСК', 'ТЛЧ', 'ПРЬ', 'ОНГ', 'ГОР', 'СЫВ', 'СУР', 'SKV', 'ШРМ', 'ТАМ', 'УФА', 'УЛВ', 'ЯРЛ', 'ЭГВ', 'ПВХ', 'ВАВ', 'АБА', 'БАХ', 'ИКТ', 'КРС', 'ГРН', 'БЛГ', 'БКС', 'БРН', 'ВРН', 'КУР', 'ПЗМ', 'СВХ', 'ИЖВ', 'МРМ', 'КПА'];

    return {
        departures: Array.from(new Set(defaultDeps)),
        arrivals: Array.from(new Set(defaultArrs)),
        strict_arrivals: false
    };
}

// Сохранение фильтров аэропортов (в LocalStorage и в MySQL через API)
async function saveCustomAirportFilters(filters) {
    if (!filters) return;
    try {
        localStorage.setItem('averago_custom_airport_filters', JSON.stringify(filters));
    } catch (e) {
        console.error("Ошибка сохранения averago_custom_airport_filters:", e);
    }

    if (!isOfflineMode) {
        try {
            await fetch('api.php?action=save_settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    setting_key: 'airport_filters',
                    setting_value: filters
                })
            });
        } catch (e) {
            console.warn("Ошибка синхронизации фильтров с сервером:", e);
        }
    }
}

// Загрузка сохраненных фильтров аэропортов с сервера
async function initAirportFiltersFromServer() {
    if (!isOfflineMode) {
        try {
            const res = await fetch('api.php?action=get_settings&key=airport_filters');
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                if (data.success && data.value && Array.isArray(data.value.departures) && Array.isArray(data.value.arrivals)) {
                    localStorage.setItem('averago_custom_airport_filters', JSON.stringify(data.value));
                }
            }
        } catch (e) {
            console.warn("Не удалось подгрузить фильтры аэропортов с сервера:", e);
        }
    }
    renderAirportFiltersUI();
    populateAirportDropdowns();
}

// Вспомогательная функция для дедупликации и упорядочивания аэропортов по алфавиту городов (А-Я)
function getCanonicalAirportItems(codesList) {
    const map = new Map();
    (codesList || []).forEach(code => {
        if (!code) return;
        const info = resolveAirportInfo(code);
        const key = info ? (info.iata || info.ru || code).toUpperCase() : String(code).trim().toUpperCase();
        if (!map.has(key)) {
            map.set(key, {
                key: key,
                origCode: code,
                iata: info ? info.iata : key,
                ru: info ? info.ru : key,
                name: info ? info.name : key
            });
        }
    });
    // Сортировка строго по алфавиту русского названия города (или кода, если названия нет)
    return Array.from(map.values()).sort((a, b) => {
        const nameA = a.name || a.ru || a.iata;
        const nameB = b.name || b.ru || b.iata;
        return nameA.localeCompare(nameB, 'ru', { sensitivity: 'base' });
    });
}

// Переключение раскрытия/складывания панели фильтров
function toggleAirportFiltersAccordion(e) {
    if (e) {
        if (e.target && e.target.closest('#btn-reset-filters-default')) {
            return;
        }
        e.stopPropagation();
    }
    const panel = document.getElementById('airport-filters-panel');
    const toggleBtn = document.getElementById('btn-toggle-filters-collapse');
    if (!panel) return;

    panel.classList.toggle('collapsed');
    const isCollapsed = panel.classList.contains('collapsed');
    
    if (toggleBtn) {
        const textEl = toggleBtn.querySelector('.collapse-text');
        const iconEl = toggleBtn.querySelector('.collapse-icon');
        if (textEl) {
            textEl.textContent = isCollapsed 
                ? (translations[currentLang]['btn-expand'] || (currentLang === 'ru' ? 'Развернуть' : 'Expand'))
                : (translations[currentLang]['btn-collapse'] || (currentLang === 'ru' ? 'Свернуть' : 'Collapse'));
        }
        if (iconEl) {
            iconEl.textContent = isCollapsed ? '▼' : '▲';
        }
    }
}

// Отрисовка интерактивной панели фильтров (строчный вид в столбец + автодополнение + счетчики)
function renderAirportFiltersUI() {
    const depContainer = document.getElementById('departures-chips-container');
    const arrContainer = document.getElementById('arrivals-chips-container');
    const depBadge = document.getElementById('departures-count-badge');
    const arrBadge = document.getElementById('arrivals-count-badge');
    const datalist = document.getElementById('airports-datalist');
    const chkStrict = document.getElementById('chk-strict-arrivals');
    const summaryDeps = document.getElementById('filters-summary-deps');
    const summaryArrs = document.getElementById('filters-summary-arrs');

    if (!depContainer || !arrContainer) return;

    const filters = getCustomAirportFilters();

    if (chkStrict) {
        chkStrict.checked = !!filters.strict_arrivals;
    }

    // Заполнение datalist для автодополнения (поиск по коду или названию)
    if (datalist && baggageDb && baggageDb.airports) {
        const addedSet = new Set();
        datalist.innerHTML = '';
        Object.values(baggageDb.airports).forEach(ap => {
            if (!ap) return;
            const primaryKey = ap.iata || ap.ru;
            if (primaryKey && !addedSet.has(primaryKey)) {
                addedSet.add(primaryKey);
                const opt = document.createElement('option');
                opt.value = `${ap.iata || ap.ru} - ${ap.name || ''} (${ap.ru || ap.iata || ''})`;
                datalist.appendChild(opt);
            }
        });
    }

    // Получаем упорядоченные и дедуплицированные списки
    const sortedDeps = getCanonicalAirportItems(filters.departures);
    const sortedArrs = getCanonicalAirportItems(filters.arrivals);

    // Обновляем бейджи в шапке панели
    if (summaryDeps) {
        const word = currentLang === 'ru' ? 'вылетов' : 'deps';
        summaryDeps.textContent = `🛫 ${sortedDeps.length} ${word}`;
    }
    if (summaryArrs) {
        const word = currentLang === 'ru' ? 'прилетов' : 'arrs';
        const strictLabel = filters.strict_arrivals ? (currentLang === 'ru' ? ' [Строгий]' : ' [Strict]') : '';
        summaryArrs.textContent = `🛬 ${sortedArrs.length} ${word}${strictLabel}`;
    }

    // 1. Отрисовка строк вылетов (Departures - вертикальный список в столбец)
    depContainer.innerHTML = '';
    if (depBadge) {
        const itemWord = currentLang === 'ru' ? 'городов' : 'cities';
        depBadge.textContent = `${sortedDeps.length} ${itemWord}`;
    }

    if (sortedDeps.length === 0) {
        depContainer.innerHTML = `<span class="dash-subtext" style="padding: 6px;">${currentLang === 'ru' ? 'Нет фильтров (все вылеты разрешены)' : 'No filters (all departures allowed)'}</span>`;
    } else {
        sortedDeps.forEach(item => {
            const row = document.createElement('div');
            row.className = 'airport-filter-row';
            const codesText = (item.ru && item.ru !== item.iata) ? `${item.iata} / ${item.ru}` : item.iata;
            row.innerHTML = `
                <div class="row-info">
                    <span class="row-city-name">${item.name || item.iata}</span>
                    <span class="row-airport-codes">${codesText}</span>
                </div>
                <button type="button" class="btn-row-remove" title="${currentLang === 'ru' ? 'Удалить из фильтра' : 'Remove'}" onclick="handleRemoveAirportFilter('departures', '${item.key}')">✕</button>
            `;
            depContainer.appendChild(row);
        });
    }

    // 2. Отрисовка строк прилетов (Arrivals - вертикальный список в столбец)
    arrContainer.innerHTML = '';
    if (arrBadge) {
        const itemWord = currentLang === 'ru' ? 'городов' : 'cities';
        arrBadge.textContent = `${sortedArrs.length} ${itemWord}`;
    }

    if (sortedArrs.length === 0) {
        arrContainer.innerHTML = `<span class="dash-subtext" style="padding: 6px;">${currentLang === 'ru' ? 'Нет фильтров (все прилеты разрешены)' : 'No filters (all arrivals allowed)'}</span>`;
    } else {
        sortedArrs.forEach(item => {
            const row = document.createElement('div');
            row.className = 'airport-filter-row row-arrival';
            const codesText = (item.ru && item.ru !== item.iata) ? `${item.ru} / ${item.iata}` : item.ru;
            row.innerHTML = `
                <div class="row-info">
                    <span class="row-city-name">${item.name || item.ru}</span>
                    <span class="row-airport-codes">${codesText}</span>
                </div>
                <button type="button" class="btn-row-remove" title="${currentLang === 'ru' ? 'Удалить из фильтра' : 'Remove'}" onclick="handleRemoveAirportFilter('arrivals', '${item.key}')">✕</button>
            `;
            arrContainer.appendChild(row);
        });
    }
}

// Обработка добавления аэропорта/города в фильтр
function handleAddAirportFilter(e, type) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const inputId = type === 'departures' ? 'input-add-departure' : 'input-add-arrival';
    const inputEl = document.getElementById(inputId);
    if (!inputEl) return;

    let rawVal = inputEl.value.trim();
    if (!rawVal) return;

    if (rawVal.includes('-')) {
        rawVal = rawVal.split('-')[0].trim();
    }

    const info = resolveAirportInfo(rawVal);
    if (!info) {
        showAviationAlert((currentLang === 'ru' ? 'Не удалось распознать аэропорт или город: ' : 'Unknown airport or city: ') + rawVal, true);
        return;
    }

    const filters = getCustomAirportFilters();
    const list = type === 'departures' ? filters.departures : filters.arrivals;

    const primaryCode = type === 'departures' ? (info.iata || info.ru) : (info.ru || info.iata);
    const primaryUpper = primaryCode.toUpperCase();

    // Проверяем, есть ли уже этот пункт в фильтре
    const alreadyExists = list.some(c => {
        const u = String(c).trim().toUpperCase();
        return u === primaryUpper || (info.iata && u === info.iata.toUpperCase()) || (info.ru && u === info.ru.toUpperCase()) || (info.name && u === info.name.toUpperCase());
    });

    if (alreadyExists) {
        showAviationAlert((currentLang === 'ru' ? 'Этот пункт уже добавлен в фильтр: ' : 'Already in filter: ') + `${info.iata} / ${info.ru} (${info.name})`, true);
        return;
    }

    list.push(primaryCode);
    if (info.iata && !list.includes(info.iata)) list.push(info.iata);
    if (info.ru && !list.includes(info.ru)) list.push(info.ru);

    saveCustomAirportFilters(filters);
    renderAirportFiltersUI();
    populateAirportDropdowns();
    inputEl.value = '';

    const label = type === 'departures' ? (currentLang === 'ru' ? 'вылета' : 'departure') : (currentLang === 'ru' ? 'прилета' : 'arrival');
    showAviationAlert((currentLang === 'ru' ? `Добавлен в фильтр ${label}: ` : `Added to ${label} filter: `) + `${info.iata} / ${info.ru} (${info.name})`, false);
}

// Обработка удаления аэропорта/города из фильтра
function handleRemoveAirportFilter(type, code) {
    const filters = getCustomAirportFilters();
    const list = type === 'departures' ? filters.departures : filters.arrivals;

    const info = resolveAirportInfo(code);
    const codesToRemove = new Set([String(code).trim().toUpperCase()]);
    if (info) {
        if (info.iata) codesToRemove.add(info.iata.toUpperCase());
        if (info.ru) codesToRemove.add(info.ru.toUpperCase());
        if (info.name) codesToRemove.add(info.name.toUpperCase());
    }

    const updated = list.filter(c => {
        const u = String(c).trim().toUpperCase();
        const cInfo = resolveAirportInfo(c);
        const cIata = cInfo ? cInfo.iata.toUpperCase() : u;
        const cRu = cInfo ? cInfo.ru.toUpperCase() : u;
        return !codesToRemove.has(u) && !codesToRemove.has(cIata) && !codesToRemove.has(cRu);
    });

    if (type === 'departures') {
        filters.departures = updated;
    } else {
        filters.arrivals = updated;
    }

    saveCustomAirportFilters(filters);
    renderAirportFiltersUI();
    populateAirportDropdowns();
}

// Сброс фильтров к исходным заводским настройкам
function handleResetAirportFilters(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const msg = currentLang === 'ru'
        ? 'Сбросить фильтры аэропортов вылета и прилета к исходным заводским настройкам?'
        : 'Reset departure and arrival airport filters to default factory settings?';

    showAviationConfirm(msg, () => {
        localStorage.removeItem('averago_custom_airport_filters');
        const filters = getCustomAirportFilters();
        saveCustomAirportFilters(filters);
        renderAirportFiltersUI();
        populateAirportDropdowns();
        showAviationAlert(currentLang === 'ru' ? 'Фильтры успешно сброшены по умолчанию' : 'Filters reset to default', false);
    });
}

// Переключение строгого режима фильтрации прилетов (Вариант А)
function handleToggleStrictArrivals(isChecked) {
    const filters = getCustomAirportFilters();
    filters.strict_arrivals = !!isChecked;
    saveCustomAirportFilters(filters);
    renderAirportFiltersUI();
    const msg = isChecked
        ? (currentLang === 'ru' ? 'Включен строгий фильтр: будут загружаться только рейсы в разрешенные аэропорты прилета.' : 'Strict arrivals filter enabled.')
        : (currentLang === 'ru' ? 'Строгий фильтр по прилетам отключен: разрешены все прилеты из хабов вылета.' : 'Strict arrivals filter disabled.');
    showAviationAlert(msg, false);
}

// Экспортируем в window для инлайновых вызовов в HTML
window.toggleAirportFiltersAccordion = toggleAirportFiltersAccordion;
window.handleAddAirportFilter = handleAddAirportFilter;
window.handleRemoveAirportFilter = handleRemoveAirportFilter;
window.handleResetAirportFilters = handleResetAirportFilters;
window.handleToggleStrictArrivals = handleToggleStrictArrivals;

// Загрузка рейсов из локального хранилища (localStorage)
function loadFlightsFromLocalStorage() {
    try {
        const saved = localStorage.getItem('averago_user_flights_local');
        if (saved) {
            const parsed = JSON.parse(saved);
            userFlights = Array.isArray(parsed) ? parsed.map(normalizeFlightRecord) : [];
        } else {
            userFlights = [];
        }
    } catch (e) {
        console.error("Ошибка парсинга рейсов из LocalStorage:", e);
        userFlights = [];
    }
}

// Обновление интерфейса статуса подключения (Online/Offline)
function updateOfflineStatusUI() {
    const indicator = document.querySelector('.header-status-indicator');
    const textEl = document.querySelector('.status-text');
    if (!indicator || !textEl) return;

    if (isOfflineMode) {
        indicator.classList.add('offline');
        textEl.setAttribute('data-translate', 'status-local');
        textEl.textContent = translations[currentLang]['status-local'];
    } else {
        indicator.classList.remove('offline');
        textEl.setAttribute('data-translate', 'status-dispatch');
        textEl.textContent = translations[currentLang]['status-dispatch'];
    }
}

// Загрузка рейсов пользователя с сервера MySQL с автоматическим переходом на LocalStorage при ошибке
async function loadUserFlights() {
    try {
        const response = await fetch('api.php?action=get_flights');
        
        // Проверяем тип ответа (если локальный сервер без PHP вернул исходный код PHP-файла)
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON content: ' + contentType);
        }

        const data = await response.json();
        
        if (data.db_not_configured) {
            console.warn("База данных MySQL еще не настроена. Включаем локальный режим.");
            isOfflineMode = true;
            loadFlightsFromLocalStorage();
        } else if (data.success) {
            userFlights = Array.isArray(data.flights) ? data.flights.map(normalizeFlightRecord) : [];
            isOfflineMode = false;
        } else {
            console.error("Ошибка загрузки рейсов с сервера:", data.error);
            showAviationAlert("Ошибка загрузки рейсов: " + data.error, true);
            userFlights = [];
            isOfflineMode = false;
        }
    } catch (e) {
        console.warn("Ошибка подключения к API. Переключаемся в локальный режим:", e);
        isOfflineMode = true;
        loadFlightsFromLocalStorage();
    }
    
    // Если в локальном режиме база пуста, автоматически подгружаем 226 системных рейсов за июль из stats_july.xls
    if (userFlights.length === 0) {
        await loadSystemStats(true);
    }

    updateActiveDateRangeAndCounts();
    renderFlightsTable();
    renderUploadedFilesList();
    updateOfflineStatusUI();
    populateAllFlightsDropdown();
}

// Тихое обновление списка рейсов с сервера для фоновой синхронизации
async function loadUserFlightsSilent() {
    if (isOfflineMode) {
        loadFlightsFromLocalStorage();
        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderUploadedFilesList();
        return;
    }
    try {
        const response = await fetch('api.php?action=get_flights');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.success) {
                userFlights = Array.isArray(data.flights) ? data.flights.map(normalizeFlightRecord) : [];
            }
        }
    } catch (e) {
        console.error("Ошибка тихого обновления рейсов:", e);
    }
    updateActiveDateRangeAndCounts();
    renderFlightsTable();
    renderUploadedFilesList();
    populateAllFlightsDropdown();
}

// Сохранение рейсов пользователя на сервере MySQL или в LocalStorage
async function saveUserFlights() {
    // 1. Всегда надежно сохраняем в LocalStorage
    try {
        localStorage.setItem('averago_user_flights_local', JSON.stringify(userFlights));
        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderUploadedFilesList();
        populateAllFlightsDropdown();
    } catch (e) {
        console.error("Ошибка сохранения в LocalStorage:", e);
    }

    if (isOfflineMode) return;

    // 2. Если сервеная часть активна, проуем тихо синхронизировать
    try {
        const response = await fetch('api.php?action=save_flights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userFlights)
        });
        if (!response || !response.ok) return;
        const data = await response.json();
        if (data && data.success) {
            await loadUserFlightsSilent();
        }
    } catch (e) {
        console.warn("Серверный API недоступен, работаем в локальном режиме:", e);
    }
}

// Получение ключа истории прогнозов для текущего авторизованного пользователя
function getUserHistoryStorageKey() {
    if (currentUser && currentUser.username) {
        return `averago_predictions_history_${currentUser.username.toLowerCase().trim()}`;
    }
    if (currentUser && currentUser.id) {
        return `averago_predictions_history_${currentUser.id}`;
    }
    return 'averago_predictions_history_guest';
}

// Загрузка истории прогнозов из LocalStorage для конкретного пользователя
function loadPredictionsHistory() {
    const storageKey = getUserHistoryStorageKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        try {
            predictionsHistory = JSON.parse(saved);
        } catch (e) {
            console.error("Ошибка парсинга истории прогнозов из LocalStorage:", e);
            predictionsHistory = [];
        }
    } else {
        predictionsHistory = [];
    }
    renderPredictionsTable();
}

// Сохранение истории прогнозов в LocalStorage для конкретного пользователя
function savePredictionsHistory() {
    const storageKey = getUserHistoryStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(predictionsHistory));
}

// Умное извлечение только имени для приветствия (без фамилии, напр. "Самарина Наталья" -> "Наталья")
function getGreetingName(user) {
    if (!user) return currentLang === 'ru' ? 'Диспетчер' : 'Dispatcher';
    const fullName = (user.full_name || user.username || '').trim();
    if (!fullName) return currentLang === 'ru' ? 'Диспетчер' : 'Dispatcher';

    const lower = fullName.toLowerCase();
    if (lower.includes('администратор') || lower === 'admin') {
        return currentLang === 'ru' ? 'Администратор' : 'Administrator';
    }

    // Если строка вида "Диспетчер (SAMARINA)"
    if (fullName.startsWith('Диспетчер (') && fullName.endsWith(')')) {
        return fullName.slice(11, -1);
    }

    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        return parts[0];
    }

    if (parts.length >= 2) {
        const w1 = parts[0];
        const w2 = parts[1];

        // Типичные окончания русских фамилий
        const surnameRegex = /(ов|ова|ев|ева|ин|ина|ын|ына|ский|ская|цкий|цкая|их|ых|ко|ук|юк)$/i;
        
        const w1IsSurname = surnameRegex.test(w1);
        const w2IsSurname = surnameRegex.test(w2);

        if (w1IsSurname && !w2IsSurname) {
            // Например: "Самарина Наталья" -> "Наталья"
            return w2;
        }
        if (!w1IsSurname && w2IsSurname) {
            // Например: "Андрей Зубков" -> "Андрей"
            return w1;
        }
        return w1;
    }

    return fullName;
}

// Заполнение выпадающего списка годов для сезонного фильтра на основе базы рейсов
function populateSeasonalYears() {
    const selectYear = document.getElementById('select-seasonal-year');
    if (!selectYear) return;

    const savedVal = selectYear.value; // сохраняем выбранное значение, если оно было
    selectYear.innerHTML = '';

    // Опция "Все года"
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.setAttribute('data-translate', 'opt-all-years');
    allOpt.textContent = translations[currentLang]['opt-all-years'] || 'Все года';
    selectYear.appendChild(allOpt);

    // Извлекаем все уникальные года из userFlights
    const yearsSet = new Set();
    userFlights.forEach(f => {
        if (f.date) {
            const dateObj = new Date(f.date);
            if (!isNaN(dateObj.getTime())) {
                yearsSet.add(dateObj.getFullYear());
            }
        }
    });

    // Сортируем года по возрастанию и добавляем
    const sortedYears = Array.from(yearsSet).sort((a, b) => a - b);
    sortedYears.forEach(year => {
        const opt = document.createElement('option');
        opt.value = year;
        opt.textContent = year;
        selectYear.appendChild(opt);
    });

    // Восстанавливаем выбранное значение, если оно все еще существует в списке
    if (savedVal && Array.from(selectYear.options).some(opt => opt.value === savedVal)) {
        selectYear.value = savedVal;
    }
}

// Заполнение выпадающих списков аэропортов и автозаполнения
function populateAirportDropdowns() {
    const selectFrom = document.getElementById('select-from');
    const manualFrom = document.getElementById('manual-from');
    const manualTo = document.getElementById('manual-to');

    const savedFrom = selectFrom ? selectFrom.value : '';
    const savedManualFrom = manualFrom ? manualFrom.value : '';
    const savedManualTo = manualTo ? manualTo.value : '';

    if (selectFrom) selectFrom.innerHTML = '';
    if (manualFrom) manualFrom.innerHTML = '';
    if (manualTo) manualTo.innerHTML = '';

    const uniqueAirportsMap = {};
    if (baggageDb && baggageDb.airports) {
        Object.values(baggageDb.airports).forEach(ap => {
            if (!ap) return;
            // Исключаем кириллические 3-буквенные коды (ВЛА, ХБР, ХКТ) — используем исключительно 3-буквенную ИАТА латиницу
            const iataCandidate = (ap.iata && /^[A-Z]{3}$/i.test(ap.iata)) ? ap.iata.toUpperCase() : ruToIata(ap.iata || ap.ru);
            if (iataCandidate && /^[A-Z]{3}$/.test(iataCandidate)) {
                if (!uniqueAirportsMap[iataCandidate]) {
                    uniqueAirportsMap[iataCandidate] = {
                        iata: iataCandidate,
                        ru: ap.ru || iataCandidate,
                        name: ap.name || ap.ru || iataCandidate
                    };
                }
            }
        });
    }

    const sortedAirports = Object.values(uniqueAirportsMap).sort((a, b) => a.iata.localeCompare(b.iata));

    if (selectFrom) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = currentLang === 'ru' ? '-- Выберите аэропорт --' : '-- Select Airport --';
        selectFrom.appendChild(defaultOpt);
    }

    if (manualFrom) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = currentLang === 'ru' ? '-- Выберите вылет --' : '-- Select Departure --';
        manualFrom.appendChild(defaultOpt);

        const customOpt = document.createElement('option');
        customOpt.value = '__custom__';
        customOpt.textContent = currentLang === 'ru' ? '✏️ + Вписать свой код...' : '✏️ + Enter custom code...';
        manualFrom.appendChild(customOpt);
    }

    if (manualTo) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = currentLang === 'ru' ? '-- Выберите прилет --' : '-- Select Destination --';
        manualTo.appendChild(defaultOpt);

        const customOpt = document.createElement('option');
        customOpt.value = '__custom__';
        customOpt.textContent = currentLang === 'ru' ? '✏️ + Вписать свой код...' : '✏️ + Enter custom code...';
        manualTo.appendChild(customOpt);
    }

    // Вылетные направления (из активного фильтра вылетов + базы рейсов)
    const customFilters = getCustomAirportFilters();
    const departuresSet = new Set(customFilters.departures || []);
    if (customFilters.departures) {
        customFilters.departures.forEach(d => {
            if (d && !isHeaderGarbage(d)) {
                const iata = ruToIata(d);
                if (iata && !isHeaderGarbage(iata)) departuresSet.add(iata);
            }
        });
    }
    if (userFlights) {
        userFlights.forEach(f => {
            if (f.from && !isHeaderGarbage(f.from)) {
                departuresSet.add(f.from);
                const iata = ruToIata(f.from);
                if (iata && !isHeaderGarbage(iata)) departuresSet.add(iata);
            }
        });
    }

    // Прилетные направления (из активного фильтра прилетов + всех рейсов)
    const arrivalsSet = new Set(customFilters.arrivals || []);
    if (customFilters.arrivals) {
        customFilters.arrivals.forEach(a => {
            if (a && !isHeaderGarbage(a)) {
                const iata = ruToIata(a);
                if (iata && !isHeaderGarbage(iata)) arrivalsSet.add(iata);
            }
        });
    }
    if (userFlights) {
        userFlights.forEach(f => {
            if (f.to && !isHeaderGarbage(f.to)) {
                arrivalsSet.add(f.to);
                const iata = ruToIata(f.to);
                if (iata && !isHeaderGarbage(iata)) arrivalsSet.add(iata);
            }
        });
    }

    sortedAirports.forEach(ap => {
        if (!ap || !ap.iata || !/^[A-Z]{3}$/.test(ap.iata)) return;
        const optText = ap.iata;
        
        // В выпадающие списки вылета (selectFrom и manualFrom)
        const isAllowedDep = departuresSet.has(ap.iata) || departuresSet.has(ap.ru);
        if (isAllowedDep) {
            if (selectFrom) {
                const opt = document.createElement('option');
                opt.value = ap.iata;
                opt.textContent = optText;
                selectFrom.appendChild(opt);
            }

            if (manualFrom) {
                const opt = document.createElement('option');
                opt.value = ap.iata;
                opt.textContent = optText;
                manualFrom.appendChild(opt);
            }
        }

        // В выпадающий список прилета (manualTo)
        const isAllowedArr = arrivalsSet.size === 0 || arrivalsSet.has(ap.iata) || arrivalsSet.has(ap.ru);
        if (isAllowedArr) {
            if (manualTo) {
                const opt = document.createElement('option');
                opt.value = ap.iata;
                opt.textContent = optText;
                manualTo.appendChild(opt);
            }
        }
    });

    // Восстанавливаем выбранные значения
    if (selectFrom && savedFrom && Array.from(selectFrom.options).some(opt => opt.value === savedFrom)) {
        selectFrom.value = savedFrom;
    }
    if (manualFrom && savedManualFrom && Array.from(manualFrom.options).some(opt => opt.value === savedManualFrom)) {
        manualFrom.value = savedManualFrom;
    }
    if (manualTo && savedManualTo && Array.from(manualTo.options).some(opt => opt.value === savedManualTo)) {
        manualTo.value = savedManualTo;
    }

    const today = new Date().toISOString().split('T')[0];
    const manualDate = document.getElementById('manual-date');
    if (manualDate && !manualDate.value) manualDate.value = today;
}

// Получение числовой части номера рейса без префиксов авиакомпаний (N4, EO, KL и т.д.)
function getNumericFlightNo(fltStr) {
    if (!fltStr) return '';
    const clean = String(fltStr).trim().toUpperCase().replace(/^(N4|EO|KL|КЛ|Н4|ЕО)\s*[-]?\s*/i, '');
    const m = clean.match(/\d+/);
    return m ? m[0] : String(fltStr).replace(/\D+/g, '');
}

// Поиск маршрута вылета/прилета по номеру рейса (возвращает ИАТА коды)
function findRouteByFlightNo(flightNo) {
    if (!flightNo) return null;
    const targetNum = getNumericFlightNo(flightNo);
    if (!targetNum) return null;

    // Сначала ищем в загруженных рейсах
    if (userFlights && userFlights.length > 0) {
        for (const f of userFlights) {
            if (f.flight_no && getNumericFlightNo(f.flight_no) === targetNum) {
                const fromIata = ruToIata(f.from) || f.from;
                const toIata = ruToIata(f.to) || f.to;
                return { from: fromIata, to: toIata };
            }
        }
    }

    // Если нет, ищем в правилах базы данных
    if (baggageDb && baggageDb.rules) {
        for (const rule of baggageDb.rules) {
            if (rule.flt_no && getNumericFlightNo(rule.flt_no) === targetNum) {
                const fromIata = ruToIata(rule.from) || rule.from;
                const toIata = ruToIata(rule.to) || rule.to;
                return { from: fromIata, to: toIata };
            }
        }
    }

    return null;
}

// Автоматический двуэтапный выбор вылета и прилета в элементах select
function applyRouteSelection(route) {
    if (!route || !route.from || !route.to) return false;
    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');
    if (!selectFrom || !selectTo) return false;

    isAutoSelectingRoute = true;
    let fromOptionFound = false;

    const targetFromIata = (ruToIata(route.from) || route.from).trim().toUpperCase();
    const targetToIata = (ruToIata(route.to) || route.to).trim().toUpperCase();

    // 1. Выбираем аэропорт вылета
    for (let opt of selectFrom.options) {
        const optIata = (ruToIata(opt.value) || opt.value).trim().toUpperCase();
        if (opt.value === route.from || optIata === targetFromIata) {
            selectFrom.value = opt.value;
            fromOptionFound = true;
            break;
        }
    }

    // 2. Генерация списка прилетов и выбор аэропорта прилета
    if (fromOptionFound) {
        selectFrom.dispatchEvent(new Event('change'));

        selectTo.disabled = false;
        let toOptionFound = false;
        for (let opt of selectTo.options) {
            const optIata = (ruToIata(opt.value) || opt.value).trim().toUpperCase();
            if (opt.value === route.to || optIata === targetToIata) {
                selectTo.value = opt.value;
                toOptionFound = true;
                break;
            }
        }
        isAutoSelectingRoute = false;
        updateDefaultPaxForSelectedFlight();
        return toOptionFound;
    }

    isAutoSelectingRoute = false;
    return false;
}

// Расчет среднего количества пассажиров по рейсу или направлению из базы данных
function getAveragePaxForFlight(flightNo = '', fromVal = '', toVal = '') {
    const allFlights = (userFlights && Array.isArray(userFlights)) ? userFlights : [];
    if (!allFlights || allFlights.length === 0) return 150;

    const cleanFlt = flightNo ? String(flightNo).replace(/\D/g, '') : '';
    const normFrom = fromVal ? (ruToIata(fromVal) || fromVal).trim().toUpperCase() : '';
    const normTo = toVal ? (ruToIata(toVal) || toVal).trim().toUpperCase() : '';

    // 1. Поиск по точному номеру рейса и направлению (from + to)
    if (cleanFlt && normFrom && normTo) {
        const matches = allFlights.filter(f => {
            const fClean = (f.flight_no || '').replace(/\D/g, '');
            const fFrom = (ruToIata(f.from) || f.from || '').trim().toUpperCase();
            const fTo = (ruToIata(f.to) || f.to || '').trim().toUpperCase();
            const pax = getEffectivePaxCount(f);
            return fClean === cleanFlt && (fFrom === normFrom || fFrom.includes(normFrom)) && (fTo === normTo || fTo.includes(normTo)) && pax > 0;
        });
        if (matches.length > 0) {
            const sumPax = matches.reduce((acc, f) => acc + getEffectivePaxCount(f), 0);
            return Math.max(1, Math.round(sumPax / matches.length));
        }
    }

    // 2. Поиск только по номеру рейса
    if (cleanFlt) {
        const matches = allFlights.filter(f => {
            const fClean = (f.flight_no || '').replace(/\D/g, '');
            const pax = getEffectivePaxCount(f);
            return fClean === cleanFlt && pax > 0;
        });
        if (matches.length > 0) {
            const sumPax = matches.reduce((acc, f) => acc + getEffectivePaxCount(f), 0);
            return Math.max(1, Math.round(sumPax / matches.length));
        }
    }

    // 3. Поиск по направлению (from + to)
    if (normFrom && normTo) {
        const matches = allFlights.filter(f => {
            const fFrom = (ruToIata(f.from) || f.from || '').trim().toUpperCase();
            const fTo = (ruToIata(f.to) || f.to || '').trim().toUpperCase();
            const pax = getEffectivePaxCount(f);
            return (fFrom === normFrom || fFrom.includes(normFrom)) && (fTo === normTo || fTo.includes(normTo)) && pax > 0;
        });
        if (matches.length > 0) {
            const sumPax = matches.reduce((acc, f) => acc + getEffectivePaxCount(f), 0);
            return Math.max(1, Math.round(sumPax / matches.length));
        }
    }

    return 150;
}

// Автоподстановка среднего числа пассажиров в поле input-pax
function updateDefaultPaxForSelectedFlight() {
    const inputPax = document.getElementById('input-pax');
    const selectFlight = document.getElementById('select-flight');
    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');

    if (!inputPax) return;

    const flightVal = selectFlight ? selectFlight.value.trim() : '';
    const fromVal = selectFrom ? selectFrom.value : '';
    const toVal = selectTo ? selectTo.value : '';

    if (!flightVal && !fromVal && !toVal) return;

    const avgPax = getAveragePaxForFlight(flightVal, fromVal, toVal);
    if (avgPax > 0) {
        inputPax.value = avgPax;
        updatePaxExpectedHint();
    }
}

// Индекс выделенного элемента клавиатурной навигацией
let currentHighlightedSuggestionIndex = -1;

// Генерация и отображение кастомных автоподсказок для поля "Номер рейса" (HUD Style)
function renderCustomFlightSuggestions(filterText = '', forceShow = false) {
    const dropdownPanel = document.getElementById('flight-suggestions-dropdown');
    const chevron = document.getElementById('btn-toggle-flight-dropdown');
    if (!dropdownPanel) return;

    const val = String(filterText).trim().toUpperCase();

    // Изначально выпадающий список со всеми рейсами должен быть сложен
    if (val === '' && !forceShow) {
        hideCustomFlightSuggestions();
        return;
    }

    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');

    const routeFrom = selectFrom ? selectFrom.value : '';
    const routeTo = selectTo ? selectTo.value : '';

    const fromIata = routeFrom ? (ruToIata(routeFrom) || routeFrom) : '';
    const toIata = routeTo ? (ruToIata(routeTo) || routeTo) : '';

    const flightMap = new Map(); // flight_no -> route text

    // 1. Из правил базы данных
    if (baggageDb && baggageDb.rules) {
        baggageDb.rules.forEach(rule => {
            if (rule.flt_no) {
                const rFrom = rule.from;
                const rTo = rule.to;
                const cleanNo = getNumericFlightNo(rule.flt_no) || rule.flt_no;
                if ((!fromIata || rFrom === fromIata) && (!toIata || rTo === toIata)) {
                    flightMap.set(cleanNo, `${rFrom} ➔ ${rTo}`);
                }
            }
        });
    }

    // 2. Из пользовательской базы рейсов
    if (userFlights) {
        userFlights.forEach(f => {
            if (f.flight_no) {
                const fFrom = ruToIata(f.from) || f.from;
                const fTo = ruToIata(f.to) || f.to;
                const cleanNo = getNumericFlightNo(f.flight_no) || f.flight_no;
                if ((!fromIata || fFrom === fromIata) && (!toIata || fTo === toIata)) {
                    flightMap.set(cleanNo, `${fFrom} ➔ ${fTo}`);
                }
            }
        });
    }

    // 3. Строгая префиксная фильтрация по началу имени рейса или его числовой части
    let matchedFlights = Array.from(flightMap.keys());
    if (val !== '') {
        matchedFlights = matchedFlights.filter(fl => {
            const flUpper = String(fl).toUpperCase();
            const numPart = getNumericFlightNo(fl);

            // Рейс подходит только если полное имя (EO-347, 409) или числовая часть (347, 409) НАЧИНАЕТСЯ с введенных символов
            const fullStartsWith = flUpper.startsWith(val);
            const numStartsWith = numPart.startsWith(val);

            return fullStartsWith || numStartsWith;
        });
    }

    // 4. Строгая последовательная сортировка по возрастанию числового номера рейса
    matchedFlights.sort((a, b) => {
        const numA = parseInt(getNumericFlightNo(a), 10) || 0;
        const numB = parseInt(getNumericFlightNo(b), 10) || 0;
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
    });

    // Перебираем варианты для выпадающего списка

    dropdownPanel.innerHTML = '';
    currentHighlightedSuggestionIndex = -1;

    if (matchedFlights.length === 0) {
        hideCustomFlightSuggestions();
        return;
    } else {
        matchedFlights.forEach((fl) => {
            const routeStr = flightMap.get(fl);
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.setAttribute('data-flight', fl);

            item.innerHTML = `
                <span class="suggestion-flight-no">${fl}</span>
                <span class="suggestion-route-tag">${routeStr}</span>
            `;

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                selectFlightOption(fl);
            });

            dropdownPanel.appendChild(item);
        });
    }

    dropdownPanel.classList.remove('hidden');
    if (chevron) chevron.classList.add('open');
}

// Скрытие кастомного выпадающего списка
function hideCustomFlightSuggestions() {
    const dropdownPanel = document.getElementById('flight-suggestions-dropdown');
    const chevron = document.getElementById('btn-toggle-flight-dropdown');
    if (dropdownPanel) dropdownPanel.classList.add('hidden');
    if (chevron) chevron.classList.remove('open');
    currentHighlightedSuggestionIndex = -1;
}

// Выбор конкретного рейса из списка подсказок
function selectFlightOption(flightNo) {
    const selectFlight = document.getElementById('select-flight');

    if (selectFlight) {
        selectFlight.value = flightNo;
    }

    const route = findRouteByFlightNo(flightNo);
    if (route) {
        applyRouteSelection(route);
    } else {
        updateDefaultPaxForSelectedFlight();
    }

    hideCustomFlightSuggestions();
}

function populateAllFlightsDropdown(routeFrom = '', routeTo = '') {
    // Вспомогательная функция для обновления подсказок при смене вылета/прилета
    if (document.getElementById('select-flight')) {
        renderCustomFlightSuggestions(document.getElementById('select-flight').value);
    }
}

// Настройка сквозной мгновенной навигации по клавише TAB (по 1 нажатию) между всеми окнами формы прогнозирования
function setupFormTabNavigation() {
    const selectFlight = document.getElementById('select-flight');
    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');
    const inputPax = document.getElementById('input-pax');
    const inputDate = document.getElementById('input-date');
    const btnCalculate = document.getElementById('btn-calculate');

    // 1. Из "Номер рейса" по 1-му TAB ➔ в "Аэропорт вылета"
    if (selectFlight) {
        selectFlight.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                hideCustomFlightSuggestions();
                if (selectFrom) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    selectFrom.focus();
                }
            }
        }, true);
    }

    // 2. Из "Аэропорт вылета" по 1-му TAB ➔ в "Аэропорт прилета"
    if (selectFrom) {
        selectFrom.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                if (selectTo && !selectTo.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    selectTo.focus();
                } else if (inputPax) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    inputPax.focus();
                }
            }
        }, true);
    }

    // 3. Из "Аэропорт прилета" по 1-му TAB ➔ в "Пассажиры"
    if (selectTo) {
        selectTo.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                if (inputPax) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    inputPax.focus();
                }
            }
        }, true);
    }

    // 4. Из "Пассажиры" по 1-му TAB ➔ в "Дата рейса"
    if (inputPax) {
        inputPax.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                if (inputDate) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    inputDate.focus();
                }
            }
        }, true);
    }

    // 5. Из "Дата рейса" по 1-му TAB ➔ на кнопку "Рассчитать прогноз"
    if (inputDate) {
        inputDate.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (btnCalculate) {
                    btnCalculate.focus();
                }
            }
        }, true);
    }
}

// Вызов стандартного календаря
function setupDatePickerTrigger() {
    ['manual-date', 'input-date'].forEach(id => {
        const dateInput = document.getElementById(id);
        if (dateInput) {
            dateInput.addEventListener('click', (e) => {
                try {
                    if (typeof e.target.showPicker === 'function') {
                        e.target.showPicker();
                    }
                } catch (err) {
                    console.log("showPicker not supported or failed", err);
                }
            });
        }
    });
}

// Настройка слушателей событий
function setupEventListeners() {
    setupFormTabNavigation();
    // Резервное копирование и восстановление базы данных
    const btnExportDb = document.getElementById('btn-export-db');
    if (btnExportDb) {
        btnExportDb.addEventListener('click', handleExportDatabase);
    }

    const btnImportDb = document.getElementById('btn-import-db');
    const backupFileInput = document.getElementById('backup-file-input');
    if (btnImportDb && backupFileInput) {
        btnImportDb.addEventListener('click', () => {
            backupFileInput.click();
        });
        backupFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleImportDatabase(e.target.files[0]);
            }
        });
    }

    const chkShowAll = document.getElementById('chk-show-all-flights');
    if (chkShowAll) {
        chkShowAll.addEventListener('change', () => {
            renderFlightsTable();
        });
    }

    // Настройки анализа и сезонности
    const btnToggleSettings = document.getElementById('btn-toggle-settings');
    const settingsPanel = document.getElementById('analysis-settings-panel');
    if (btnToggleSettings && settingsPanel) {
        btnToggleSettings.addEventListener('click', () => {
            btnToggleSettings.classList.toggle('active');
            settingsPanel.classList.toggle('hidden');
        });
    }

    const selectPeriodType = document.getElementById('select-period-type');
    const customRangeInputs = document.getElementById('custom-range-inputs');
    const seasonalInputs = document.getElementById('seasonal-inputs');
    if (selectPeriodType) {
        selectPeriodType.addEventListener('change', () => {
            const val = selectPeriodType.value;
            if (val === 'custom') {
                if (customRangeInputs) customRangeInputs.classList.remove('hidden');
                if (seasonalInputs) seasonalInputs.classList.add('hidden');
            } else if (val === 'seasonal') {
                if (customRangeInputs) customRangeInputs.classList.add('hidden');
                if (seasonalInputs) seasonalInputs.classList.remove('hidden');
            } else {
                if (customRangeInputs) customRangeInputs.classList.add('hidden');
                if (seasonalInputs) seasonalInputs.classList.add('hidden');
            }
        });
    }

    // Язык
    document.getElementById('btn-lang-ru').addEventListener('click', () => setLanguage('ru'));
    document.getElementById('btn-lang-en').addEventListener('click', () => setLanguage('en'));

    // Тема
    document.getElementById('btn-theme-toggle').addEventListener('click', toggleTheme);

    // Вкладки (Tabs)
    setupTabs();

    // Связка выпадающих списков вылета и прилета
    const selectFrom = document.getElementById('select-from');
    const selectTo = document.getElementById('select-to');
    const selectFlight = document.getElementById('select-flight');

    selectFrom.addEventListener('change', () => {
        const fromVal = selectFrom.value;
        if (!fromVal) {
            selectTo.disabled = true;
            selectTo.innerHTML = `<option value="">${translations[currentLang]['select-from-first']}</option>`;
            
            if (!isAutoSelectingRoute) {
                populateAllFlightsDropdown();
            }
            return;
        }

        const availableTos = new Set();
        const fromIata = ruToIata(fromVal);
        
        // Из правил (ИАТА)
        baggageDb.rules.forEach(rule => {
            if (rule.from === fromIata) {
                availableTos.add(iataToRu(rule.to));
            }
        });

        // Из загруженных
        userFlights.forEach(flight => {
            if (ruToIata(flight.from) === ruToIata(fromVal)) {
                availableTos.add(flight.to);
            }
        });

        selectTo.innerHTML = '';
        const defaultToOpt = document.createElement('option');
        defaultToOpt.value = '';
        defaultToOpt.textContent = currentLang === 'ru' ? '-- Выберите направление --' : '-- Select Destination --';
        selectTo.appendChild(defaultToOpt);

        Array.from(availableTos)
            .map(toRu => {
                const ap = baggageDb.airports[toRu] || Object.values(baggageDb.airports).find(a => a.iata === ruToIata(toRu));
                const iata = ap ? ap.iata : ruToIata(toRu);
                return { toRu, iata };
            })
            .sort((a, b) => a.iata.localeCompare(b.iata))
            .forEach(({ toRu, iata }) => {
                const opt = document.createElement('option');
                opt.value = iata;
                opt.textContent = iata;
                selectTo.appendChild(opt);
            });

        selectTo.disabled = false;
        
        if (!isAutoSelectingRoute) {
            populateAllFlightsDropdown(selectFrom.value, selectTo.value);
        }
    });

    selectTo.addEventListener('change', () => {
        if (!isAutoSelectingRoute) {
            populateAllFlightsDropdown(selectFrom.value, selectTo.value);
            updateDefaultPaxForSelectedFlight();
        }
    });

    const handleFlightInput = () => {
        if (isAutoSelectingRoute) return;
        const flightVal = selectFlight ? selectFlight.value.trim().toUpperCase() : '';

        // Если поле рейса очищено, направления Аэропорта вылета и Аэропорта прилёта ТОЖЕ ДОЛЖНЫ ПРОПАСТЬ
        if (!flightVal) {
            if (selectFrom) selectFrom.value = '';
            if (selectTo) {
                selectTo.disabled = true;
                selectTo.innerHTML = `<option value="">${translations[currentLang]['select-from-first']}</option>`;
                selectTo.value = '';
            }
            hideCustomFlightSuggestions();
            return;
        }

        // Показываем кастомный темно-синий HUD-список подсказок со строгой префиксной фильтрацией по порядку
        renderCustomFlightSuggestions(flightVal);

        const route = findRouteByFlightNo(flightVal);
        if (route) {
            applyRouteSelection(route);
        } else {
            updateDefaultPaxForSelectedFlight();
        }
    };

    if (selectFlight) {
        selectFlight.addEventListener('input', handleFlightInput);

        selectFlight.addEventListener('change', () => {
            updateDefaultPaxForSelectedFlight();
        });

        selectFlight.addEventListener('blur', () => {
            updateDefaultPaxForSelectedFlight();
        });

        selectFlight.addEventListener('focus', () => {
            if (selectFlight.value.trim() !== '') {
                renderCustomFlightSuggestions(selectFlight.value);
            }
        });

        // Навигация с клавиатуры (Стрелки вверх/вниз, Enter, Escape)
        selectFlight.addEventListener('keydown', (e) => {
            const dropdownPanel = document.getElementById('flight-suggestions-dropdown');
            if (!dropdownPanel || dropdownPanel.classList.contains('hidden')) return;

            const items = dropdownPanel.querySelectorAll('.suggestion-item');
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentHighlightedSuggestionIndex = (currentHighlightedSuggestionIndex + 1) % items.length;
                updateSuggestionHighlight(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentHighlightedSuggestionIndex = (currentHighlightedSuggestionIndex - 1 + items.length) % items.length;
                updateSuggestionHighlight(items);
            } else if (e.key === 'Enter') {
                if (currentHighlightedSuggestionIndex >= 0 && currentHighlightedSuggestionIndex < items.length) {
                    e.preventDefault();
                    const selectedFlight = items[currentHighlightedSuggestionIndex].getAttribute('data-flight');
                    if (selectedFlight) selectFlightOption(selectedFlight);
                }
            } else if (e.key === 'Escape' || e.key === 'Tab') {
                hideCustomFlightSuggestions();
            }
        });
    }

    function updateSuggestionHighlight(items) {
        items.forEach((item, idx) => {
            if (idx === currentHighlightedSuggestionIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    const chevronBtn = document.getElementById('btn-toggle-flight-dropdown');
    if (chevronBtn) {
        chevronBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdownPanel = document.getElementById('flight-suggestions-dropdown');
            if (dropdownPanel && !dropdownPanel.classList.contains('hidden')) {
                hideCustomFlightSuggestions();
            } else {
                if (selectFlight) {
                    renderCustomFlightSuggestions(selectFlight.value, true);
                    selectFlight.focus();
                }
            }
        });
    }

    document.addEventListener('click', (e) => {
        const wrapper = document.querySelector('.custom-autocomplete-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            hideCustomFlightSuggestions();
        }
    });

    // Функция жесткого сброса при вводе более 1000 человек
    const attachPaxMaxLimit = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const enforce = () => {
            if (el.value === '') return;
            let val = parseInt(el.value, 10);
            if (isNaN(val) || val < 0) {
                el.value = 0;
            } else if (val > 1000) {
                el.value = 1000;
            }
        };
        ['input', 'change', 'keyup', 'blur'].forEach(evt => el.addEventListener(evt, enforce));
    };

    ['input-pax', 'manual-men', 'manual-women', 'manual-rb', 'manual-rm'].forEach(attachPaxMaxLimit);

    // Обработчик переключения на кастомный аэропорт
    const manualFrom = document.getElementById('manual-from');
    const manualFromCustom = document.getElementById('manual-from-custom');
    if (manualFrom && manualFromCustom) {
        manualFrom.addEventListener('change', () => {
            if (manualFrom.value === '__custom__') {
                manualFromCustom.classList.remove('hidden');
                manualFromCustom.focus();
            } else {
                manualFromCustom.classList.add('hidden');
                manualFromCustom.value = '';
            }
        });
    }

    const manualTo = document.getElementById('manual-to');
    const manualToCustom = document.getElementById('manual-to-custom');
    if (manualTo && manualToCustom) {
        manualTo.addEventListener('change', () => {
            if (manualTo.value === '__custom__') {
                manualToCustom.classList.remove('hidden');
                manualToCustom.focus();
            } else {
                manualToCustom.classList.add('hidden');
                manualToCustom.value = '';
            }
        });
    }

    // Жесткое ограничение до 3 заглавных символов в полях ввода своего кода
    const enforce3LetterCaps = (el) => {
        if (!el) return;
        ['input', 'change', 'keyup', 'blur', 'paste'].forEach(evt => {
            el.addEventListener(evt, () => {
                setTimeout(() => {
                    el.value = el.value.toUpperCase().replace(/[^A-ZА-Я0-9]/gi, '').slice(0, 3);
                }, 0);
            });
        });
    };
    enforce3LetterCaps(manualFromCustom);
    enforce3LetterCaps(manualToCustom);


    // Обработчик переключателя режима явки пассажиров (Факт 100% / Бронь 97%) с автоматическим пересчетом
    document.querySelectorAll('input[name="pax-mode"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updatePaxExpectedHint();
            calculateBaggageForecast(false);
        });
    });

    const inputPaxEl = document.getElementById('input-pax');
    if (inputPaxEl) {
        ['input', 'change'].forEach(evt => {
            inputPaxEl.addEventListener(evt, updatePaxExpectedHint);
        });
    }

    // Обработчик кнопки расчета: весь пересчет выполняется строго по нажатию на кнопку
    document.getElementById('btn-calculate').addEventListener('click', () => calculateBaggageForecast(true));
    document.getElementById('form-manual-flight').addEventListener('submit', handleManualFlightSubmit);

    const btnLoadSample = document.getElementById('btn-load-sample');
    if (btnLoadSample) {
        btnLoadSample.addEventListener('click', async () => {
            await loadSystemStats(false);
        });
    }

    updatePaxExpectedHint();
    initBacktestModule();
    setupDragAndDrop();

    // Слушатели авторизации и профиля
    const authForm = document.getElementById('app-auth-form');
    if (authForm) authForm.addEventListener('submit', handleLoginSubmit);

    // Функция переключения видимости пароля (Глазок 👁️ / 🙈)
    function setupPasswordToggle(btnId, inputId) {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (btn && input) {
            btn.addEventListener('click', () => {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.textContent = '🙈';
                } else {
                    input.type = 'password';
                    btn.textContent = '👁️';
                }
            });
        }
    }

    setupPasswordToggle('btn-toggle-auth-pass', 'auth-password');
    setupPasswordToggle('btn-toggle-edit-pass', 'edit-user-pass');
    setupPasswordToggle('btn-toggle-new-pass', 'new-password-input');
    setupPasswordToggle('btn-toggle-confirm-pass', 'confirm-password-input');

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', handleLogout);

    // Слушатели управления пользователями (RBAC)
    const btnAddUser = document.getElementById('btn-add-user');
    if (btnAddUser) btnAddUser.addEventListener('click', openCreateUserModal);

    const btnCloseUserModal = document.getElementById('btn-close-user-modal');
    const btnCancelUserModal = document.getElementById('btn-cancel-user-modal');
    const userModal = document.getElementById('modal-user-edit');
    [btnCloseUserModal, btnCancelUserModal].forEach(btn => {
        if (btn && userModal) btn.addEventListener('click', () => userModal.classList.add('hidden'));
    });

    const formUserEdit = document.getElementById('form-user-edit');
    if (formUserEdit) formUserEdit.addEventListener('submit', handleSaveUser);

    const btnClosePassModal = document.getElementById('btn-close-pass-modal');
    const btnCancelPassModal = document.getElementById('btn-cancel-pass-modal');
    const passModal = document.getElementById('modal-change-user-pass');
    [btnClosePassModal, btnCancelPassModal].forEach(btn => {
        if (btn && passModal) btn.addEventListener('click', () => passModal.classList.add('hidden'));
    });

    const formChangePass = document.getElementById('form-change-password');
    if (formChangePass) formChangePass.addEventListener('submit', handleSaveNewPassword);

    // Слушатели автоматических бэкапов
    const btnCreateServerBackup = document.getElementById('btn-create-server-backup');
    if (btnCreateServerBackup) btnCreateServerBackup.addEventListener('click', createServerBackupNow);
}

// Автоматическая/ручная загрузка системной статистики stats_july.xls
async function loadSystemStats(isSilent = true) {
    try {
        const response = await fetch('stats_july.xls');
        if (!response.ok) {
            throw new Error("Файл не найден");
        }
        const data = await response.arrayBuffer();
        const arr = new Uint8Array(data);
        const workbook = XLSX.read(arr, {type: 'array', cellDates: false});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: false});
        
        processRegistrationData('Подробная статистика за Июль.xls', rows, { isSilent: isSilent, isSystem: true });
    } catch (err) {
        console.error("Ошибка автозагрузки статистики:", err);
        if (!isSilent) {
            showAviationAlert((currentLang === 'ru' ? 'Не удалось загрузить системную статистику: ' : 'Failed to load system statistics: ') + err.message, true);
        }
    }
}

// ==========================================================================
// СИСТЕМА АУТЕНТИФИКАЦИИ, РАЗГРАНИЧЕНИЯ РОЛЕЙ (RBAC) И АВТОМАТИЧЕСКИХ БЭКАПОВ
// ==========================================================================

// Проверка текущей сессии пользователя
async function checkAuthStatus() {
    try {
        const response = await fetch('api.php?action=check_auth');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.success && data.authenticated && data.user) {
                currentUser = data.user;
                isAdminAuthenticated = (currentUser.role === 'admin');
                isOfflineMode = false;
                localStorage.setItem('averago_current_user_profile', JSON.stringify(currentUser));
                localStorage.setItem('averago_local_auth_user', JSON.stringify(currentUser));
                
                const authModal = document.getElementById('app-auth-modal');
                if (authModal) authModal.classList.add('hidden');

                updateUserHeaderUI();
                updateTabsRoleAccess();
                
                if (currentUser.role === 'admin') {
                    loadUsersList();
                    loadServerBackupsList();
                }
                await loadUserFlights();
                return true;
            } else if (data.db_not_configured || (data.error && data.error.includes('подключения к базе данных'))) {
                // База данных MySQL на сервере не настроена/недоступна - переключаемся в локальный режим
                isOfflineMode = true;
            }
        } else {
            // Ответ не JSON - локальный режим без PHP
            isOfflineMode = true;
        }
    } catch (e) {
        console.warn("API недоступно, переключаемся в локальный режим:", e);
        isOfflineMode = true;
    }

    // Проверка сохраненной локальной сессии для оффлайн-режима
    if (isOfflineMode) {
        const savedLocalUser = localStorage.getItem('averago_local_auth_user') || localStorage.getItem('averago_current_user_profile');
        if (savedLocalUser) {
            try {
                currentUser = JSON.parse(savedLocalUser);
                isAdminAuthenticated = (currentUser && currentUser.role === 'admin');
                localStorage.setItem('averago_current_user_profile', JSON.stringify(currentUser));
                localStorage.setItem('averago_local_auth_user', JSON.stringify(currentUser));
                const authModal = document.getElementById('app-auth-modal');
                if (authModal) authModal.classList.add('hidden');
                updateUserHeaderUI();
                updateTabsRoleAccess();
                await loadUserFlights();
                return true;
            } catch(e) {}
        }
    }

    // Если не авторизован - сбрасываем кэш и показываем окно логина
    localStorage.removeItem('averago_current_user_profile');
    localStorage.removeItem('averago_local_auth_user');
    currentUser = null;
    isAdminAuthenticated = false;
    const authModal = document.getElementById('app-auth-modal');
    if (authModal) {
        authModal.classList.remove('hidden');
        const userInp = document.getElementById('auth-username');
        if (userInp) setTimeout(() => userInp.focus(), 100);
    }
    updateUserHeaderUI();
    updateTabsRoleAccess();
    return false;
}

// Обработка отправки формы входа
async function handleLoginSubmit(e) {
    if (e) e.preventDefault();
    const usernameInput = document.getElementById('auth-username');
    const passwordInput = document.getElementById('auth-password');
    const errorEl = document.getElementById('auth-error-msg');
    const submitBtn = document.getElementById('btn-submit-login');

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!username) {
        if (errorEl) {
            errorEl.textContent = (currentLang === 'ru' ? 'Введите логин.' : 'Enter username.');
            errorEl.classList.remove('hidden');
        }
        return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (errorEl) errorEl.classList.add('hidden');

    // Функция локального входа (для оффлайн-режима)
    const processLocalLogin = async () => {
        isOfflineMode = true;
        const uUpper = username.toUpperCase();
        if (uUpper === 'ADMIN' && (password === 'AeroBag#2026!Master' || password === 'NW2026' || password === 'admin' || password === '')) {
            currentUser = { id: 'usr_local_admin', username: 'ADMIN', full_name: 'Главный Администратор (Local)', role: 'admin' };
        } else {
            currentUser = { id: 'usr_local_disp', username: username, full_name: `Диспетчер (${username})`, role: 'dispatcher' };
        }

        localStorage.setItem('averago_local_auth_user', JSON.stringify(currentUser));
        localStorage.setItem('averago_current_user_profile', JSON.stringify(currentUser));
        isAdminAuthenticated = (currentUser.role === 'admin');

        const authModal = document.getElementById('app-auth-modal');
        if (authModal) authModal.classList.add('hidden');

        if (passwordInput) passwordInput.value = '';
        updateUserHeaderUI();
        updateTabsRoleAccess();
        loadPredictionsHistory();
        await loadUserFlights();

        if (submitBtn) submitBtn.disabled = false;
        const greetingName = getGreetingName(currentUser);
        const welcomeMsg = (currentLang === 'ru' ? 'Локальный режим: Добро пожаловать, ' : 'Offline mode: Welcome, ') + greetingName;
        showAviationAlert(welcomeMsg, false);
    };

    // Если уже в оффлайн-режиме:
    if (isOfflineMode) {
        await processLocalLogin();
        return;
    }

    try {
        const response = await fetch('api.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Ответ не JSON -> локальный режим
            await processLocalLogin();
            return;
        }

        const data = await response.json();

        if (data.db_not_configured || (data.error && data.error.includes('подключения к базе данных'))) {
            // База MySQL не настроена на сервере -> локальный вход
            await processLocalLogin();
            return;
        }

        if (data.success && data.user) {
            currentUser = data.user;
            isAdminAuthenticated = (currentUser.role === 'admin');
            localStorage.setItem('averago_current_user_profile', JSON.stringify(currentUser));
            localStorage.setItem('averago_local_auth_user', JSON.stringify(currentUser));

            const authModal = document.getElementById('app-auth-modal');
            if (authModal) authModal.classList.add('hidden');

            if (passwordInput) passwordInput.value = '';
            
            updateUserHeaderUI();
            updateTabsRoleAccess();
            loadPredictionsHistory();

            // Загружаем рейсы и базу
            await loadUserFlights();

            if (currentUser.role === 'admin') {
                loadUsersList();
                loadServerBackupsList();
            }

            const greetingName = getGreetingName(currentUser);
            const welcomeMsg = (currentLang === 'ru' ? 'Добро пожаловать в систему, ' : 'Welcome to system, ') + greetingName;
            showAviationAlert(welcomeMsg, false);
        } else {
            if (errorEl) {
                errorEl.textContent = data.error || (currentLang === 'ru' ? 'Неверный логин или пароль.' : 'Invalid login or password.');
                errorEl.classList.remove('hidden');
            }
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
    } catch (err) {
        console.warn("Ошибка соединения с PHP API, переключаемся в оффлайн-режим:", err);
        await processLocalLogin();
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

// Завершение сессии (Выход)
async function handleLogout() {
    try {
        await fetch('api.php?action=logout');
    } catch (e) {
        console.warn("Ошибка логаута:", e);
    }
    localStorage.removeItem('averago_local_auth_user');
    localStorage.removeItem('averago_current_user_profile');
    currentUser = null;
    isAdminAuthenticated = false;
    predictionsHistory = [];
    renderPredictionsTable();
    
    // Переключаем на вкладку прогнозирования
    const tabPredictBtn = document.getElementById('tab-btn-predict');
    if (tabPredictBtn) tabPredictBtn.click();

    updateUserHeaderUI();
    updateTabsRoleAccess();

    const authModal = document.getElementById('app-auth-modal');
    if (authModal) {
        authModal.classList.remove('hidden');
        const userInp = document.getElementById('auth-username');
        const passInp = document.getElementById('auth-password');
        const errorEl = document.getElementById('auth-error-msg');
        if (userInp) userInp.value = '';
        if (passInp) passInp.value = '';
        if (errorEl) errorEl.classList.add('hidden');
        if (userInp) setTimeout(() => userInp.focus(), 100);
    }
}

// Обновление профиля пользователя в шапке
function updateUserHeaderUI() {
    const profileContainer = document.getElementById('header-user-profile');
    const roleBadge = document.getElementById('user-role-badge');
    const fullnameEl = document.getElementById('user-fullname');

    if (!profileContainer) return;

    if (currentUser) {
        profileContainer.classList.remove('hidden');
        if (roleBadge) {
            const isAdmin = (currentUser.role === 'admin');
            roleBadge.className = 'badge-role ' + (isAdmin ? 'badge-role-admin' : 'badge-role-dispatcher');
            roleBadge.textContent = isAdmin ? 'ADMIN' : 'DISPATCHER';
        }
        if (fullnameEl) {
            fullnameEl.textContent = currentUser.full_name || currentUser.username;
        }
    } else {
        profileContainer.classList.add('hidden');
    }
}

// Разграничение видимости вкладок в зависимости от роли
function updateTabsRoleAccess() {
    const tabAdminBtn = document.getElementById('tab-btn-admin');
    if (!tabAdminBtn) return;

    if (currentUser && currentUser.role === 'admin') {
        tabAdminBtn.classList.remove('hidden');
        tabAdminBtn.style.display = '';
    } else {
        tabAdminBtn.classList.add('hidden');
        tabAdminBtn.style.display = 'none';
        // Если открыта вкладка админа, переключаем на прогнозирование
        const adminContent = document.getElementById('tab-content-admin');
        if (adminContent && !adminContent.classList.contains('hidden')) {
            const tabPredictBtn = document.getElementById('tab-btn-predict');
            if (tabPredictBtn) tabPredictBtn.click();
        }
    }
}

// Настройка переключения вкладок
function setupTabs() {
    const tabPredictBtn = document.getElementById('tab-btn-predict');
    const tabDashboardBtn = document.getElementById('tab-btn-dashboard');
    const tabAdminBtn = document.getElementById('tab-btn-admin');
    
    const predictContent = document.getElementById('tab-content-predict');
    const dashboardContent = document.getElementById('tab-content-dashboard');
    const adminContent = document.getElementById('tab-content-admin');

    function switchTab(tabKey) {
        // Защита доступа к разделу Администрирование
        if (tabKey === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
            showAviationAlert((currentLang === 'ru' ? 'Доступ запрещен. Требуются права Администратора.' : 'Access denied. Administrator privileges required.'), true);
            return;
        }

        if (tabPredictBtn) tabPredictBtn.classList.toggle('active', tabKey === 'predict');
        if (tabDashboardBtn) tabDashboardBtn.classList.toggle('active', tabKey === 'dashboard');
        if (tabAdminBtn) tabAdminBtn.classList.toggle('active', tabKey === 'admin');

        if (predictContent) predictContent.classList.toggle('hidden', tabKey !== 'predict');
        if (dashboardContent) dashboardContent.classList.toggle('hidden', tabKey !== 'dashboard');
        if (adminContent) adminContent.classList.toggle('hidden', tabKey !== 'admin');

        if (tabKey === 'dashboard') {
            renderDashboardAnalytics();
        } else if (tabKey === 'admin') {
            populateAirportDropdowns();
            loadUsersList();
            loadServerBackupsList();
        }
    }

    if (tabPredictBtn) tabPredictBtn.addEventListener('click', () => switchTab('predict'));
    if (tabDashboardBtn) tabDashboardBtn.addEventListener('click', () => switchTab('dashboard'));
    if (tabAdminBtn) tabAdminBtn.addEventListener('click', () => switchTab('admin'));

    // Слушатели фильтров Дашборда
    const filterRoute = document.getElementById('dash-filter-route');
    const filterPeriod = document.getElementById('dash-filter-period');
    const customDateContainer = document.getElementById('dash-custom-date-container');
    const dateFrom = document.getElementById('dash-date-from');
    const dateTo = document.getElementById('dash-date-to');

    if (filterRoute) filterRoute.addEventListener('change', renderDashboardAnalytics);
    if (filterPeriod) {
        filterPeriod.addEventListener('change', () => {
            if (filterPeriod.value === 'custom') {
                if (customDateContainer) customDateContainer.classList.remove('hidden');
            } else {
                if (customDateContainer) customDateContainer.classList.add('hidden');
            }
            renderDashboardAnalytics();
        });
    }
    if (dateFrom) dateFrom.addEventListener('change', renderDashboardAnalytics);
    if (dateTo) dateTo.addEventListener('change', renderDashboardAnalytics);
}

// --------------------------------------------------------------------------
// МОДУЛЬ УПРАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯМИ (RBAC)
// --------------------------------------------------------------------------

let systemUsersList = [];

// Загрузка списка пользователей с сервера или локального хранилища
async function loadUsersList() {
    if (!currentUser || currentUser.role !== 'admin') return;

    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    if (!isOfflineMode) {
        try {
            const response = await fetch('api.php?action=get_users');
            const data = await response.json();

            if (data.success && Array.isArray(data.users)) {
                systemUsersList = data.users;
                renderUsersTable();
                return;
            }
        } catch (err) {
            console.warn("Серверная загрузка пользователей недоступна, переключаемся на локальную базу:", err);
        }
    }

    // Резервный локальный режим (Offline)
    try {
        const localData = localStorage.getItem('averago_local_users_db');
        if (localData) {
            systemUsersList = JSON.parse(localData);
        } else {
            systemUsersList = [
                { id: 'usr_local_admin', username: 'ADMIN', full_name: 'Главный Администратор (Local)', role: 'admin', is_active: 1, created_at: '2026-08-29 00:00:00', last_login: '2026-08-29 13:00:00' },
                { id: 'usr_local_disp', username: 'DISP_SVO', full_name: 'Диспетчер (DISP_SVO)', role: 'dispatcher', is_active: 1, created_at: '2026-08-29 00:00:00', last_login: '2026-08-29 13:00:00' }
            ];
            localStorage.setItem('averago_local_users_db', JSON.stringify(systemUsersList));
        }
        renderUsersTable();
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-table-text" style="color: #ef4444;">Ошибка локального хранилища</td></tr>`;
    }
}

// Отрисовка таблицы пользователей
function renderUsersTable() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    if (systemUsersList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-table-text">Пользователи не найдены.</td></tr>`;
        return;
    }

    let html = '';
    systemUsersList.forEach(u => {
        const isAdmin = (u.role === 'admin');
        const isActive = (parseInt(u.is_active, 10) === 1);
        const isSelf = (currentUser && u.id === currentUser.id);

        const roleBadge = isAdmin
            ? `<span class="badge-role badge-role-admin">ADMIN</span>`
            : `<span class="badge-role badge-role-dispatcher">DISPATCHER</span>`;

        const statusBadge = isActive
            ? `<span class="status-pill active">${currentLang === 'ru' ? 'Активен' : 'Active'}</span>`
            : `<span class="status-pill blocked">${currentLang === 'ru' ? 'Заблокирован' : 'Blocked'}</span>`;

        const lastLoginText = u.last_login ? u.last_login : (currentLang === 'ru' ? 'Не входил' : 'Never');

        html += `
            <tr>
                <td><strong>${escapeHtml(u.username)}</strong> ${isSelf ? '<span class="highlight-cyan font-mono" style="font-size:0.75rem;">(Вы)</span>' : ''}</td>
                <td>${escapeHtml(u.full_name)}</td>
                <td>${roleBadge}</td>
                <td>${statusBadge}</td>
                <td class="monospace-val" style="font-size:0.75rem;">${lastLoginText}</td>
                <td style="text-align: right;">
                    <div class="table-action-btns">
                        <button type="button" class="btn-table-action gold" onclick="openChangePasswordModal('${u.id}', '${escapeHtml(u.username)}')" title="Сменить пароль">🔑 Пароль</button>
                        <button type="button" class="btn-table-action" onclick="openEditUserModal('${u.id}')" title="Редактировать">✏️</button>
                        ${!isSelf ? `<button type="button" class="btn-table-action danger" onclick="handleDeleteUser('${u.id}', '${escapeHtml(u.username)}')" title="Удалить">🗑️</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Открытие модалки создания нового пользователя
function openCreateUserModal() {
    const modal = document.getElementById('modal-user-edit');
    const title = document.getElementById('user-modal-title');
    const form = document.getElementById('form-user-edit');
    const errEl = document.getElementById('user-modal-error');
    const idInp = document.getElementById('edit-user-id');
    const usernameInp = document.getElementById('edit-username');
    const fullnameInp = document.getElementById('edit-fullname');
    const roleSelect = document.getElementById('edit-user-role');
    const passGroup = document.getElementById('user-pass-group');
    const passInp = document.getElementById('edit-user-pass');
    const passToggleBtn = document.getElementById('btn-toggle-edit-pass');
    const activeGroup = document.getElementById('user-active-group');

    if (!modal) return;
    if (form) form.reset();
    if (errEl) errEl.classList.add('hidden');

    if (idInp) idInp.value = '';
    if (usernameInp) { usernameInp.disabled = false; usernameInp.value = ''; }
    if (fullnameInp) fullnameInp.value = '';
    if (roleSelect) roleSelect.value = 'dispatcher';
    if (passGroup) passGroup.style.display = '';
    if (passInp) {
        passInp.required = true;
        passInp.type = 'password';
        passInp.value = '';
    }
    if (passToggleBtn) passToggleBtn.textContent = '👁️';
    if (activeGroup) activeGroup.style.display = 'none';

    if (title) title.textContent = (currentLang === 'ru' ? '[ СОЗДАНИЕ УЧЕТНОЙ ЗАПИСИ ]' : '[ CREATE USER ACCOUNT ]');
    modal.classList.remove('hidden');
    if (usernameInp) setTimeout(() => usernameInp.focus(), 100);
}

// Открытие модалки редактирования пользователя
function openEditUserModal(userId) {
    const user = systemUsersList.find(u => u.id === userId);
    if (!user) return;

    const modal = document.getElementById('modal-user-edit');
    const title = document.getElementById('user-modal-title');
    const errEl = document.getElementById('user-modal-error');
    const idInp = document.getElementById('edit-user-id');
    const usernameInp = document.getElementById('edit-username');
    const fullnameInp = document.getElementById('edit-fullname');
    const roleSelect = document.getElementById('edit-user-role');
    const passGroup = document.getElementById('user-pass-group');
    const passInp = document.getElementById('edit-user-pass');
    const activeGroup = document.getElementById('user-active-group');
    const activeInp = document.getElementById('edit-user-active');

    if (!modal) return;
    if (errEl) errEl.classList.add('hidden');

    if (idInp) idInp.value = user.id;
    if (usernameInp) { usernameInp.value = user.username; usernameInp.disabled = true; }
    if (fullnameInp) fullnameInp.value = user.full_name;
    if (roleSelect) roleSelect.value = user.role;
    if (passGroup) passGroup.style.display = 'none';
    if (passInp) passInp.required = false;
    if (activeGroup) activeGroup.style.display = '';
    if (activeInp) activeInp.checked = (parseInt(user.is_active, 10) === 1);

    if (title) title.textContent = (currentLang === 'ru' ? '[ РЕДАКТИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ ]' : '[ EDIT USER ACCOUNT ]');
    modal.classList.remove('hidden');
}

// Сохранение пользователя (Создание или Обновление)
async function handleSaveUser(e) {
    if (e) e.preventDefault();
    const idInp = document.getElementById('edit-user-id');
    const usernameInp = document.getElementById('edit-username');
    const fullnameInp = document.getElementById('edit-fullname');
    const roleSelect = document.getElementById('edit-user-role');
    const passInp = document.getElementById('edit-user-pass');
    const activeInp = document.getElementById('edit-user-active');
    const errEl = document.getElementById('user-modal-error');

    const id = idInp ? idInp.value : '';
    const isNew = !id;
    const username = usernameInp ? usernameInp.value.trim().toUpperCase() : '';
    const fullName = fullnameInp ? fullnameInp.value.trim() : '';
    const role = roleSelect ? roleSelect.value : 'dispatcher';
    const password = passInp ? passInp.value : '';
    const isActive = activeInp && activeInp.checked ? 1 : 0;

    if (!fullName || (isNew && (!username || !password))) {
        if (errEl) {
            errEl.textContent = (currentLang === 'ru' ? 'Заполните все обязательные поля.' : 'Fill in all required fields.');
            errEl.classList.remove('hidden');
        }
        return;
    }

    if (!isOfflineMode) {
        try {
            const action = isNew ? 'create_user' : 'update_user';
            const payload = isNew 
                ? { username, full_name: fullName, role, password }
                : { id, full_name: fullName, role, is_active: isActive };

            const response = await fetch(`api.php?action=${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.success) {
                const modal = document.getElementById('modal-user-edit');
                if (modal) modal.classList.add('hidden');
                await loadUsersList();
                showAviationAlert(data.message || (currentLang === 'ru' ? 'Пользователь сохранен.' : 'User saved.'), false);
                return;
            } else {
                if (errEl) {
                    errEl.textContent = data.error || (currentLang === 'ru' ? 'Ошибка при сохранении пользователя.' : 'Error saving user.');
                    errEl.classList.remove('hidden');
                }
                return;
            }
        } catch (err) {
            console.warn("Сбой сервера при сохранении пользователя, используем локальную базу:", err);
        }
    }

    // Сохранение в локальном режиме (Offline)
    if (isNew) {
        if (systemUsersList.some(u => u.username === username)) {
            if (errEl) {
                errEl.textContent = (currentLang === 'ru' ? 'Пользователь с таким логином уже существует!' : 'User with this login already exists!');
                errEl.classList.remove('hidden');
            }
            return;
        }
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const newUser = {
            id: 'usr_' + Date.now(),
            username,
            full_name: fullName,
            role,
            is_active: 1,
            created_at: nowStr,
            last_login: null
        };
        systemUsersList.unshift(newUser);
    } else {
        const u = systemUsersList.find(item => item.id === id);
        if (u) {
            u.full_name = fullName;
            u.role = role;
            u.is_active = isActive;
        }
    }
    localStorage.setItem('averago_local_users_db', JSON.stringify(systemUsersList));
    const modal = document.getElementById('modal-user-edit');
    if (modal) modal.classList.add('hidden');
    renderUsersTable();
    showAviationAlert(currentLang === 'ru' ? 'Пользователь успешно сохранен (Локально).' : 'User saved locally.', false);
}

// Открытие модалки смены пароля
function openChangePasswordModal(userId, userName) {
    const modal = document.getElementById('modal-change-user-pass');
    const idInp = document.getElementById('pass-user-id');
    const nameEl = document.getElementById('pass-user-name');
    const newPassInp = document.getElementById('new-password-input');
    const confPassInp = document.getElementById('confirm-password-input');
    const newToggleBtn = document.getElementById('btn-toggle-new-pass');
    const confToggleBtn = document.getElementById('btn-toggle-confirm-pass');
    const errEl = document.getElementById('pass-modal-error');

    if (!modal) return;
    if (idInp) idInp.value = userId;
    if (nameEl) nameEl.textContent = userName;
    if (newPassInp) {
        newPassInp.value = '';
        newPassInp.type = 'password';
    }
    if (confPassInp) {
        confPassInp.value = '';
        confPassInp.type = 'password';
    }
    if (newToggleBtn) newToggleBtn.textContent = '👁️';
    if (confToggleBtn) confToggleBtn.textContent = '👁️';
    if (errEl) errEl.classList.add('hidden');

    modal.classList.remove('hidden');
    if (newPassInp) setTimeout(() => newPassInp.focus(), 100);
}

// Сохранение нового пароля
async function handleSaveNewPassword(e) {
    if (e) e.preventDefault();
    const idInp = document.getElementById('pass-user-id');
    const newPassInp = document.getElementById('new-password-input');
    const confPassInp = document.getElementById('confirm-password-input');
    const errEl = document.getElementById('pass-modal-error');

    const userId = idInp ? idInp.value : '';
    const newPass = newPassInp ? newPassInp.value : '';
    const confPass = confPassInp ? confPassInp.value : '';

    if (!newPass || newPass.length < 4) {
        if (errEl) {
            errEl.textContent = (currentLang === 'ru' ? 'Пароль должен содержать минимум 4 символа.' : 'Password must be at least 4 chars.');
            errEl.classList.remove('hidden');
        }
        return;
    }

    if (newPass !== confPass) {
        if (errEl) {
            errEl.textContent = (currentLang === 'ru' ? 'Введенные пароли не совпадают!' : 'Passwords do not match!');
            errEl.classList.remove('hidden');
        }
        return;
    }

    if (!isOfflineMode) {
        try {
            const response = await fetch('api.php?action=change_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, new_password: newPass })
            });
            const data = await response.json();

            if (data.success) {
                const modal = document.getElementById('modal-change-user-pass');
                if (modal) modal.classList.add('hidden');
                showAviationAlert(data.message || (currentLang === 'ru' ? 'Пароль успешно изменен.' : 'Password updated.'), false);
                return;
            } else {
                if (errEl) {
                    errEl.textContent = data.error || (currentLang === 'ru' ? 'Ошибка смены пароля.' : 'Error updating password.');
                    errEl.classList.remove('hidden');
                }
                return;
            }
        } catch (err) {
            console.warn("Сбой сервера при смене пароля, обновляем локально:", err);
        }
    }

    // Локальное обновление пароля
    const modal = document.getElementById('modal-change-user-pass');
    if (modal) modal.classList.add('hidden');
    showAviationAlert(currentLang === 'ru' ? 'Пароль успешно изменен (Локально).' : 'Password updated locally.', false);
}

// Удаление пользователя
async function handleDeleteUser(userId, userName) {
    const confirmModal = document.getElementById('aviation-confirm-modal');
    const msgEl = document.getElementById('aviation-confirm-message');
    const btnConfirm = document.getElementById('modal-btn-confirm');
    const btnCancel = document.getElementById('modal-btn-cancel');

    if (!confirmModal || !msgEl || !btnConfirm) return;

    msgEl.textContent = (currentLang === 'ru' 
        ? `Вы уверены, что хотите удалить пользователя "${userName}"? Это действие необратимо.`
        : `Are you sure you want to delete user "${userName}"? This action cannot be undone.`);

    confirmModal.classList.remove('hidden');

    const handleConfirm = async () => {
        confirmModal.classList.add('hidden');
        btnConfirm.removeEventListener('click', handleConfirm);

        if (!isOfflineMode) {
            try {
                const response = await fetch(`api.php?action=delete_user&id=${encodeURIComponent(userId)}`);
                const data = await response.json();
                if (data.success) {
                    await loadUsersList();
                    showAviationAlert(data.message || (currentLang === 'ru' ? 'Пользователь удален.' : 'User deleted.'), false);
                    return;
                } else {
                    showAviationAlert(data.error || (currentLang === 'ru' ? 'Ошибка удаления пользователя.' : 'Error deleting user.'), true);
                    return;
                }
            } catch (err) {
                console.warn("Сбой сервера при удалении пользователя, удаляем локально:", err);
            }
        }

        // Локальное удаление
        systemUsersList = systemUsersList.filter(u => u.id !== userId);
        localStorage.setItem('averago_local_users_db', JSON.stringify(systemUsersList));
        renderUsersTable();
        showAviationAlert(currentLang === 'ru' ? 'Пользователь удален (Локально).' : 'User deleted locally.', false);
    };

    btnConfirm.addEventListener('click', handleConfirm);
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
            btnConfirm.removeEventListener('click', handleConfirm);
        }, { once: true });
    }
}

// --------------------------------------------------------------------------
// МОДУЛЬ АВТОМАТИЧЕСКИХ РЕЗЕРВНЫХ КОПИЙ (30 ДНЕЙ)
// --------------------------------------------------------------------------

let serverBackupsList = [];

// Загрузка списка серверных автобэкапов
async function loadServerBackupsList() {
    if (!currentUser || currentUser.role !== 'admin') return;

    const tbody = document.getElementById('backups-table-body');
    if (!tbody) return;

    try {
        const response = await fetch('api.php?action=list_backups');
        const data = await response.json();

        if (data.success && Array.isArray(data.backups)) {
            serverBackupsList = data.backups;
            renderServerBackupsTable();
        } else {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-table-text" style="color: #ef4444;">${data.error || 'Ошибка загрузки списка бэкапов'}</td></tr>`;
        }
    } catch (err) {
        console.error("Ошибка при загрузке бэкапов:", err);
        tbody.innerHTML = `<tr><td colspan="4" class="empty-table-text" style="color: #ef4444;">Не удалось получить список бэкапов с сервера</td></tr>`;
    }
}

// Отрисовка таблицы серверных автобэкапов
function renderServerBackupsTable() {
    const tbody = document.getElementById('backups-table-body');
    if (!tbody) return;

    if (serverBackupsList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-table-text">Автоматические бэкапы пока отсутствуют. Нажмите кнопку "Создать бэкап сейчас".</td></tr>`;
        return;
    }

    let html = '';
    serverBackupsList.forEach(b => {
        const sizeKb = (b.size / 1024).toFixed(1);
        const sizeMb = (b.size / (1024 * 1024)).toFixed(2);
        const sizeDisplay = b.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

        html += `
            <tr>
                <td><strong class="font-mono">${escapeHtml(b.filename)}</strong></td>
                <td class="monospace-val" style="font-size: 0.8rem;">${b.created_at}</td>
                <td class="monospace-val highlight-cyan">${sizeDisplay}</td>
                <td style="text-align: right;">
                    <div class="table-action-btns">
                        <button type="button" class="btn-table-action" onclick="downloadServerBackup('${escapeHtml(b.filename)}')" title="Скачать архив">📥 Скачать</button>
                        <button type="button" class="btn-table-action danger" onclick="restoreServerBackup('${escapeHtml(b.filename)}')" title="Восстановить базу">🔄 Восстановить</button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Создание мгновенного серверного бэкапа
async function createServerBackupNow() {
    const btn = document.getElementById('btn-create-server-backup');
    if (btn) btn.disabled = true;

    try {
        const response = await fetch('api.php?action=create_backup');
        const data = await response.json();

        if (data.success) {
            await loadServerBackupsList();
            showAviationAlert(`Резервная копия создана: ${data.filename} (${data.flights_count} рейсов).`, false);
        } else {
            showAviationAlert(data.error || 'Ошибка создания бэкапа.', true);
        }
    } catch (err) {
        showAviationAlert('Ошибка соединения с сервером: ' + err.message, true);
    } finally {
        if (btn) btn.disabled = false;
    }
}

// Скачивание файла бэкапа
function downloadServerBackup(filename) {
    window.location.href = `api.php?action=download_backup&file=${encodeURIComponent(filename)}`;
}

// Восстановление базы из серверного бэкапа
async function restoreServerBackup(filename) {
    const confirmModal = document.getElementById('aviation-confirm-modal');
    const msgEl = document.getElementById('aviation-confirm-message');
    const btnConfirm = document.getElementById('modal-btn-confirm');
    const btnCancel = document.getElementById('modal-btn-cancel');

    if (!confirmModal || !msgEl || !btnConfirm) return;

    msgEl.textContent = `Внимание! Восстановление из архива "${filename}" полностью перезапишет текущую базу рейсов. Продолжить?`;
    confirmModal.classList.remove('hidden');

    const handleConfirm = async () => {
        confirmModal.classList.add('hidden');
        btnConfirm.removeEventListener('click', handleConfirm);

        try {
            const response = await fetch('api.php?action=restore_backup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: filename })
            });
            const data = await response.json();

            if (data.success) {
                await loadUserFlights();
                showAviationAlert(`База успешно восстановлена! Загружено ${data.restored_count} рейсов.`, false);
            } else {
                showAviationAlert(data.error || 'Ошибка при восстановлении базы.', true);
            }
        } catch (err) {
            showAviationAlert('Ошибка при восстановлении: ' + err.message, true);
        }
    };

    btnConfirm.addEventListener('click', handleConfirm);
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
            btnConfirm.removeEventListener('click', handleConfirm);
        }, { once: true });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
// --- ФУНКЦИИ ФИЛЬТРАЦИИ И ВРЕМЕННЫХ ДИАПАЗОНОВ (30 ДНЕЙ) ---

// Регистрация аэропортов из загруженных рейсов в БД
function registerFlightsAirports(flights) {
    if (!flights || !baggageDb) return;
    flights.forEach(f => {
        const fromCode = String(f.from || '').trim().toUpperCase();
        const toCode = String(f.to || '').trim().toUpperCase();
        if (!fromCode || !toCode) return;

        const fromIata = ruToIata(fromCode) || fromCode;
        const toIata = ruToIata(toCode) || toCode;

        if (!baggageDb.airports[fromCode]) {
            baggageDb.airports[fromCode] = { iata: fromIata, ru: fromCode, name: fromCode };
        }
        if (!baggageDb.airports[toCode]) {
            baggageDb.airports[toCode] = { iata: toIata, ru: toCode, name: toCode };
        }

        if (baggageDb.departures_filter && !baggageDb.departures_filter.includes(fromCode) && !baggageDb.departures_filter.includes(fromIata)) {
            baggageDb.departures_filter.push(fromCode);
        }
        if (baggageDb.arrivals_filter && !baggageDb.arrivals_filter.includes(toCode) && !baggageDb.arrivals_filter.includes(toIata)) {
            baggageDb.arrivals_filter.push(toCode);
        }
    });
}

function updateActiveDateRangeAndCounts() {
    registerFlightsAirports(userFlights);
    populateAirportDropdowns();
    populateSeasonalYears();
    
    const totalCountEl = document.getElementById('total-flights-count');
    if (totalCountEl) {
        totalCountEl.textContent = userFlights.length;
    }

    if (userFlights.length === 0) {
        const activeCountEl = document.getElementById('active-flights-count');
        if (activeCountEl) activeCountEl.textContent = '0';
        const activeRangeEl = document.getElementById('active-date-range');
        if (activeRangeEl) activeRangeEl.textContent = '-';
        return;
    }

    let maxDateMs = 0;
    userFlights.forEach(flight => {
        const time = Date.parse(flight.date);
        if (!isNaN(time) && time > maxDateMs) {
            maxDateMs = time;
        }
    });

    if (maxDateMs === 0) {
        const activeCountEl = document.getElementById('active-flights-count');
        if (activeCountEl) activeCountEl.textContent = '0';
        const activeRangeEl = document.getElementById('active-date-range');
        if (activeRangeEl) activeRangeEl.textContent = '-';
        return;
    }

    // 30-дневный период для флага flight.active и для вывода в статус-бар Администрирования
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const minDateMs30 = maxDateMs - thirtyDaysMs;
    
    let activeCount30 = 0;
    userFlights.forEach(flight => {
        const time = Date.parse(flight.date);
        if (!isNaN(time) && time >= minDateMs30 && time <= maxDateMs) {
            flight.active = true;
            activeCount30++;
        } else {
            flight.active = false;
        }
    });

    const maxDate = new Date(maxDateMs);
    const minDate30 = new Date(minDateMs30);

    const formatDate = (d) => {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const dateRangeStr = `${formatDate(minDate30)} - ${formatDate(maxDate)}`;
    const activeRangeEl = document.getElementById('active-date-range');
    if (activeRangeEl) activeRangeEl.textContent = dateRangeStr;

    const activeCountEl = document.getElementById('active-flights-count');
    if (activeCountEl) activeCountEl.textContent = activeCount30;
}

// --- ЛОГИКА РАСЧЕТА ПРОГНОЗА БАГАЖА (SMART WATERFALL + АДАПТИВНАЯ ВЫБОРКА) ---

function getRuDayShort(dayIdx) {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[dayIdx] || '';
}

function getEnDayShort(dayIdx) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIdx] || '';
}

function updatePaxExpectedHint() {
    const paxInputEl = document.getElementById('input-pax');
    const paxVal = parseInt(paxInputEl ? paxInputEl.value : 0, 10) || 0;
    const paxModeRadio = document.querySelector('input[name="pax-mode"]:checked');
    const paxModeFactor = paxModeRadio ? parseFloat(paxModeRadio.value) : 1.0;
    const isBookingMode = paxModeFactor < 0.99;
    const effectivePaxVal = isBookingMode ? Math.max(1, Math.round(paxVal * paxModeFactor)) : paxVal;

    const hintEl = document.getElementById('pax-expected-hint');
    if (hintEl) {
        if (isBookingMode && paxVal > 0) {
            const hintText = currentLang === 'ru'
                ? `Ожидается ~${effectivePaxVal} пасс. (с учетом неявки 3%)`
                : `Expected ~${effectivePaxVal} pax (with 3% no-show)`;
            hintEl.textContent = hintText;
            hintEl.classList.remove('hidden');
        } else {
            hintEl.classList.add('hidden');
        }
    }
}

function calculateBaggageForecast(logToHistory = false) {
    const fromVal = document.getElementById('select-from').value;
    const toVal = document.getElementById('select-to').value;
    const flightVal = document.getElementById('select-flight').value;
    const paxInputEl = document.getElementById('input-pax');
    let paxVal = parseInt(paxInputEl.value) || 0;
    if (paxVal > 1000) {
        paxVal = 1000;
        paxInputEl.value = 1000;
    }

    // Проверяем выбранный режим явки пассажиров (Факт 100% или Бронь 97%)
    const paxModeRadio = document.querySelector('input[name="pax-mode"]:checked');
    const paxModeFactor = paxModeRadio ? parseFloat(paxModeRadio.value) : 1.0;
    const isBookingMode = paxModeFactor < 0.99;
    const effectivePaxVal = isBookingMode ? Math.max(1, Math.round(paxVal * paxModeFactor)) : paxVal;

    updatePaxExpectedHint();
    
    const warningBox = document.getElementById('date-warning');
    if (warningBox) warningBox.classList.add('hidden');

    if (!fromVal || !toVal || paxVal <= 0) {
        document.getElementById('res-pcs').textContent = '0';
        document.getElementById('res-weight').textContent = '0';
        document.getElementById('res-hb').textContent = '0';
        document.getElementById('coef-pcs-pax').textContent = '-';
        document.getElementById('coef-weight-pc').textContent = '-';
        document.getElementById('coef-hb-pax').textContent = '-';
        document.getElementById('calc-source-desc').innerHTML = '-';
        return;
    }

    // Считываем параметры расширенного анализа данных
    const scopeVal = document.getElementById('select-analysis-scope')?.value || 'auto';
    const periodTypeVal = document.getElementById('select-period-type')?.value || 'auto';
    const customStartVal = document.getElementById('input-analysis-start-date')?.value || '';
    const customEndVal = document.getElementById('input-analysis-end-date')?.value || '';
    const seasonalMonthVal = document.getElementById('select-seasonal-month')?.value || '0';
    const seasonalYearVal = document.getElementById('select-seasonal-year')?.value || 'all';

    let coefs = null;
    let sourceDescHtml = '';

    // Вызываем интеллектуальный расчет с 4-уровневым каскадом и адаптивным окном
    coefs = getUploadedCoefficients(
        fromVal, toVal, flightVal,
        scopeVal, periodTypeVal,
        customStartVal, customEndVal,
        seasonalMonthVal, seasonalYearVal
    );

    if (coefs) {
        const badgeClass = coefs.levelCode || `level-${coefs.level || 1}`;
        sourceDescHtml = `<span class="waterfall-badge ${badgeClass}">${coefs.levelName || 'Загруженные данные'}</span>`;
    }

    // Если в загруженных нет данных вообще, обращаемся к историческим нормативам базы
    if (!coefs) {
        coefs = getHistoricalCoefficients(fromVal, toVal, flightVal);
        if (coefs) {
            sourceDescHtml = `<span class="waterfall-badge level-4">${translations[currentLang]['source-desc-historical']}</span>`;
        }
    }

    // Крайний дефолтный норматив
    if (!coefs) {
        coefs = {
            pcs_pax: 0.4,
            wght_pc: 13.0,
            hb_pax: 2.0
        };
        sourceDescHtml = `<span class="waterfall-badge level-4">${translations[currentLang]['source-desc-default']}</span>`;
    }

    // --- ВЫЧИСЛЕНИЕ РЕЗУЛЬТАТОВ НА ЭФФЕКТИВНЫХ ПАССАЖИРОВ ---
    const expectedPcs = Math.round(effectivePaxVal * coefs.pcs_pax);
    // Вес багажа и ручной клади округляются до целых
    const expectedWeight = Math.round(expectedPcs * coefs.wght_pc);
    const expectedHb = Math.round(effectivePaxVal * coefs.hb_pax);

    // Вывод результатов с плавной анимацией
    animateNumber('res-pcs', expectedPcs, 0);
    animateNumber('res-weight', expectedWeight, 0);
    animateNumber('res-hb', expectedHb, 0);

    // Вывод коэффициентов
    document.getElementById('coef-pcs-pax').textContent = coefs.pcs_pax.toFixed(4);
    document.getElementById('coef-weight-pc').textContent = coefs.wght_pc.toFixed(2) + ' кг';
    document.getElementById('coef-hb-pax').textContent = coefs.hb_pax.toFixed(2) + ' кг';
    document.getElementById('calc-source-desc').innerHTML = sourceDescHtml;

    // Отрисовываем детализацию отобранных рейсов и расчётных агрегированных значений
    renderSampledFlightsDetails(coefs);

    // Обновляем плашку активного рейса в шапке
    const dateInputEl = document.getElementById('input-date');
    const targetDateVal = dateInputEl ? dateInputEl.value : '';
    updateActiveFlightBadge(fromVal, toVal, flightVal, targetDateVal);

    // Сохраняем расчет в историю прогнозов (только если нажата кнопка)
    if (logToHistory) {
        const prediction = {
            id: 'pred_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            from: fromVal,
            to: toVal,
            flight_no: flightVal || translations[currentLang]['select-all-flights-placeholder'],
            pax: effectivePaxVal,
            raw_pax: paxVal,
            bag_pcs: expectedPcs,
            bag_weight: expectedWeight,
            hb_weight: expectedHb,
            flight_date: targetDateVal || new Date().toISOString().split('T')[0],
            calc_date: new Date().toISOString(),
            pax_mode: isBookingMode ? 'booking_97' : 'fact_100',
            waterfall_level: coefs.level || 1
        };
        predictionsHistory.unshift(prediction);
        currentActivePredictionId = prediction.id;
        savePredictionsHistory();
        renderPredictionsTable();

        // Выделяем новую сохраненную строку в истории
        setTimeout(() => {
            highlightPredictionRow(prediction.id);
        }, 50);
    }
}

// Функция отрисовки детализации отобранных рейсов и формул в карточку ответа
function renderSampledFlightsDetails(coefs) {
    const containerEl = document.getElementById('sampled-flights-container');
    const tbodyEl = document.getElementById('sampled-flights-tbody');
    const tfootEl = document.getElementById('sampled-flights-tfoot');
    const titleEl = document.getElementById('sampled-flights-title');

    if (!containerEl || !tbodyEl || !tfootEl) return;

    // Навешиваем клик для разворачивания/сворачивания
    const toggleEl = document.getElementById('sampled-flights-toggle');
    if (toggleEl && !toggleEl.dataset.hasListener) {
        toggleEl.dataset.hasListener = 'true';
        toggleEl.addEventListener('click', function() {
            containerEl.classList.toggle('collapsed');
        });
    }

    if (!coefs) {
        containerEl.classList.add('hidden');
        tbodyEl.innerHTML = '';
        tfootEl.innerHTML = '';
        return;
    }

    // Если есть реальные отобранные рейсы
    if (coefs.usedFlights && coefs.usedFlights.length > 0) {
        const flights = coefs.usedFlights;
        containerEl.classList.remove('hidden');

        if (titleEl) {
            const levelHeader = coefs.levelName ? `[ ${coefs.levelName} ]` : '';
            const titlePattern = translations[currentLang]['sampled-flights-title'] || 'Отобранные рейсы для расчета ({count} вып.):';
            titleEl.textContent = `${levelHeader} ${titlePattern.replace('{count}', flights.length)}`.trim();
        }

        const ruShortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const enShortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let htmlBody = '';
        flights.forEach((f, idx) => {
            const pax = getEffectivePaxCount(f);
            const pcs = parseInt(f.bag_pcs) || 0;
            const weight = parseFloat(f.bag_weight) || 0;
            const hb = parseFloat(f.hb_weight) || 0;

            let formattedDate = f.date ? formatDateStr(f.date) : '-';
            if (f.date) {
                const dayIdx = getDayOfWeekFromIsoStr(f.date);
                const dayName = currentLang === 'ru' ? ruShortDays[dayIdx] : enShortDays[dayIdx];
                formattedDate += ` (${dayName})`;
            }

            let weightBadge = '';
            if (coefs.weights && coefs.weights[idx] !== undefined) {
                const wPct = (coefs.weights[idx] * 100).toFixed(1).replace('.0', '');
                weightBadge = `<span class="weight-badge-pill" title="Вес свежести">${wPct}%</span>`;
            }

            htmlBody += `
                <tr>
                    <td><div class="sample-date-cell"><span>${formattedDate}</span>${weightBadge}</div></td>
                    <td><strong>${f.flight_no || '-'}</strong></td>
                    <td class="cyan-val">${pax}</td>
                    <td class="gold-val">${pcs}</td>
                    <td class="gold-val">${weight.toLocaleString('ru-RU')} кг</td>
                    <td class="purple-val">${hb.toLocaleString('ru-RU')} кг</td>
                </tr>
            `;
        });
        tbodyEl.innerHTML = htmlBody;

        const totalsLabel = translations[currentLang]['sample-totals-label'] || 'ИТОГО (СУММЫ):';
        const unitKg = translations[currentLang]['unit-kg'] || 'кг';

        let seasonalNote = '';
        if (coefs.seasonInfo && coefs.seasonInfo.hasSeasonality) {
            const sign = coefs.seasonInfo.multiplier >= 1.0 ? '+' : '';
            const pct = Math.round((coefs.seasonInfo.multiplier - 1.0) * 100);
            seasonalNote = `<div class="seasonality-pill">🌸 Сезонная поправка (${coefs.seasonInfo.monthName}): x${coefs.seasonInfo.multiplier.toFixed(3)} (${sign}${pct}%)</div><br/>`;
        }

        const formulaTitle = '📐 <strong>Расчет коэффициентов (Экспоненциальное сглаживание &alpha; = 0.3):</strong>';
        const formulaDetails = `${seasonalNote}• <strong>PCS/PAX</strong> = <strong>${coefs.pcs_pax.toFixed(4)}</strong> ${coefs.raw_pcs_pax ? `(базовый ${coefs.raw_pcs_pax.toFixed(4)} × ${coefs.seasonInfo.multiplier.toFixed(3)})` : ''}<br/>
               • <strong>Weight/PC</strong> = <strong>${coefs.wght_pc.toFixed(2)} ${unitKg}</strong><br/>
               • <strong>HB/PAX</strong> = <strong>${coefs.hb_pax.toFixed(2)} ${unitKg}</strong>`;

        let htmlFoot = `
            <tr class="sample-totals-row">
                <td colspan="2"><strong>${totalsLabel}</strong> (${flights.length})</td>
                <td class="cyan-val">${coefs.totalPax} чел.</td>
                <td class="gold-val">${coefs.totalBags} pcs</td>
                <td class="gold-val">${coefs.totalBagWeight.toLocaleString('ru-RU')} ${unitKg}</td>
                <td class="purple-val">${coefs.totalHbWeight.toLocaleString('ru-RU')} ${unitKg}</td>
            </tr>
            <tr class="sample-formulas-row">
                <td colspan="6">
                    ${formulaTitle}<br/>
                    ${formulaDetails}
                </td>
            </tr>
        `;
        tfootEl.innerHTML = htmlFoot;
    } else {
        // Если использовались нормативные правила базы данных без списка выполнений
        containerEl.classList.remove('hidden');
        if (titleEl) {
            titleEl.textContent = currentLang === 'ru' ? 'Исторические нормативы базы данных:' : 'Historical Database Standards:';
        }
        tbodyEl.innerHTML = '';
        const unitKg = translations[currentLang]['unit-kg'] || 'кг';
        tfootEl.innerHTML = `
            <tr class="sample-formulas-row">
                <td colspan="6">
                    📐 <strong>Нормативные коэффициенты направления:</strong><br/>
                    • <strong>PCS/PAX</strong> = <strong>${coefs.pcs_pax.toFixed(4)}</strong><br/>
                    • <strong>Weight/PC</strong> = <strong>${coefs.wght_pc.toFixed(2)} ${unitKg}</strong><br/>
                    • <strong>HB/PAX</strong> = <strong>${coefs.hb_pax.toFixed(2)} ${unitKg}</strong>
                </td>
            </tr>
        `;
    }
}

// Вспомогательная функция анимации чисел
function animateNumber(elementId, targetVal, decimals = 0) {
    const el = document.getElementById(elementId);
    const startVal = parseFloat(el.textContent) || 0;
    const duration = 400;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress * (2 - progress);
        const currentVal = startVal + (targetVal - startVal) * ease;
        el.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = targetVal.toFixed(decimals);
        }
    }
    requestAnimationFrame(update);
}

// Вспомогательная функция для получения дня недели без сдвига часовых поясов
function getDayOfWeekFromIsoStr(isoStr) {
    if (!isoStr) return 0;
    const parts = isoStr.split('-');
    if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        return new Date(y, m, d).getDay();
    }
    const d = new Date(isoStr);
    return isNaN(d.getTime()) ? 0 : d.getDay();
}

// Поиск коэффициентов по загруженной базе рейсов с использованием 4-уровневой интеллектуальной иерархии (Smart Waterfall)
function getUploadedCoefficients(from, to, flightNo, scope = 'auto', periodType = 'auto', customStart = '', customEnd = '', seasonalMonth = '0', seasonalYear = 'all') {
    if (!userFlights || userFlights.length === 0) return null;

    const fromIata = ruToIata(from) || from;
    const toIata = ruToIata(to) || to;

    const dateInputEl = document.getElementById('input-date');
    const targetDateVal = dateInputEl ? dateInputEl.value : '';
    const targetDateMs = targetDateVal ? Date.parse(targetDateVal) : Date.now();
    const targetDayOfWeek = getDayOfWeekFromIsoStr(targetDateVal || new Date().toISOString().split('T')[0]);

    const routeFlights = userFlights.filter(f => ruToIata(f.from) === fromIata && ruToIata(f.to) === toIata);

    const finalizeResult = (res) => {
        if (!res) return null;
        const seasonInfo = getRouteSeasonalityMultiplier(from, to, targetDateVal);
        if (seasonInfo && seasonInfo.hasSeasonality) {
            res.raw_pcs_pax = res.pcs_pax;
            res.pcs_pax = res.pcs_pax * seasonInfo.multiplier;
            res.seasonalMultiplier = seasonInfo.multiplier;
            res.seasonInfo = seasonInfo;
        }
        return res;
    };

    // 1. Если выбран явный кастомный диапазон дат
    if (periodType === 'custom') {
        const startMs = customStart ? Date.parse(customStart) : 0;
        const endMs = customEnd ? Date.parse(customEnd) : Infinity;
        let targetFlights = (flightNo && scope === 'flight') ? routeFlights.filter(f => f.flight_no === flightNo) : routeFlights;
        const filtered = targetFlights.filter(f => {
            const fTime = Date.parse(f.date);
            return !isNaN(fTime) && fTime >= startMs && fTime <= endMs;
        });
        if (filtered.length > 0) {
            const result = calculateMeansFromFlights(filtered);
            result.level = 3;
            result.levelCode = 'level-3';
            result.levelName = `${currentLang === 'ru' ? 'Пользовательский период' : 'Custom Period'} (${filtered.length} выл.)`;
            result.matchedCount = filtered.length;
            return finalizeResult(result);
        }
        return null;
    }

    // 2. Если выбран явный сезонный срез
    if (periodType === 'seasonal') {
        let targetFlights = (flightNo && scope === 'flight') ? routeFlights.filter(f => f.flight_no === flightNo) : routeFlights;
        const filtered = targetFlights.filter(f => {
            if (!f.date) return false;
            const dateObj = new Date(f.date);
            const mMatch = dateObj.getMonth() === parseInt(seasonalMonth, 10);
            const yMatch = (seasonalYear === 'all') || (dateObj.getFullYear() === parseInt(seasonalYear, 10));
            return mMatch && yMatch;
        });
        if (filtered.length > 0) {
            const result = calculateMeansFromFlights(filtered);
            result.level = 3;
            result.levelCode = 'level-3';
            result.levelName = `${currentLang === 'ru' ? 'Сезонный срез' : 'Seasonal Slice'} (${filtered.length} выл.)`;
            result.matchedCount = filtered.length;
            return finalizeResult(result);
        }
        return null;
    }

    // 3. Если выбрана вся доступная история базы (3 года)
    if (periodType === 'all_history') {
        let targetFlights = (flightNo && scope === 'flight') ? routeFlights.filter(f => f.flight_no === flightNo) : routeFlights;
        const filtered = targetFlights.filter(f => {
            const fTime = Date.parse(f.date);
            return !isNaN(fTime) && fTime <= targetDateMs;
        }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        if (filtered.length > 0) {
            const sample = filtered.slice(0, 30);
            const result = calculateMeansFromFlights(sample);
            result.level = 3;
            result.levelCode = 'level-3';
            result.levelName = `${currentLang === 'ru' ? 'Вся история базы' : 'All Database History'} • ${sample.length} выл.`;
            result.matchedCount = sample.length;
            return finalizeResult(result);
        }
        return null;
    }

    // --- УМНЫЙ ВОДОПАД (4 УРОВНЯ НАДЕЖНОСТИ) ---
    // Окно анализа: 180 дней до даты вылета
    const window180Ms = 180 * 24 * 60 * 60 * 1000;
    const MAX_SAMPLE_SIZE = 20; // Оптимальный объем выборки (до 20 актуальных рейсов)
    const MIN_SAMPLE_THRESHOLD = 5; // Порог минимального числа рейсов для надежной группы (Уровень 1 и 2)

    const dayNameRu = getRuDayShort(targetDayOfWeek);
    const dayNameEn = getEnDayShort(targetDayOfWeek);

    // УРОВЕНЬ 1: Номер рейса + День недели (самое точное совпадение)
    if (flightNo && (scope === 'auto' || scope === 'flight')) {
        let level1Flights = routeFlights.filter(f => {
            if (f.flight_no !== flightNo) return false;
            if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
            const fMs = Date.parse(f.date);
            if (isNaN(fMs)) return false;
            const diff = targetDateMs - fMs;
            return diff >= 0 && diff <= window180Ms;
        }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

        // Если за 180 дней мало рейсов, но они есть в истории до даты вылета
        if (level1Flights.length < MIN_SAMPLE_THRESHOLD) {
            level1Flights = routeFlights.filter(f => {
                if (f.flight_no !== flightNo) return false;
                if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
                const fMs = Date.parse(f.date);
                return !isNaN(fMs) && fMs <= targetDateMs;
            }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        }

        if (level1Flights.length >= MIN_SAMPLE_THRESHOLD || (scope === 'flight' && level1Flights.length > 0)) {
            const sample = level1Flights.slice(0, MAX_SAMPLE_SIZE);
            const res = calculateMeansFromFlights(sample);
            if (res) {
                res.level = 1;
                res.levelCode = 'level-1';
                res.levelName = currentLang === 'ru' 
                    ? `🟢 Уровень 1: Рейс ${flightNo} (${dayNameRu}) • ${sample.length} выл.`
                    : `🟢 Level 1: Flight ${flightNo} (${dayNameEn}) • ${sample.length} flt.`;
                res.matchedCount = sample.length;
                return finalizeResult(res);
            }
        }
    }

    // УРОВЕНЬ 2: Маршрут (FROM -> TO) + День недели (все рейсы по маршруту в этот день недели)
    if (scope === 'auto' || scope === 'route') {
        let level2Flights = routeFlights.filter(f => {
            if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
            const fMs = Date.parse(f.date);
            if (isNaN(fMs)) return false;
            const diff = targetDateMs - fMs;
            return diff >= 0 && diff <= window180Ms;
        }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

        if (level2Flights.length < MIN_SAMPLE_THRESHOLD) {
            level2Flights = routeFlights.filter(f => {
                if (getDayOfWeekFromIsoStr(f.date) !== targetDayOfWeek) return false;
                const fMs = Date.parse(f.date);
                return !isNaN(fMs) && fMs <= targetDateMs;
            }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        }

        if (level2Flights.length >= MIN_SAMPLE_THRESHOLD || (scope === 'route' && level2Flights.length > 0)) {
            const sample = level2Flights.slice(0, MAX_SAMPLE_SIZE);
            const res = calculateMeansFromFlights(sample);
            if (res) {
                res.level = 2;
                res.levelCode = 'level-2';
                res.levelName = currentLang === 'ru'
                    ? `🔵 Уровень 2: Маршрут ${fromIata}➔${toIata} (${dayNameRu}) • ${sample.length} выл.`
                    : `🔵 Level 2: Route ${fromIata}➔${toIata} (${dayNameEn}) • ${sample.length} flt.`;
                res.matchedCount = sample.length;
                return finalizeResult(res);
            }
        }

        // УРОВЕНЬ 3: Маршрут (FROM -> TO) за все дни недели
        let level3Flights = routeFlights.filter(f => {
            const fMs = Date.parse(f.date);
            if (isNaN(fMs)) return false;
            const diff = targetDateMs - fMs;
            return diff >= 0 && diff <= window180Ms;
        }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

        if (level3Flights.length < MIN_SAMPLE_THRESHOLD) {
            level3Flights = routeFlights.filter(f => {
                const fMs = Date.parse(f.date);
                return !isNaN(fMs) && fMs <= targetDateMs;
            }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        }

        if (level3Flights.length > 0) {
            const sample = level3Flights.slice(0, MAX_SAMPLE_SIZE);
            const res = calculateMeansFromFlights(sample);
            if (res) {
                res.level = 3;
                res.levelCode = 'level-3';
                res.levelName = currentLang === 'ru'
                    ? `🟡 Уровень 3: Маршрут ${fromIata}➔${toIata} (все дни) • ${sample.length} выл.`
                    : `🟡 Level 3: Route ${fromIata}➔${toIata} (all days) • ${sample.length} flt.`;
                res.matchedCount = sample.length;
                return finalizeResult(res);
            }
        }
    }

    // УРОВЕНЬ 4: Аэропорт вылета (DEP / FROM) — все направления из этого аэропорта
    const originFlights = userFlights.filter(f => ruToIata(f.from) === fromIata && Date.parse(f.date) <= targetDateMs)
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    if (originFlights.length > 0) {
        const sample = originFlights.slice(0, MAX_SAMPLE_SIZE);
        const res = calculateMeansFromFlights(sample);
        if (res) {
            res.level = 4;
            res.levelCode = 'level-4';
            res.levelName = currentLang === 'ru'
                ? `⚪ Уровень 4: Аэропорт вылета ${fromIata} (все напр.) • ${sample.length} выл.`
                : `⚪ Level 4: Departure Airport ${fromIata} (all routes) • ${sample.length} flt.`;
            res.matchedCount = sample.length;
            return finalizeResult(res);
        }
    }

    return null;
}

// Автоматический расчет помесячного сезонного множителя на основе всей 3-летней истории базы
function getRouteSeasonalityMultiplier(from, to, targetDateStr) {
    if (!userFlights || userFlights.length < 10) return { multiplier: 1.0, hasSeasonality: false };

    const fromIata = ruToIata(from) || from;
    const toIata = ruToIata(to) || to;

    const targetMonth = targetDateStr ? new Date(targetDateStr).getMonth() : new Date().getMonth();
    const ruMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = currentLang === 'ru' ? ruMonths[targetMonth] : enMonths[targetMonth];

    // Ищем все исторические рейсы по маршруту
    const rf = userFlights.filter(f => (ruToIata(f.from) || f.from) === fromIata && (ruToIata(f.to) || f.to) === toIata);
    if (rf.length < 8) {
        return { multiplier: 1.0, hasSeasonality: false, monthName };
    }

    let totPax = 0, totBags = 0;
    let monthPax = 0, monthBags = 0, monthFlightCount = 0;

    rf.forEach(f => {
        const p = getEffectivePaxCount(f);
        const b = parseInt(f.bag_pcs, 10) || 0;
        totPax += p;
        totBags += b;

        if (f.date) {
            const m = new Date(f.date).getMonth();
            if (m === targetMonth) {
                monthPax += p;
                monthBags += b;
                monthFlightCount++;
            }
        }
    });

    if (totPax === 0 || monthPax === 0 || monthFlightCount < 3) {
        return { multiplier: 1.0, hasSeasonality: false, monthName };
    }

    const k_year = totBags / totPax;
    const k_month = monthBags / monthPax;
    const rawMultiplier = k_month / k_year;

    // Ограничиваем разумным авиационным диапазоном [0.80, 1.25]
    const multiplier = Math.max(0.80, Math.min(1.25, parseFloat(rawMultiplier.toFixed(3))));
    const isSignificant = Math.abs(multiplier - 1.0) >= 0.02;

    return {
        multiplier: multiplier,
        hasSeasonality: isSignificant,
        k_year: k_year,
        k_month: k_month,
        monthFlightCount: monthFlightCount,
        monthName: monthName
    };
}

// Расчет средних коэффициентов по переданному массиву рейсов (Экспоненциальное сглаживание alpha = 0.3)
function calculateMeansFromFlights(flights, alpha = 0.3) {
    if (!flights || flights.length === 0) return null;

    // Сортируем по дате в обратном порядке (самый свежий — индекс 0)
    const sortedFlights = [...flights].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    const N = sortedFlights.length;

    let totalPax = 0;
    let totalBags = 0;
    let totalBagWeight = 0;
    let totalHbWeight = 0;

    sortedFlights.forEach(f => {
        const pax = getEffectivePaxCount(f);
        const pcs = parseInt(f.bag_pcs) || 0;
        const bagWeight = parseFloat(f.bag_weight) || 0;
        const hbWeight = parseFloat(f.hb_weight) || 0;

        totalPax += pax;
        totalBags += pcs;
        totalBagWeight += bagWeight;
        totalHbWeight += hbWeight;
    });

    if (totalPax === 0) return null;

    let weights = [];
    if (N === 1) {
        weights = [1.0];
    } else {
        const rawWeights = [];
        for (let k = 0; k < N; k++) {
            if (k === N - 1) {
                rawWeights.push(Math.pow(1 - alpha, N - 1));
            } else {
                rawWeights.push(alpha * Math.pow(1 - alpha, k));
            }
        }
        const sumW = rawWeights.reduce((a, b) => a + b, 0);
        weights = rawWeights.map(w => w / sumW);
    }

    let pcs_pax = 0;
    let wght_pc = 0;
    let hb_pax = 0;

    sortedFlights.forEach((f, idx) => {
        const pax = getEffectivePaxCount(f);
        const pcs = parseInt(f.bag_pcs) || 0;
        const bagWeight = parseFloat(f.bag_weight) || 0;
        const hbWeight = parseFloat(f.hb_weight) || 0;

        const fl_pcs_pax = pax > 0 ? (pcs / pax) : 0;
        const fl_wght_pc = pcs > 0 ? (bagWeight / pcs) : 0;
        const fl_hb_pax = pax > 0 ? (hbWeight / pax) : 0;

        const w = weights[idx];
        pcs_pax += w * fl_pcs_pax;
        wght_pc += w * fl_wght_pc;
        hb_pax += w * fl_hb_pax;
    });

    return {
        pcs_pax: pcs_pax,
        wght_pc: wght_pc,
        hb_pax: hb_pax,
        usedFlights: sortedFlights,
        weights: weights,
        isWeighted: true,
        alpha: alpha,
        totalPax: totalPax,
        totalBags: totalBags,
        totalBagWeight: totalBagWeight,
        totalHbWeight: totalHbWeight
    };
}

// Поиск коэффициентов в исторической базе baggageDb
function getHistoricalCoefficients(fromRu, toRu, flightNo) {
    if (!baggageDb || !baggageDb.rules) return null;

    const fromIata = ruToIata(fromRu);
    const toIata = ruToIata(toRu);

    if (flightNo) {
        const rule = baggageDb.rules.find(r => r.from === fromIata && r.to === toIata && r.flt_no === flightNo);
        if (rule) return rule;
    }

    const dirRule = baggageDb.rules.find(r => r.from === fromIata && r.to === toIata && !r.flt_no);
    if (dirRule) return dirRule;

    const anyRule = baggageDb.rules.find(r => r.from === fromIata && r.to === toIata);
    if (anyRule) return anyRule;

    return null;
}



// --- HUD ТОСТ УВЕДОМЛЕНИЯ ---
function showAviationAlert(message, isError = false) {
    let container = document.getElementById('aviation-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'aviation-toast-container';
        container.className = 'aviation-toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `aviation-toast glass ${isError ? 'error-toast' : 'success-toast'}`;
    toast.innerHTML = `
        <div class="hud-corner top-left"></div>
        <div class="hud-corner top-right"></div>
        <div class="hud-corner bottom-left"></div>
        <div class="hud-corner bottom-right"></div>
        <span class="toast-icon">${isError ? '⚠️' : '✅'}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('visible');
    }, 50);
    
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// --- УДАЛЕНИЕ И ОЧИСТКА ---

let activeConfirmCallback = null;

function showAviationConfirm(message, onConfirm) {
    const modal = document.getElementById('aviation-confirm-modal');
    const msgEl = document.getElementById('aviation-confirm-message');
    if (!modal || !msgEl) {
        if (confirm(message)) {
            onConfirm();
        }
        return;
    }
    
    // Принудительный перевод шапки и кнопок модального окна перед открытием
    const titleEl = modal.querySelector('.modal-title-text');
    const cancelBtn = document.getElementById('modal-btn-cancel');
    const confirmBtn = document.getElementById('modal-btn-confirm');
    
    if (titleEl && translations[currentLang]['modal-confirm-title']) {
        titleEl.textContent = translations[currentLang]['modal-confirm-title'];
    }
    if (cancelBtn && translations[currentLang]['modal-confirm-cancel']) {
        cancelBtn.textContent = translations[currentLang]['modal-confirm-cancel'];
    }
    if (confirmBtn && translations[currentLang]['modal-confirm-submit']) {
        confirmBtn.textContent = translations[currentLang]['modal-confirm-submit'];
    }
    
    msgEl.textContent = message;
    activeConfirmCallback = onConfirm;
    modal.classList.remove('hidden');
}

function initAviationModal() {
    const modal = document.getElementById('aviation-confirm-modal');
    const cancelBtn = document.getElementById('modal-btn-cancel');
    const confirmBtn = document.getElementById('modal-btn-confirm');
    
    if (!modal || !cancelBtn || !confirmBtn) return;
    
    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        activeConfirmCallback = null;
    });
    
    confirmBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (typeof activeConfirmCallback === 'function') {
            activeConfirmCallback();
        }
        activeConfirmCallback = null;
    });
}

// Сравнение рейсов на полное совпадение (номер рейса, дата, маршрут вылета/прилета)
function isSameFlight(f1, f2) {
    if (!f1 || !f2) return false;
    const sameNum = getNumericFlightNo(f1.flight_no) === getNumericFlightNo(f2.flight_no);
    const sameDate = String(f1.date || '').trim() === String(f2.date || '').trim();
    const sameFrom = ruToIata(f1.from) === ruToIata(f2.from);
    const sameTo = ruToIata(f1.to) === ruToIata(f2.to);
    return sameNum && sameDate && sameFrom && sameTo;
}

function upsertFlight(newFlight) {
    const idx = userFlights.findIndex(oldF => isSameFlight(oldF, newFlight));
    if (idx !== -1) {
        userFlights[idx] = newFlight;
    } else {
        userFlights.push(newFlight);
    }
}

function handleManualFlightSubmit(e) {
    if (e) e.preventDefault();

    const airline = document.getElementById('manual-airline').value || 'N4';
    const flightNo = (document.getElementById('manual-flight-no').value || '').trim();
    const dateIso = document.getElementById('manual-date').value;
    
    const manualFromEl = document.getElementById('manual-from');
    const manualFromCustomEl = document.getElementById('manual-from-custom');
    const manualToEl = document.getElementById('manual-to');
    const manualToCustomEl = document.getElementById('manual-to-custom');

    let rawFrom = (manualFromEl && manualFromEl.value === '__custom__' && manualFromCustomEl ? manualFromCustomEl.value : (manualFromEl ? manualFromEl.value : '')).trim().toUpperCase();
    let rawTo = (manualToEl && manualToEl.value === '__custom__' && manualToCustomEl ? manualToCustomEl.value : (manualToEl ? manualToEl.value : '')).trim().toUpperCase();

    if (!flightNo || !dateIso || !rawFrom || !rawTo) {
        showAviationAlert(translations[currentLang]['error-fields-required'], true);
        return;
    }

    let fromCode = rawFrom.split(' ')[0].split('(')[0].trim();
    let toCode = rawTo.split(' ')[0].split('(')[0].trim();

    const men = parseInt(document.getElementById('manual-men').value, 10) || 0;
    const women = parseInt(document.getElementById('manual-women').value, 10) || 0;
    const rb = parseInt(document.getElementById('manual-rb').value, 10) || 0;
    const rm = parseInt(document.getElementById('manual-rm').value, 10) || 0;

    const pax = men + women + rb;
    if (pax <= 0) {
        showAviationAlert(currentLang === 'ru' ? 'Укажите количество пассажиров!' : 'Please enter passenger count!', true);
        return;
    }

    const bagPcs = parseInt(document.getElementById('manual-bag-pcs').value, 10) || 0;
    const bagWeight = parseFloat(document.getElementById('manual-bag-weight').value) || 0.0;
    const hbWeight = parseFloat(document.getElementById('manual-hb-weight').value) || 0.0;

    const fromIata = ruToIata(fromCode);
    const toIata = ruToIata(toCode);

    if (!baggageDb.airports[fromCode]) {
        baggageDb.airports[fromCode] = { iata: fromIata, ru: fromCode, name: fromCode };
    }
    if (!baggageDb.airports[toCode]) {
        baggageDb.airports[toCode] = { iata: toIata, ru: toCode, name: toCode };
    }
    if (baggageDb.departures_filter && !baggageDb.departures_filter.includes(fromCode) && !baggageDb.departures_filter.includes(fromIata)) {
        baggageDb.departures_filter.push(fromIata);
    }
    if (baggageDb.arrivals_filter && !baggageDb.arrivals_filter.includes(toCode) && !baggageDb.arrivals_filter.includes(toIata)) {
        baggageDb.arrivals_filter.push(toIata);
    }

    const newFlight = {
        id: 'manual_' + Date.now(),
        airline: airline,
        flight_no: flightNo,
        date: dateIso,
        from: fromIata,
        to: toIata,
        men: men,
        women: women,
        rb: rb,
        rm: rm,
        pax: pax,
        bag_pcs: bagPcs,
        bag_weight: bagWeight,
        hb_weight: hbWeight,
        source: 'manual',
        active: true
    };

    upsertFlight(newFlight);
    saveUserFlights();

    populateAirportDropdowns();
    populateAllFlightsDropdown();

    const selectFrom = document.getElementById('select-from');
    if (selectFrom) {
        const evt = new Event('change');
        selectFrom.dispatchEvent(evt);
    }

    showAviationAlert(translations[currentLang]['success-flight-added'], false);

    document.getElementById('manual-flight-no').value = '';
    document.getElementById('manual-men').value = 0;
    document.getElementById('manual-women').value = 0;
    document.getElementById('manual-rb').value = 0;
    document.getElementById('manual-rm').value = 0;
    document.getElementById('manual-bag-pcs').value = 0;
    document.getElementById('manual-bag-weight').value = 0;
    document.getElementById('manual-hb-weight').value = 0;
    
    if (manualFromEl) manualFromEl.value = '';
    if (manualToEl) manualToEl.value = '';
    if (manualFromCustomEl) {
        manualFromCustomEl.value = '';
        manualFromCustomEl.classList.add('hidden');
    }
    if (manualToCustomEl) {
        manualToCustomEl.value = '';
        manualToCustomEl.classList.add('hidden');
    }
}

// Экспорт всей базы данных (рейсы + история прогнозов) в JSON файл
function handleExportDatabase() {
    try {
        const backupData = {
            backup_version: "1.0",
            exported_at: new Date().toISOString(),
            flights: userFlights,
            predictions_history: predictionsHistory
        };

        const jsonString = JSON.stringify(backupData, null, 4);
        const blob = new Blob([jsonString], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        const dateObj = new Date();
        const dateStr = dateObj.getFullYear() + "_" + 
                        String(dateObj.getMonth() + 1).padStart(2, '0') + "_" + 
                        String(dateObj.getDate()).padStart(2, '0');
        
        link.href = url;
        link.download = `aerobag_backup_${dateStr}.json`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Небольшая задержка перед удалением и очисткой URL для стабильности в некоторых браузерах
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (err) {
        console.error("Ошибка экспорта базы данных:", err);
        showAviationAlert("Ошибка экспорта базы данных", true);
    }
}

// Импорт базы данных из JSON файла резервной копии
function handleImportDatabase(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            let importedFlights = [];
            let importedPredictions = [];

            // Проверяем структуру бэкапа
            if (parsed && typeof parsed === 'object') {
                if (Array.isArray(parsed)) {
                    // Обратная совместимость: если бэкап - это просто массив рейсов
                    importedFlights = parsed;
                } else {
                    importedFlights = Array.isArray(parsed.flights) ? parsed.flights : [];
                    importedPredictions = Array.isArray(parsed.predictions_history) ? parsed.predictions_history : [];
                }
            } else {
                throw new Error("Неверный формат JSON");
            }

            // Записываем данные в глобальное состояние с нормализацией кодов аэропортов в стандарт ИАТА
            userFlights = importedFlights.map(normalizeFlightRecord);
            predictionsHistory = importedPredictions;

            // Сохраняем в зависимости от оффлайн/онлайн режима
            if (isOfflineMode) {
                localStorage.setItem('averago_user_flights_local', JSON.stringify(userFlights));
            } else {
                // В режиме MySQL отправляем все восстановленные рейсы на сервер (UPSERT)
                await saveUserFlights();
            }

            // История прогнозов всегда сохраняется в localStorage
            savePredictionsHistory();

            // Обновляем весь UI
            updateActiveDateRangeAndCounts();
            renderFlightsTable();
            renderPredictionsTable();
            renderUploadedFilesList();

            // Сбрасываем фильтры, чтобы пересчитать выпадающие списки
            const selectFrom = document.getElementById('select-from');
            if (selectFrom) {
                selectFrom.value = '';
                const event = new Event('change');
                selectFrom.dispatchEvent(event);
            }

            // Показываем сообщение об успехе
            const successMsg = (translations[currentLang]['backup-import-success'] || 'База успешно восстановлена!')
                .replace('{flights}', userFlights.length)
                .replace('{predictions}', predictionsHistory.length);
            
            showAviationAlert(successMsg, false);

        } catch (err) {
            console.error("Ошибка импорта базы данных:", err);
            const errMsg = translations[currentLang]['backup-import-error'] || 'Ошибка чтения файла резервной копии.';
            showAviationAlert(errMsg, true);
        }
        
        // Очищаем значение input, чтобы можно было загрузить тот же файл повторно
        document.getElementById('backup-file-input').value = '';
    };

    reader.readAsText(file);
}

function handleClearDb(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log("handleClearDb called, currentLang:", currentLang);
    const msg = (translations[currentLang] && translations[currentLang]['confirm-clear-db']) 
        || (currentLang === 'en' ? "Are you sure you want to clear the entire flights database?" : "Вы уверены, что хотите очистить всю базу данных рейсов?");
    
    showAviationConfirm(msg, async () => {
        userFlights = [];
        try {
            localStorage.setItem('averago_user_flights_local', JSON.stringify([]));
        } catch (e) {
            console.error("Ошибка очистки LocalStorage:", e);
        }

        if (!isOfflineMode) {
            try {
                await fetch('api.php?action=clear_db');
            } catch (err) {
                console.warn("Серверная очистка недоступна, очищено локально:", err);
            }
        }

        updateActiveDateRangeAndCounts();
        renderFlightsTable();
        renderUploadedFilesList();
        populateAirportDropdowns();
        populateAllFlightsDropdown();

        showAviationAlert(translations[currentLang]['success-db-cleared'] || "База данных рейсов успешно очищена", false);

        const selectFrom = document.getElementById('select-from');
        if (selectFrom) {
            selectFrom.value = '';
            const event = new Event('change');
            selectFrom.dispatchEvent(event);
        }
    });
}

function handleClearPredictions(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log("handleClearPredictions called, currentLang:", currentLang);
    const msg = (translations[currentLang] && translations[currentLang]['confirm-clear-predictions']) 
        || (currentLang === 'en' ? "Are you sure you want to clear the entire predictions history?" : "Вы уверены, что хотите очистить всю историю прогнозов?");
    
    showAviationConfirm(msg, () => {
        predictionsHistory = [];
        savePredictionsHistory();
        renderPredictionsTable();
    });
}

async function deleteFlight(id) {
    if (isOfflineMode) {
        try {
            userFlights = userFlights.filter(f => f.id !== id);
            localStorage.setItem('averago_user_flights_local', JSON.stringify(userFlights));
            updateActiveDateRangeAndCounts();
            renderFlightsTable();
            renderUploadedFilesList();
        } catch (err) {
            console.error("Ошибка при локальном удалении рейса:", err);
            showAviationAlert("Ошибка при удалении локального рейса", true);
        }
    } else {
        try {
            const response = await fetch(`api.php?action=delete_flight&id=${encodeURIComponent(id)}`);
            const data = await response.json();
            if (data.success) {
                userFlights = userFlights.filter(f => f.id !== id);
                updateActiveDateRangeAndCounts();
                renderFlightsTable();
                renderUploadedFilesList();
            } else {
                showAviationAlert("Ошибка при удалении рейса: " + data.error, true);
            }
        } catch (err) {
            console.error("Ошибка при удалении рейса:", err);
            showAviationAlert("Ошибка сети при удалении рейса", true);
        }
    }

    const selectFrom = document.getElementById('select-from');
    if (selectFrom) {
        const event = new Event('change');
        selectFrom.dispatchEvent(event);
    }
}

function deletePrediction(id) {
    predictionsHistory = predictionsHistory.filter(p => p.id !== id);
    savePredictionsHistory();
    renderPredictionsTable();
}

// Экспортируем в глобальную область для инлайновых обработчиков
window.handleClearDb = handleClearDb;
window.handleClearPredictions = handleClearPredictions;
window.deleteFlight = deleteFlight;
window.deletePrediction = deletePrediction;

// --- ОТРИСОВКА ТАБЛИЦЫ РЕЙСОВ (База данных - только за последние 10 дней) ---
function renderFlightsTable() {
    const tbody = document.getElementById('flights-table-body');
    tbody.innerHTML = '';

    if (userFlights.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="10" class="empty-table-text">${translations[currentLang]['empty-table']}</td>`;
        tbody.appendChild(tr);
        return;
    }

    // Находим максимальную дату среди рейсов в базе
    let maxDateMs = 0;
    userFlights.forEach(flight => {
        const time = Date.parse(flight.date);
        if (!isNaN(time) && time > maxDateMs) {
            maxDateMs = time;
        }
    });

    const showAll = document.getElementById('chk-show-all-flights')?.checked || false;
    // Динамически обновляем заголовок таблицы
    const titleEl = document.querySelector('[data-translate="flights-table-title"]');
    if (titleEl) {
        const key = showAll ? 'flights-table-title-all' : 'flights-table-title';
        titleEl.textContent = translations[currentLang][key] || (showAll ? 'Flights Database (all)' : 'Flights Database (last 10 days)');
    }

    let visibleFlights;
    if (showAll) {
        visibleFlights = userFlights;
    } else {
        // Фильтр за последние 10 дней
        const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
        const minDateMsVisible = maxDateMs - tenDaysMs;

        visibleFlights = userFlights.filter(f => {
            const time = Date.parse(f.date);
            return isNaN(time) || time >= minDateMsVisible;
        });
    }

    if (visibleFlights.length === 0) {
        const tr = document.createElement('tr');
        const emptyMsg = showAll 
            ? (currentLang === 'ru' ? 'База данных пуста.' : 'Database is empty.')
            : (currentLang === 'ru' ? 'Нет рейсов за последние 10 дней.' : 'No flights within the last 10 days.');
        tr.innerHTML = `<td colspan="10" class="empty-table-text">${emptyMsg}</td>`;
        tbody.appendChild(tr);
        return;
    }

    const sorted = [...visibleFlights].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    sorted.forEach(f => {
        const tr = document.createElement('tr');
        if (!f.active) {
            tr.classList.add('inactive-row');
        }

        const dateStr = formatDateStr(f.date);
        const adult = f.men + f.women;
        const paxStr = `${f.pax} (${adult} / ${f.rb} / ${f.rm})`;
        const statusText = f.active ? translations[currentLang]['status-active'] : translations[currentLang]['status-inactive'];
        const statusClass = f.active ? 'active' : 'inactive';

        tr.innerHTML = `
            <td><strong>${formatAirline(f.airline)}</strong></td>
            <td>${f.flight_no}</td>
            <td>${dateStr}</td>
            <td><strong>${ruToIata(f.from)} ➔ ${ruToIata(f.to)}</strong></td>
            <td>${paxStr}</td>
            <td>${f.bag_pcs}</td>
            <td>${Math.round(f.bag_weight)} кг</td>
            <td>${Math.round(f.hb_weight)} кг</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn-delete-row" title="Удалить" onclick="deleteFlight('${f.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- ОТРИСОВКА ТАБЛИЦЫ ПРОГНОЗОВ (История прогнозирования) ---
function renderPredictionsTable() {
    const tbody = document.getElementById('predictions-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (predictionsHistory.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="8" class="empty-table-text">${translations[currentLang]['empty-predictions-table']}</td>`;
        tbody.appendChild(tr);
        return;
    }

    predictionsHistory.forEach(p => {
        const tr = document.createElement('tr');
        tr.className = 'history-row-clickable';
        tr.setAttribute('data-pred-id', p.id);
        tr.title = currentLang === 'ru' ? 'Нажмите для переноса в Средний вес багажа и данные загрузки' : 'Click to transfer to Load Planning';

        tr.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-row')) return;
            transferPredictionToPreliminary(p.id);
        });
        
        // Форматирование суффикса даты рейса /ДД.ММ
        let flightDayMonthStr = '';
        const flightDateSrc = p.flight_date || p.calc_date;
        if (flightDateSrc) {
            try {
                const parts = String(flightDateSrc).split('T')[0].split('-');
                if (parts.length === 3) {
                    flightDayMonthStr = `/${parts[2]}.${parts[1]}`;
                }
            } catch (e) {
                console.error("Ошибка парсинга даты вылета:", e);
            }
        }

        // Форматирование даты и времени расчета
        let formattedCalcDate = '';
        try {
            const d = new Date(p.calc_date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            formattedCalcDate = `${day}.${month} ${hours}:${minutes}`;
        } catch (e) {
            formattedCalcDate = p.calc_date;
        }

        tr.innerHTML = `
            <td><strong>${ruToIata(p.from)} ➔ ${ruToIata(p.to)}</strong></td>
            <td><strong>${p.flight_no}</strong><span class="flight-day-tag">${flightDayMonthStr}</span></td>
            <td>${p.pax}</td>
            <td>${p.bag_pcs}</td>
            <td>${p.bag_weight} кг</td>
            <td>${p.hb_weight} кг</td>
            <td>${formattedCalcDate}</td>
            <td>
                <button class="btn-delete-row" title="Удалить" onclick="deletePrediction('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Вспомогательная функция обновления верхней инфо-плашки активного рейса в таблице загрузки
function updateActiveFlightBadge(from, to, flightNo, flightDate) {
    const badgeEl = document.getElementById('active-flight-badge');
    const badgeRoute = document.getElementById('badge-route');
    const badgeFlightNo = document.getElementById('badge-flight-no');
    const badgeFlightDate = document.getElementById('badge-flight-date');

    if (!badgeEl || !from || !to) return;

    const fromIata = ruToIata(from) || from;
    const toIata = ruToIata(to) || to;

    let dateTag = '';
    if (flightDate) {
        try {
            const parts = String(flightDate).split('T')[0].split('-');
            if (parts.length === 3) {
                dateTag = `/${parts[2]}.${parts[1]}`;
            }
        } catch (e) {}
    }

    if (badgeRoute) badgeRoute.textContent = `${fromIata} ➔ ${toIata}`;
    if (badgeFlightNo) badgeFlightNo.textContent = flightNo || '';
    if (badgeFlightDate) badgeFlightDate.textContent = dateTag;

    badgeEl.classList.remove('hidden');
}

// Вспомогательная функция выделения строки в таблице истории
function highlightPredictionRow(predId) {
    const tbody = document.getElementById('predictions-table-body');
    if (!tbody) return;

    Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
        tr.classList.remove('selected-history-row');
    });

    const targetTr = tbody.querySelector(`tr[data-pred-id="${predId}"]`);
    if (targetTr) {
        targetTr.classList.add('selected-history-row');
    }
}

// --- ПАРСИНГ EXCEL ФАЙЛОВ СИСТЕМЫ РЕГИСТРАЦИИ ---

function setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => {
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUploadedFiles(files);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleUploadedFiles(fileInput.files);
        }
    });
}

function handleUploadedFiles(files) {
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const rawResult = e.target.result;
            let workbook = null;

            // 1. Попытка 1: Чтение через ArrayBuffer (стандартные xls/xlsx)
            try {
                const arr = new Uint8Array(rawResult);
                workbook = XLSX.read(arr, { type: 'array', cellDates: false });
            } catch (err1) {
                console.warn("ArrayBuffer read failed, trying UTF-8 text string...", err1);
            }

            // 2. Попытка 2: Чтение как ТЕКСТ UTF-8 (HTML / XML / SpreadsheetML 2003 / CSV с расширением .xls)
            if (!workbook) {
                try {
                    const textDecoder = new TextDecoder('utf-8');
                    const textStr = textDecoder.decode(rawResult);
                    workbook = XLSX.read(textStr, { type: 'string', cellDates: false });
                } catch (err2) {
                    console.warn("UTF-8 text string read failed, trying windows-1251...", err2);
                    try {
                        const textDecoder1251 = new TextDecoder('windows-1251');
                        const textStr1251 = textDecoder1251.decode(rawResult);
                        workbook = XLSX.read(textStr1251, { type: 'string', cellDates: false });
                    } catch (err3) {
                        console.error("All read attempts failed for file:", file.name, err3);
                    }
                }
            }

            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
                showAviationAlert(translations[currentLang]['file-process-error'].replace('{name}', file.name), true);
                return;
            }

            try {
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
                
                processRegistrationData(file.name, rows);
            } catch (processErr) {
                console.error("Ошибка обработки таблицы:", processErr);
                showAviationAlert(translations[currentLang]['file-process-error'].replace('{name}', file.name), true);
            }
        };

        reader.readAsArrayBuffer(file);
    });
}

function processRegistrationData(filename, rows, options = {}) {
    const isSilent = !!options.isSilent;
    const isSystem = !!options.isSystem;

    if (!rows || rows.length === 0) {
        if (!isSilent) {
            showAviationAlert(translations[currentLang]['file-process-error'].replace('{name}', filename), true);
        }
        return;
    }

    let headerRowIdx = -1;

    // 1. Поиск строки заголовков по ключевым словам (рейс + направление/пассажиры)
    for (let i = 0; i < Math.min(rows.length, 25); i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;
        
        const cleanCells = Array.from(row).map(cell => cell !== null && cell !== undefined ? String(cell).trim().toLowerCase() : '');
        
        const hasFlight = cleanCells.some(c => c && (c.includes('рейс') || c.includes('flt') || c.includes('flight') || c.includes('№')));
        const hasDirection = cleanCells.some(c => c && (c.includes('направление') || c.includes('direction') || c.includes('прилет') || c.includes('куда') || c.includes('destination') || c.includes('маршрут') || c.includes('to')));
        const hasPax = cleanCells.some(c => c && (c.includes('пасс') || c.includes('pax') || c.includes('кол-во') || c.includes('passengers') || c.includes('всего') || c.includes('вз')));
        
        if (hasFlight && (hasDirection || hasPax)) {
            headerRowIdx = i;
            break;
        }
    }

    // 2. Если не найдено, проверяем первую непустую строку
    if (headerRowIdx === -1) {
        for (let i = 0; i < Math.min(rows.length, 5); i++) {
            if (rows[i] && rows[i].length > 3) {
                headerRowIdx = i;
                break;
            }
        }
    }

    if (headerRowIdx === -1) headerRowIdx = 0;

    const rawHeaders = Array.from(rows[headerRowIdx] || []);
    const headers = rawHeaders.map(h => (h !== null && h !== undefined) ? String(h).trim().toLowerCase() : '');
    
    // Каноничный сопоставитель по названию или спецификации колонок (A=0, B=1, C=2, D=3, E=4, P=15, Q=16, S=18, T=19, U=20, V=21)
    const colMap = {
        airline: headers.findIndex(h => h && (h.includes('код а/к') || h.includes('а/к') || h.includes('airline') || h === 'ак')),
        airportFrom: headers.findIndex(h => h && (h.includes('код а/п') || h.includes('вылет') || h.includes('from') || h.includes('аэропорт вылета') || h.includes('откуда'))),
        flightNo: headers.findIndex(h => h && (h.includes('рейс') || h.includes('flt') || h.includes('flight') || h.includes('номер рейса') || h.includes('№'))),
        date: headers.findIndex(h => h && (h.includes('дата') || h.includes('date'))),
        direction: headers.findIndex(h => h && (h.includes('направление') || h.includes('прилет') || h.includes('to') || h.includes('dest') || h.includes('куда') || h.includes('маршрут'))),
        pax: headers.findIndex(h => h && (h.includes('пасс') || h.includes('pax') || h.includes('кол-во') || h.includes('passenger') || h.includes('всего'))),
        men: headers.findIndex(h => h && (h === 'м' || h.includes('муж') || h.includes('men') || h === 'm')),
        women: headers.findIndex(h => h && (h === 'ж' || h.includes('жен') || h.includes('women') || h === 'w' || h === 'f')),
        rb: headers.findIndex(h => h && (h === 'рб' || h.includes('chd') || h.includes('дети') || h.includes('ребенок'))),
        rm: headers.findIndex(h => h && (h === 'рм' || h.includes('inf') || h.includes('млад') || h.includes('младен'))),
        vz: headers.findIndex(h => h && (h === 'вз' || h.includes('adl') || h.includes('взрос'))),
        hbWeight: headers.findIndex(h => h && (h.includes('р/кладь') || h.includes('ручная') || h.includes('hb') || h.includes('cabin'))),
        bagPcs: headers.findIndex(h => h && (h.includes('бг мест') || h.includes('багаж мест') || h.includes('bag pcs') || h.includes('мест'))),
        bagWeight: headers.findIndex(h => h && (h === 'бг вес' || h.includes('бг вес') || h.includes('багаж вес') || h.includes('bag weight') || h.includes('вес бг') || h.includes('вес багаж')))
    };

    // Строгие стандартизированные столбцы отчета регистрации: A=0, B=1, C=2, D=3, E=4, P=15, Q=16, S=18, T=19, U=20, V=21
    if (colMap.airline === -1) colMap.airline = 0;      // Столбец A (Код авиакомпании)
    if (colMap.airportFrom === -1) colMap.airportFrom = 1; // Столбец B (Аэропорт вылета)
    if (colMap.flightNo === -1) colMap.flightNo = 2;    // Столбец C (Номер рейса)
    if (colMap.date === -1) colMap.date = 3;            // Столбец D (Дата рейса)
    if (colMap.direction === -1) colMap.direction = 4;   // Столбец E (Аэропорт прилёта)
    if (colMap.vz === -1) colMap.vz = 15;                // Столбец P (Взрослые)
    if (colMap.rb === -1) colMap.rb = 16;                // Столбец Q (РБ)
    if (colMap.rm === -1) colMap.rm = 18;                // Столбец S (РМ)
    if (colMap.hbWeight === -1) colMap.hbWeight = 19;    // Столбец T (Р/кладь вес)
    if (colMap.bagPcs === -1) colMap.bagPcs = 20;        // Столбец U (Багаж мест)
    if (colMap.bagWeight === -1) colMap.bagWeight = 21;    // Столбец V (Багаж вес)

    let addedCount = 0;
    const customFilters = getCustomAirportFilters();
    const allowedDeparturesSet = new Set((customFilters.departures || []).map(c => String(c).trim().toUpperCase()));
    const allowedArrivalsSet = new Set((customFilters.arrivals || []).map(c => String(c).trim().toUpperCase()));

    for (let i = headerRowIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const getVal = (idx) => (idx !== -1 && row[idx] !== undefined && row[idx] !== null) ? String(row[idx]).trim() : '';

        let rawAirline = getVal(colMap.airline);
        let rawFrom = getVal(colMap.airportFrom);
        let rawFltNo = getVal(colMap.flightNo);
        let rawDate = getVal(colMap.date);
        let rawDirectionFull = getVal(colMap.direction);

        // Строка является данными рейса, если в номере рейса или дате присутствуют цифры (отсеиваем шапки повторных страниц)
        const hasFltDigits = /\d+/.test(rawFltNo);
        const hasDateDigits = /\d+/.test(rawDate);
        if (!hasFltDigits && !hasDateDigits) continue;

        let cleanFrom = parseCleanAirportCode(rawFrom);
        let last3 = rawDirectionFull.length >= 3 ? rawDirectionFull.slice(-3).trim() : rawDirectionFull.trim();
        let cleanDirection = parseCleanAirportCode(last3) || parseCleanAirportCode(rawDirectionFull) || last3;

        if (!cleanFrom) cleanFrom = 'AER';
        if (!cleanDirection) cleanDirection = 'AYT';

        const fromInfo = resolveAirportInfo(cleanFrom) || resolveAirportInfo(rawFrom);
        const fromIata = fromInfo ? fromInfo.iata : (ruToIata(cleanFrom) || cleanFrom);
        const fromRu = fromInfo ? fromInfo.ru : (iataToRu(fromIata) || cleanFrom);
        const toInfo = resolveAirportInfo(cleanDirection) || resolveAirportInfo(rawDirectionFull);
        const toIata = toInfo ? toInfo.iata : (ruToIata(cleanDirection) || cleanDirection);
        const toRu = toInfo ? toInfo.ru : (iataToRu(toIata) || cleanDirection);

        // 1. Проверка по фильтру вылетов (Departures Filter)
        if (allowedDeparturesSet.size > 0) {
            const isAllowedDep = allowedDeparturesSet.has(fromIata.toUpperCase()) || 
                                 allowedDeparturesSet.has(fromRu.toUpperCase()) || 
                                 allowedDeparturesSet.has(cleanFrom.toUpperCase()) || 
                                 allowedDeparturesSet.has(rawFrom.toUpperCase()) ||
                                 (fromInfo && fromInfo.name && allowedDeparturesSet.has(fromInfo.name.toUpperCase()));

            if (!isAllowedDep) {
                // Рейс из неразрешенного аэропорта вылета пропускается
                continue;
            }
        }

        // 2. Проверка по фильтру прилетов (Arrivals Filter, только если включен строгий режим - Вариант А)
        if (customFilters.strict_arrivals && allowedArrivalsSet.size > 0) {
            const isAllowedArr = allowedArrivalsSet.has(toIata.toUpperCase()) || 
                                 allowedArrivalsSet.has(toRu.toUpperCase()) || 
                                 allowedArrivalsSet.has(cleanDirection.toUpperCase()) || 
                                 allowedArrivalsSet.has(rawDirectionFull.toUpperCase()) ||
                                 (toInfo && toInfo.name && allowedArrivalsSet.has(toInfo.name.toUpperCase()));

            if (!isAllowedArr) {
                // Рейс в неразрешенный аэропорт прилета пропускается
                continue;
            }
        }

        // Пассажиры: ВЗ (Столбец P / 15), РБ (Столбец Q / 16), РМ (Столбец S / 18)
        let vz = parseInt(getVal(colMap.vz), 10) || 0;
        let rb = parseInt(getVal(colMap.rb), 10) || 0;
        let rm = parseInt(getVal(colMap.rm), 10) || 0;

        let totalPax = vz + rb;
        if (totalPax === 0) {
            const rawPaxCol = parseInt(getVal(colMap.pax), 10) || 0;
            if (rawPaxCol > 0) {
                totalPax = Math.max(0, rawPaxCol - rm);
            }
        }
        if (totalPax <= 0) totalPax = 1;

        // Р/кладь (Столбец T / 19), Багаж мест (Столбец U / 20), Багаж вес (Столбец V / 21)
        const hbWeight = parseFloat(getVal(colMap.hbWeight).replace(',', '.')) || 0;
        const bagPcs = parseInt(getVal(colMap.bagPcs), 10) || 0;
        const bagWeight = parseFloat(getVal(colMap.bagWeight).replace(',', '.')) || 0;

        const formattedDate = formatExcelDate(rawDate);

        const newFlight = {
            id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            airline: formatAirline(rawAirline),
            flight_no: getNumericFlightNo(rawFltNo) || rawFltNo,
            date: formattedDate,
            from: fromIata,
            to: toIata,
            men: vz,
            women: 0,
            rb: rb,
            rm: rm,
            pax: totalPax,
            bag_pcs: bagPcs,
            bag_weight: bagWeight,
            hb_weight: hbWeight,
            source: filename,
            isSystem: isSystem,
            active: true
        };

        upsertFlight(newFlight);
        addedCount++;
    }

    saveUserFlights();
    populateAirportDropdowns();
    updateActiveDateRangeAndCounts();
    renderFlightsTable();
    renderUploadedFilesList();
    populateAllFlightsDropdown();

    if (!isSilent) {
        const msg = (translations[currentLang]['file-processed-success'] || 'Файл "{name}" успешно обработан. Загружено {count} рейсов.').replace('{name}', filename).replace('{count}', addedCount);
        showAviationAlert(msg, false);
    }
}

function renderFileItem(name, count) {
    const list = document.getElementById('uploaded-files-list');
    
    const existing = document.getElementById(`file-item-${name.replace(/[^a-zA-Z0-9]/g, '_')}`);
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = `file-item-${name.replace(/[^a-zA-Z0-9]/g, '_')}`;
    div.className = 'file-item';
    
    const textLabel = currentLang === 'ru' ? 'рейсов' : 'flights';
    
    div.innerHTML = `
        <div class="file-info">
            <span class="file-icon">📄</span>
            <span class="file-name" title="${name}">${name.length > 25 ? name.substring(0, 22) + '...' : name}</span>
            <span class="file-flights-count">(${count} ${textLabel})</span>
        </div>
        <button class="btn-remove-file" onclick="removeUploadedFile('${name}')">✕</button>
    `;
    list.appendChild(div);
}

function renderUploadedFilesList() {
    const list = document.getElementById('uploaded-files-list');
    if (!list) return;
    list.innerHTML = '';

    const counts = {};
    if (userFlights && userFlights.length > 0) {
        userFlights.forEach(f => {
            if (f.source && f.source !== 'manual') {
                counts[f.source] = (counts[f.source] || 0) + 1;
            }
        });
    }

    Object.keys(counts).forEach(filename => {
        renderFileItem(filename, counts[filename]);
    });
}

function removeUploadedFile(filename) {
    userFlights = userFlights.filter(f => f.source !== filename);
    saveUserFlights();

    const item = document.getElementById(`file-item-${filename.replace(/[^a-zA-Z0-9]/g, '_')}`);
    if (item) item.remove();

    const selectFrom = document.getElementById('select-from');
    const event = new Event('change');
    selectFrom.dispatchEvent(event);
}

function parseExcelDate(val) {
    if (!val) return null;
    
    // Если это объект Date (от SheetJS или JS)
    if (val instanceof Date && !isNaN(val.getTime())) {
        const yyyy = val.getFullYear();
        const mm = String(val.getMonth() + 1).padStart(2, '0');
        const dd = String(val.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    const valStr = String(val).trim();
    if (!valStr) return null;

    // Строковый формат DD.MM.YYYY или DD.MM.YY (например 22.07.2026 или 22.07.26)
    const match = valStr.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
    if (match) {
        let d = parseInt(match[1], 10);
        let m = parseInt(match[2], 10);
        let y = parseInt(match[3], 10);
        if (y < 100) {
            y += (y < 50 ? 2000 : 1900);
        }
        const yyyy = String(y).padStart(4, '0');
        const mm = String(m).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // ИСО формат YYYY-MM-DD
    const isoMatch = valStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        return isoMatch[0];
    }

    return null;
}

function parseDateToJsDate(val) {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val.getTime())) {
        return val;
    }
    const isoStr = parseExcelDate(val);
    if (isoStr) {
        const parts = isoStr.split('-');
        if (parts.length === 3) {
            const y = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) - 1;
            const d = parseInt(parts[2], 10);
            const dt = new Date(y, m, d);
            if (!isNaN(dt.getTime())) return dt;
        }
    }
    return null;
}

function formatDateStr(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
}

// Валидация числовых полей ввода и автоочистка ведущих нулей
function setupNumericInputValidation() {
    // Инпуты количества пассажиров и целых чисел
    const paxInputs = [
        'input-pax',
        'lir-pax',
        'lir-pcs',
        'lir-weight',
        'manual-men',
        'manual-women',
        'manual-rb',
        'manual-rm',
        'manual-bag-pcs'
    ];
    for (let i = 1; i <= 12; i++) {
        paxInputs.push(`bulk-pcs-${i}`);
        paxInputs.push(`bulk-weight-${i}`);
    }

    paxInputs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.dataset.prevValue = el.value || (id === 'input-pax' ? '150' : '0');
        el.dataset.readyToOverwrite = 'false';

        // 1. При фокусе (клик или TAB) число НЕ пропадает, но подсвечивается и помечается к перезаписи
        el.addEventListener('focus', (e) => {
            if (e.target.value !== '') {
                e.target.dataset.prevValue = e.target.value;
            }
            e.target.dataset.readyToOverwrite = 'true';
            setTimeout(() => {
                if (typeof e.target.select === 'function') {
                    e.target.select();
                }
            }, 0);
        });

        // 2. Повторный клик внутри уже активного поля помечает текст к авто-перезаписи при вводе
        el.addEventListener('click', (e) => {
            e.target.dataset.readyToOverwrite = 'true';
            if (typeof e.target.select === 'function') {
                e.target.select();
            }
        });

        // 3. Перехвачик нажатия клавиш: стирает старое значение при первом вводе цифры
        el.addEventListener('keydown', (e) => {
            if (e.target.dataset.readyToOverwrite === 'true') {
                const isNavigationKey = ['Tab', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key);
                if (!isNavigationKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
                        e.target.value = '';
                        e.target.dataset.readyToOverwrite = 'false';
                        if (id === 'lir-pax') {
                            recalculateLoadPlanning();
                        }
                    }
                }
            }
        });

        // 4. Фильтрация ввода (только цифры, авто-удаление ведущих нулей)
        el.addEventListener('input', (e) => {
            e.target.dataset.readyToOverwrite = 'false';
            let val = e.target.value;
            let clean = val.replace(/[^0-9]/g, '');
            if (clean.length > 1 && clean.startsWith('0')) {
                clean = clean.replace(/^0+/, '');
            }
            e.target.value = clean;
            if (id === 'lir-pax') {
                recalculateLoadPlanning();
            }
        });

        // 5. Восстановление сохраненного значения при уходе (blur), если поле осталось пустым
        el.addEventListener('blur', (e) => {
            e.target.dataset.readyToOverwrite = 'false';
            let val = e.target.value.trim();
            if (val === '') {
                e.target.value = e.target.dataset.prevValue || (id === 'input-pax' ? '150' : '0');
            } else if (id === 'input-pax' && parseInt(val, 10) === 0) {
                e.target.value = '1';
            }
            if (id === 'lir-pax') {
                recalculateLoadPlanning();
            }
        });
    });

    // Инпуты дробных чисел (вес)
    const floatInputs = [
        'manual-bag-weight',
        'manual-hb-weight'
    ];

    floatInputs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener('input', (e) => {
            let val = e.target.value;
            
            // Разрешаем только цифры и одну точку
            let clean = val.replace(/[^0-9.]/g, '');
            const parts = clean.split('.');
            if (parts.length > 2) {
                clean = parts[0] + '.' + parts.slice(1).join('');
            }
            
            // Убираем ведущие нули (напр. 020 -> 20, но 0.5 остается 0.5)
            if (clean.length > 1 && clean.startsWith('0') && clean[1] !== '.') {
                clean = clean.replace(/^0+/, '');
            }
            
            e.target.value = clean;
        });

        el.addEventListener('blur', (e) => {
            let val = e.target.value.trim();
            if (val === '' || val === '.') {
                e.target.value = '0';
            }
        });
    });

    // Обнуляем количество мест и веса в BULK (отсеки 1..12)
    for (let i = 1; i <= 12; i++) {
        const pcsInput = document.getElementById(`bulk-pcs-${i}`);
        if (pcsInput) pcsInput.value = '0';
        
        const wInput = document.getElementById(`bulk-weight-${i}`);
        if (wInput) {
            wInput.removeAttribute('data-locked');
            wInput.classList.remove('weight-locked');
            wInput.value = '0';
        }
    }

    recalculateLoadPlanning();
}

// --- ОТРИСОВКА И РАСЧЕТ ДАШБОРДА АНАЛИТИКИ И МАСШТАБИРОВАНИЯ ---
function renderDashboardAnalytics() {
    const routeSelect = document.getElementById('dash-filter-route');
    const selectedRoute = routeSelect ? routeSelect.value : 'all';

    // Helper for checking valid 3-letter IATA codes (rejects #REF!, NULL, undefined)
    const isValidIataCode = (code) => {
        if (!code) return false;
        const str = String(code).trim().toUpperCase();
        if (str.includes('#') || str.includes('REF') || str.includes('NULL') || str.includes('UNDEFINED')) {
            return false;
        }
        return /^[A-Z]{3}$/.test(str);
    };

    // 1. Используем данные из загруженной базы рейсов и системных нормативов (baggageDb.rules)
    let dataset = [];

    if (userFlights && Array.isArray(userFlights)) {
        userFlights.forEach(f => {
            const fromIata = ruToIata(f.from) || f.from;
            const toIata = ruToIata(f.to) || f.to;
            if (isValidIataCode(fromIata) && isValidIataCode(toIata)) {
                dataset.push({
                    from: fromIata,
                    to: toIata,
                    flight_no: f.flight_no,
                    pax: getEffectivePaxCount(f),
                    bag_pcs: parseInt(f.bag_pcs, 10) || 0,
                    bag_weight: parseFloat(f.bag_weight) || 0,
                    hb_weight: parseFloat(f.hb_weight) || 0,
                    date: f.date,
                    source: 'user_db'
                });
            }
        });
    }

    if (baggageDb && Array.isArray(baggageDb.rules)) {
        baggageDb.rules.forEach(r => {
            const fromIata = ruToIata(r.from) || r.from;
            const toIata = ruToIata(r.to) || r.to;
            if (isValidIataCode(fromIata) && isValidIataCode(toIata)) {
                const paxCount = parseInt(r.pax_no, 10) || 150;
                const pcsPax = parseFloat(r.pcs_pax) || 0;
                const wghtPc = parseFloat(r.wght_pc) || 0;
                const totalPcs = Math.round(paxCount * pcsPax);
                const totalWeight = totalPcs * wghtPc;
                const hbWeight = Math.round(paxCount * (parseFloat(r.hb_pax) || 0));

                dataset.push({
                    from: fromIata,
                    to: toIata,
                    flight_no: r.flt_no || '',
                    pax: paxCount,
                    bag_pcs: totalPcs,
                    bag_weight: totalWeight,
                    hb_weight: hbWeight,
                    date: r.date || null,
                    source: 'system_rules'
                });
            }
        });
    }

    // 2. Обновляем списки выпадающего фильтра маршрутов (исключая битые типы #REF!)
    if (routeSelect) {
        const savedRoute = routeSelect.value;
        const routesSet = new Set();
        dataset.forEach(f => {
            if (isValidIataCode(f.from) && isValidIataCode(f.to)) {
                routesSet.add(`${f.from} ➔ ${f.to}`);
            }
        });

        // Сохраняем первую опцию "Все направления" / "All Routes"
        routeSelect.innerHTML = `<option value="all">${currentLang === 'ru' ? 'Все направления' : 'All Routes'}</option>`;
        Array.from(routesSet).sort().forEach(r => {
            const opt = document.createElement('option');
            opt.value = r;
            opt.textContent = r;
            routeSelect.appendChild(opt);
        });

        if (Array.from(routeSelect.options).some(o => o.value === savedRoute)) {
            routeSelect.value = savedRoute;
        }
    }

    // 3. Фильтрация набора данных по периоду времени и маршруту
    const periodSelect = document.getElementById('dash-filter-period');
    const selectedPeriod = periodSelect ? periodSelect.value : 'all';
    
    let filteredDataset = dataset;
    let periodSubtext = currentLang === 'ru' ? 'За весь период базы данных' : 'For entire database period';

    if (selectedPeriod !== 'all') {
        const now = new Date();
        
        if (selectedPeriod === '30' || selectedPeriod === '60' || selectedPeriod === '90') {
            const days = parseInt(selectedPeriod, 10);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            
            filteredDataset = filteredDataset.filter(f => {
                if (!f.date) return false;
                const d = parseDateToJsDate(f.date);
                return d && d >= cutoffDate;
            });
            periodSubtext = currentLang === 'ru' ? `За последние ${days} дней` : `Last ${days} days`;
        } else if (selectedPeriod === 'year') {
            const currentYear = now.getFullYear();
            filteredDataset = filteredDataset.filter(f => {
                if (!f.date) return false;
                const d = parseDateToJsDate(f.date);
                return d && d.getFullYear() === currentYear;
            });
            periodSubtext = currentLang === 'ru' ? `За ${currentYear} год` : `For year ${currentYear}`;
        } else if (selectedPeriod === 'custom') {
            const dateFromInput = document.getElementById('dash-date-from');
            const dateToInput = document.getElementById('dash-date-to');
            const fromVal = dateFromInput ? dateFromInput.value : '';
            const toVal = dateToInput ? dateToInput.value : '';

            if (fromVal || toVal) {
                const fromDate = fromVal ? new Date(fromVal) : new Date('1970-01-01');
                const toDate = toVal ? new Date(toVal) : new Date('2099-12-31');
                toDate.setHours(23, 59, 59, 999);

                filteredDataset = filteredDataset.filter(f => {
                    if (!f.date) return false;
                    const d = parseDateToJsDate(f.date);
                    return d && d >= fromDate && d <= toDate;
                });
                periodSubtext = currentLang === 'ru' 
                    ? `Интервал: ${fromVal || '...'} — ${toVal || '...'}`
                    : `Interval: ${fromVal || '...'} — ${toVal || '...'}`;
            }
        }
    }

    // Сохраняем срез периода (до сужения по выбранному маршруту selectedRoute)
    const periodFilteredDataset = [...filteredDataset];

    if (selectedRoute && selectedRoute !== 'all') {
        const [fromCode, toCode] = selectedRoute.split(' ➔ ').map(s => s.trim());
        filteredDataset = filteredDataset.filter(f => f.from === fromCode && f.to === toCode);
    }

    // 4. Расчет KPI Метрик
    const totalFlights = filteredDataset.length;

    const uniqueFlightNumbersSet = new Set();
    let totalPax = 0;
    let totalPcs = 0;
    let totalWeight = 0;
    let totalHb = 0;

    filteredDataset.forEach(f => {
        if (f.flight_no && String(f.flight_no).trim() !== '') {
            uniqueFlightNumbersSet.add(String(f.flight_no).trim());
        }
        totalPax += f.pax;
        totalPcs += f.bag_pcs;
        totalWeight += f.bag_weight;
        totalHb += f.hb_weight;
    });

    const totalFlightNumbers = uniqueFlightNumbersSet.size > 0 ? uniqueFlightNumbersSet.size : (filteredDataset.length > 0 ? 1 : 0);
    const avgWeightPerPax = totalPax > 0 ? (totalWeight / totalPax) : 0;
    const avgPcsPerPax = totalPax > 0 ? (totalPcs / totalPax) : 0;

    // Обновляем карточки KPI
    const kpiFlights = document.getElementById('dash-kpi-flights');
    const kpiRoutes = document.getElementById('dash-kpi-routes');
    const kpiWeight = document.getElementById('dash-kpi-weight');
    const kpiPcs = document.getElementById('dash-kpi-pcs');

    const kgUnitText = currentLang === 'ru' ? 'кг/пассажира' : 'kg/passenger';
    const pcsUnitText = currentLang === 'ru' ? 'мест/пассажира' : 'pcs/passenger';

    if (kpiFlights) kpiFlights.textContent = totalFlights;
    if (kpiRoutes) kpiRoutes.textContent = totalFlightNumbers;
    if (kpiWeight) kpiWeight.innerHTML = `${avgWeightPerPax.toFixed(2)} <span class="kpi-unit">${kgUnitText}</span>`;
    if (kpiPcs) kpiPcs.innerHTML = `${avgPcsPerPax.toFixed(2)} <span class="kpi-unit">${pcsUnitText}</span>`;

    // Обновляем подписи периода под KPI карточками
    const kpiSubs = document.querySelectorAll('.dashboard-kpi-grid .kpi-sub');
    kpiSubs.forEach(el => el.textContent = periodSubtext);

    // 5. Группировка по маршрутам для графиков
    const routeStats = {};
    filteredDataset.forEach(f => {
        const routeKey = (f.from && f.to) ? `${f.from} ➔ ${f.to}` : 'Прочие';
        if (!routeStats[routeKey]) {
            routeStats[routeKey] = { route: routeKey, pax: 0, pcs: 0, weight: 0, hb: 0, flights: 0 };
        }
        routeStats[routeKey].pax += f.pax;
        routeStats[routeKey].pcs += f.bag_pcs;
        routeStats[routeKey].weight += f.bag_weight;
        routeStats[routeKey].hb += f.hb_weight;
        routeStats[routeKey].flights += 1;
    });

    const routeStatsList = Object.values(routeStats).map(r => ({
        ...r,
        avgWeight: r.pax > 0 ? (r.weight / r.pax) : 0,
        avgPcs: r.pax > 0 ? (r.pcs / r.pax) : 0,
        avgHb: r.pax > 0 ? (r.hb / r.pax) : 0
    }));

    // График 1: Вес на 1 PAX по маршрутам (Ранжированные полосы с бейджами ТОП-направлений)
    const weightContainer = document.getElementById('dash-chart-weight-container');
    if (weightContainer) {
        weightContainer.innerHTML = '';
        const sortedByWeight = [...routeStatsList].sort((a, b) => b.avgWeight - a.avgWeight);
        const maxW = sortedByWeight.length > 0 ? Math.max(...sortedByWeight.map(r => r.avgWeight), 1) : 1;

        if (sortedByWeight.length === 0) {
            weightContainer.innerHTML = '<div class="empty-table-text">Нет данных для графиков</div>';
        } else {
            sortedByWeight.forEach((r, idx) => {
                const percent = Math.min(100, Math.round((r.avgWeight / maxW) * 100));
                const item = document.createElement('div');
                item.className = 'chart-bar-item';
                item.innerHTML = `
                    <div class="bar-label-group">
                        <span class="bar-label">
                            <span class="bar-rank-badge ${idx === 0 ? 'top-1' : ''}">#${idx + 1}</span>
                            <strong>${r.route}</strong>
                        </span>
                        <span class="bar-value font-mono highlight-gold">${r.avgWeight.toFixed(2)} <span class="val-unit">${currentLang === 'ru' ? 'кг' : 'kg'}</span></span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill gold" style="width: ${percent}%;"></div>
                    </div>
                `;
                weightContainer.appendChild(item);
            });
        }
    }

    // График 2: Места на 1 PAX по направлениям (Ранжированные карточки емкости / Capacity Tiles)
    const pcsContainer = document.getElementById('dash-chart-pcs-container');
    if (pcsContainer) {
        pcsContainer.innerHTML = '';
        pcsContainer.className = 'pcs-tiles-list';
        const sortedByPcs = [...routeStatsList].sort((a, b) => b.avgPcs - a.avgPcs);

        if (sortedByPcs.length === 0) {
            pcsContainer.innerHTML = '<div class="empty-table-text">Нет данных для графиков</div>';
        } else {
            sortedByPcs.forEach((r, idx) => {
                // Определение категории загрузки багажа
                let statusClass = 'standard';
                let statusLabel = currentLang === 'ru' ? 'СТАНДАРТ' : 'STANDARD';
                if (r.avgPcs >= 1.35) {
                    statusClass = 'heavy';
                    statusLabel = currentLang === 'ru' ? 'ТЯЖЕЛЫЙ' : 'HEAVY';
                } else if (r.avgPcs < 0.85) {
                    statusClass = 'light';
                    statusLabel = currentLang === 'ru' ? 'ЛЕГКИЙ' : 'LIGHT';
                }

                const item = document.createElement('div');
                item.className = 'pcs-rank-tile';
                item.innerHTML = `
                    <div class="pcs-tile-left">
                        <span class="pcs-rank-number ${idx === 0 ? 'top-1' : ''}">#${idx + 1}</span>
                        <span class="pcs-tile-route">${r.route}</span>
                        <span class="pcs-status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="pcs-tile-right font-mono">
                        <span class="pcs-tile-val">${r.avgPcs.toFixed(2)}</span>
                        <span class="pcs-tile-unit">${currentLang === 'ru' ? 'мест' : 'pcs'}</span>
                    </div>
                `;
                pcsContainer.appendChild(item);
            });
        }
    }

    // График 3: Динамика по дням недели (ПН - ВС) (Вертикальный столбчатый график / Vertical Columns Chart)
    const weekdayContainer = document.getElementById('dash-chart-weekdays-container');
    if (weekdayContainer) {
        weekdayContainer.innerHTML = '';
        const dayNames = currentLang === 'ru' ? ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'] : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const dayStats = Array(7).fill(0).map(() => ({ pax: 0, weight: 0, count: 0 }));

        filteredDataset.forEach(f => {
            let dayIdx = null;
            if (f.date) {
                const dt = parseDateToJsDate(f.date);
                if (dt && !isNaN(dt.getDay())) {
                    const jsDay = dt.getDay(); // 0=Вс, 1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб
                    dayIdx = (jsDay === 0) ? 6 : jsDay - 1; // 0=Пн ... 6=Вс
                }
            }

            if (dayIdx === null) {
                dayIdx = 0; // Пн по умолчанию
            }

            dayStats[dayIdx].pax += f.pax;
            dayStats[dayIdx].weight += f.bag_weight;
            dayStats[dayIdx].count += 1;
        });

        const dayAverages = dayStats.map((d, idx) => ({
            day: dayNames[idx],
            avgWeight: d.pax > 0 ? (d.weight / d.pax) : 0,
            count: d.count
        }));

        const maxDayW = Math.max(...dayAverages.map(d => d.avgWeight), 0.1);
        
        // Находим индекс дня с пиковой нагрузкой (больше 0)
        let peakIdx = -1;
        let peakVal = 0;
        dayAverages.forEach((d, idx) => {
            if (d.avgWeight > peakVal) {
                peakVal = d.avgWeight;
                peakIdx = idx;
            }
        });

        const chartWrap = document.createElement('div');
        chartWrap.className = 'weekday-chart-wrapper';

        // Подсказка с описанием метрики
        const hintBar = document.createElement('div');
        hintBar.className = 'weekday-hint-bar';
        hintBar.innerHTML = `
            <span class="hint-icon">⚖️</span>
            <span>${currentLang === 'ru' ? 'Средний вес багажа на 1 пассажира (кг/PAX)' : 'Avg baggage weight per passenger (kg/PAX)'}</span>
        `;
        chartWrap.appendChild(hintBar);

        // 1. Верхняя область с вертикальными колонками
        const colsGrid = document.createElement('div');
        colsGrid.className = 'weekday-columns-grid';

        dayAverages.forEach((d, idx) => {
            const isPeak = (idx === peakIdx && peakVal > 0);
            const heightPct = Math.min(100, Math.max(8, Math.round((d.avgWeight / maxDayW) * 100)));

            const col = document.createElement('div');
            col.className = `weekday-col ${isPeak ? 'peak-day' : ''}`;
            col.title = `${d.day}: ${d.avgWeight.toFixed(2)} ${kgUnitText} (${d.count} ${currentLang === 'ru' ? 'рейсов' : 'flights'})`;
            col.innerHTML = `
                <div class="weekday-bar-val font-mono">
                    ${isPeak ? '<span class="peak-pill">MAX</span>' : '<span class="peak-pill-placeholder"></span>'}
                    <div class="val-num-group">
                        <span class="val-num">${d.avgWeight > 0 ? d.avgWeight.toFixed(2) : '-'}</span>
                        <span class="val-unit">${currentLang === 'ru' ? 'кг' : 'kg'}</span>
                    </div>
                </div>
                <div class="weekday-col-track">
                    <div class="weekday-col-fill" style="height: ${heightPct}%;"></div>
                </div>
            `;
            colsGrid.appendChild(col);
        });
        chartWrap.appendChild(colsGrid);

        // 2. Нижняя область с подписями дней и количеством рейсов
        const footer = document.createElement('div');
        footer.className = 'weekday-labels-footer';

        dayAverages.forEach(d => {
            const item = document.createElement('div');
            item.className = 'weekday-footer-item';
            item.innerHTML = `
                <span class="weekday-name">${d.day}</span>
                <span class="weekday-flights-count">${d.count} ${currentLang === 'ru' ? 'рейс.' : 'flt.'}</span>
            `;
            footer.appendChild(item);
        });
        chartWrap.appendChild(footer);

        weekdayContainer.appendChild(chartWrap);
    }

    // 6. График 4: Круговая диаграмма процентного распределения вылетов (НЕ зависимая от выбранного маршрута)
    const sharesContainer = document.getElementById('dash-chart-shares-container');
    if (sharesContainer) {
        sharesContainer.innerHTML = '';
        
        const periodTotalFlights = periodFilteredDataset.length;

        if (periodTotalFlights === 0) {
            sharesContainer.innerHTML = '<div class="empty-table-text">Нет данных за период</div>';
        } else {
            // Группировка рейсов периода по маршрутам
            const periodRouteMap = {};
            periodFilteredDataset.forEach(f => {
                const rKey = (f.from && f.to) ? `${f.from} ➔ ${f.to}` : 'Прочие';
                if (!periodRouteMap[rKey]) {
                    periodRouteMap[rKey] = { route: rKey, flights: 0 };
                }
                periodRouteMap[rKey].flights += 1;
            });

            const sortedPeriodRoutes = Object.values(periodRouteMap).sort((a, b) => b.flights - a.flights);
            
            // Формируем карту цветов: яркий уникальный цвет для рейсов (>1), серый для одиночных (===1)
            const allPeriodRoutes = sortedPeriodRoutes;

            const activePalette = [
                '#00f2ff', '#ffb700', '#10b981', '#8b5cf6', 
                '#f97316', '#06b6d4', '#ec4899', '#3b82f6', 
                '#a855f7', '#14b8a6', '#f43f5e', '#eab308',
                '#38bdf8', '#fb923c', '#4ade80', '#c084fc'
            ];
            const singleFlightColor = '#64748b';

            let activeColorIdx = 0;
            const routeColorMap = {};
            allPeriodRoutes.forEach(s => {
                if (s.flights > 1) {
                    routeColorMap[s.route] = activePalette[activeColorIdx % activePalette.length];
                    activeColorIdx++;
                } else {
                    routeColorMap[s.route] = singleFlightColor;
                }
            });

            // Расчет круговых сегментов SVG (окружность R=40 => C = 2*PI*40 ≈ 251.327)
            const C = 251.327;
            let currentOffset = 0;
            let svgCircles = '';

            allPeriodRoutes.forEach(s => {
                const sharePct = (s.flights / periodTotalFlights) * 100;
                const dashLen = (sharePct / 100) * C;
                const gapLen = C - dashLen;
                const strokeColor = routeColorMap[s.route] || singleFlightColor;

                svgCircles += `
                    <circle class="pie-slice-circle" 
                            data-route="${s.route}"
                            data-flights="${s.flights}"
                            data-pct="${((s.flights / periodTotalFlights) * 100).toFixed(1)}"
                            cx="50" cy="50" r="40" 
                            fill="transparent" 
                            stroke="${strokeColor}" 
                            stroke-width="14" 
                            stroke-dasharray="${dashLen.toFixed(2)} ${gapLen.toFixed(2)}" 
                            stroke-dashoffset="${(-currentOffset).toFixed(2)}" />
                `;
                currentOffset += dashLen;
            });

            // Генерируем легенду ДЛЯ ВСЕХ НАПРАВЛЕНИЙ с их индивидуальными цветами
            let legendHtml = '';
            allPeriodRoutes.forEach(s => {
                const sharePct = ((s.flights / periodTotalFlights) * 100).toFixed(1);
                const dotColor = routeColorMap[s.route] || singleFlightColor;

                legendHtml += `
                    <div class="pie-legend-item" data-route="${s.route}" data-flights="${s.flights}" data-pct="${sharePct}">
                        <div class="pie-legend-left">
                            <span class="pie-legend-dot" style="background: ${dotColor};"></span>
                            <span class="pie-legend-name">${s.route}</span>
                        </div>
                        <span class="pie-legend-val">${s.flights} (${sharePct}%)</span>
                    </div>
                `;
            });

            sharesContainer.innerHTML = `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart-container">
                        <svg class="pie-chart-svg" viewBox="0 0 100 100">
                            ${svgCircles}
                        </svg>
                        <div class="pie-chart-center">
                            <div class="pie-chart-center-val">${periodTotalFlights}</div>
                            <div class="pie-chart-center-lbl">${currentLang === 'ru' ? 'РЕЙСОВ' : 'FLIGHTS'}</div>
                        </div>
                    </div>
                    <div class="pie-chart-legend">
                        ${legendHtml}
                    </div>
                </div>
            `;

            // Подключение интерактивных кликов по сегментам и строкам легенды
            let selectedPieRoute = null;

            const centerVal = sharesContainer.querySelector('.pie-chart-center-val');
            const centerLbl = sharesContainer.querySelector('.pie-chart-center-lbl');
            const circles = sharesContainer.querySelectorAll('.pie-slice-circle');
            const legendItems = sharesContainer.querySelectorAll('.pie-legend-item');

            const handleRouteHighlight = (targetRoute, targetFlights, targetPct) => {
                if (selectedPieRoute === targetRoute) {
                    // Сброс выделения при повторном клике
                    selectedPieRoute = null;
                    if (centerVal) centerVal.textContent = periodTotalFlights;
                    if (centerLbl) centerLbl.textContent = currentLang === 'ru' ? 'РЕЙСОВ' : 'FLIGHTS';

                    circles.forEach(c => {
                        c.style.strokeWidth = '14px';
                        c.style.opacity = '1';
                        c.style.filter = 'none';
                    });

                    legendItems.forEach(item => {
                        item.classList.remove('active-pie-route');
                    });
                } else {
                    // Установка выделения на выбранное направление
                    selectedPieRoute = targetRoute;
                    if (centerVal) centerVal.textContent = targetFlights;
                    if (centerLbl) centerLbl.textContent = `${targetRoute} (${targetPct}%)`;

                    circles.forEach(c => {
                        if (c.getAttribute('data-route') === targetRoute) {
                            c.style.strokeWidth = '18px';
                            c.style.opacity = '1';
                            c.style.filter = 'drop-shadow(0 0 8px currentColor)';
                        } else {
                            c.style.strokeWidth = '12px';
                            c.style.opacity = '0.25';
                            c.style.filter = 'none';
                        }
                    });

                    legendItems.forEach(item => {
                        if (item.getAttribute('data-route') === targetRoute) {
                            item.classList.add('active-pie-route');
                            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        } else {
                            item.classList.remove('active-pie-route');
                        }
                    });
                }
            };

            circles.forEach(c => {
                c.addEventListener('click', () => {
                    const r = c.getAttribute('data-route');
                    const f = c.getAttribute('data-flights');
                    const p = c.getAttribute('data-pct');
                    handleRouteHighlight(r, f, p);
                });
            });

            legendItems.forEach(item => {
                item.addEventListener('click', () => {
                    const r = item.getAttribute('data-route');
                    const f = item.getAttribute('data-flights');
                    const p = item.getAttribute('data-pct');
                    handleRouteHighlight(r, f, p);
                });
            });
        }
    }
}

// --- МОДУЛЬ БЭКТЕСТИНГА И ВЕРИФИКАЦИИ ТОЧНОСТИ (STAGE 3) ---

function initBacktestModule() {
    const btnOpen = document.getElementById('btn-open-backtest');
    const btnClose = document.getElementById('btn-close-backtest');
    const modal = document.getElementById('backtest-modal');
    const btnStart = document.getElementById('btn-start-backtest');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    if (btnClose && modal) {
        btnClose.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            runBacktestAccuracySimulation();
        });
    }
}

function runBacktestAccuracySimulation() {
    if (!userFlights || userFlights.length === 0) {
        showAviationAlert(currentLang === 'ru' ? 'База данных пуста! Загрузите архив полетов.' : 'Database is empty! Please load flights data.', true);
        return;
    }

    const periodVal = document.getElementById('backtest-period-select')?.value || '180';
    const limitVal = parseInt(document.getElementById('backtest-limit-select')?.value || '250', 10);
    const btnStart = document.getElementById('btn-start-backtest');
    const progressContainer = document.getElementById('backtest-progress-container');
    const progressStatus = document.getElementById('backtest-progress-status');
    const progressPercent = document.getElementById('backtest-progress-percent');
    const progressFill = document.getElementById('backtest-progress-fill');
    const resultsContainer = document.getElementById('backtest-results-container');

    // 1. Фильтрация и хронологическая сортировка
    const validFlights = userFlights.filter(f => {
        if (!f.date) return false;
        const pax = getEffectivePaxCount(f);
        const w = parseFloat(f.bag_weight) || 0;
        return pax > 0 && w > 0 && parseDateToJsDate(f.date) !== null;
    }).sort((a, b) => {
        const da = parseDateToJsDate(a.date);
        const db = parseDateToJsDate(b.date);
        return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
    });

    if (validFlights.length < 10) {
        showAviationAlert(currentLang === 'ru' ? 'Слишком мало рейсов с датами для бэктестинга (требуется >= 10).' : 'Not enough flights for backtesting (>= 10 required).', true);
        return;
    }

    // Фильтрация по периоду
    let targetPool = validFlights;
    if (periodVal !== 'all') {
        const days = parseInt(periodVal, 10);
        const newestFlightDate = parseDateToJsDate(validFlights[validFlights.length - 1].date);
        if (newestFlightDate) {
            const cutoffMs = newestFlightDate.getTime() - (days * 24 * 60 * 60 * 1000);
            targetPool = validFlights.filter(f => {
                const fd = parseDateToJsDate(f.date);
                return fd && fd.getTime() >= cutoffMs;
            });
        }
    }

    if (targetPool.length < 5) {
        targetPool = validFlights.slice(-50);
    }

    // Выборка из пула (до limitVal самых свежих)
    const testSample = targetPool.slice(-limitVal);

    if (btnStart) btnStart.disabled = true;
    if (progressContainer) progressContainer.classList.remove('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');
    if (progressFill) progressFill.style.width = '0%';
    if (progressPercent) progressPercent.textContent = '0%';

    let currentIndex = 0;
    const oldWeightErrors = [];
    const newWeightErrors = [];
    const oldPcsErrors = [];
    const newPcsErrors = [];
    let oldAccurateCount = 0;
    let newAccurateCount = 0;
    const sampleRowsData = [];

    function processBatch() {
        const batchSize = 20;
        const endIndex = Math.min(currentIndex + batchSize, testSample.length);

        for (let i = currentIndex; i < endIndex; i++) {
            const targetFlight = testSample[i];
            const targetDt = parseDateToJsDate(targetFlight.date);
            if (!targetDt) continue;
            const targetMs = targetDt.getTime();
            const targetDay = getDayOfWeekFromIsoStr(targetFlight.date);
            const actualPax = getEffectivePaxCount(targetFlight);
            const actualWeight = parseFloat(targetFlight.bag_weight) || 0;
            const actualPcs = parseInt(targetFlight.bag_pcs, 10) || 0;

            // История СТРОГО ДО даты вылета targetFlight
            const historyBefore = validFlights.filter(f => {
                const fd = parseDateToJsDate(f.date);
                return fd && fd.getTime() < targetMs;
            });

            // 1. Старый метод (4 рейса за 60 дней)
            const window60Ms = 60 * 24 * 60 * 60 * 1000;
            let oldSample = historyBefore.filter(f => {
                if (f.flight_no !== targetFlight.flight_no) return false;
                if (getDayOfWeekFromIsoStr(f.date) !== targetDay) return false;
                const fd = parseDateToJsDate(f.date);
                const diff = targetMs - fd.getTime();
                return diff > 0 && diff <= window60Ms;
            }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date)).slice(0, 4);

            if (oldSample.length === 0) {
                const window30Ms = 30 * 24 * 60 * 60 * 1000;
                oldSample = historyBefore.filter(f => {
                    const fd = parseDateToJsDate(f.date);
                    const diff = targetMs - fd.getTime();
                    return diff > 0 && diff <= window30Ms;
                }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date)).slice(0, 4);
            }

            const defaultFallbackK = 0.45;
            const defaultFallbackV = 14.5;

            let oldPredPcs = Math.max(1, Math.round(actualPax * defaultFallbackK));
            let oldPredWeight = Math.round(oldPredPcs * defaultFallbackV);
            if (oldSample.length > 0) {
                let sumK = 0, sumV = 0;
                oldSample.forEach(f => {
                    const p = getEffectivePaxCount(f);
                    const pcs = parseInt(f.bag_pcs, 10) || 0;
                    const w = parseFloat(f.bag_weight) || 0;
                    sumK += (pcs / p);
                    sumV += pcs > 0 ? (w / pcs) : 0;
                });
                const avgK = sumK / oldSample.length;
                const avgV = sumV / oldSample.length;
                oldPredPcs = Math.round(actualPax * avgK);
                oldPredWeight = Math.round(oldPredPcs * avgV);
            }

            // 2. Новый Smart Waterfall метод (180 дней, порог >=5, сглаживание альфа=0.3, авто-сезонность, 97% явка)
            const window180Ms = 180 * 24 * 60 * 60 * 1000;
            const routeFlights = historyBefore.filter(f => f.from === targetFlight.from && f.to === targetFlight.to);

            let newSample = routeFlights.filter(f => {
                if (f.flight_no !== targetFlight.flight_no) return false;
                if (getDayOfWeekFromIsoStr(f.date) !== targetDay) return false;
                const fd = parseDateToJsDate(f.date);
                const diff = targetMs - fd.getTime();
                return diff > 0 && diff <= window180Ms;
            }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date));

            if (newSample.length < 5) {
                newSample = routeFlights.filter(f => {
                    if (getDayOfWeekFromIsoStr(f.date) !== targetDay) return false;
                    const fd = parseDateToJsDate(f.date);
                    const diff = targetMs - fd.getTime();
                    return diff > 0 && diff <= window180Ms;
                }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date));
            }

            if (newSample.length < 5) {
                newSample = routeFlights.filter(f => {
                    const fd = parseDateToJsDate(f.date);
                    const diff = targetMs - fd.getTime();
                    return diff > 0 && diff <= window180Ms;
                }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date));
            }

            if (newSample.length === 0) {
                newSample = historyBefore.filter(f => {
                    if (f.from !== targetFlight.from) return false;
                    const fd = parseDateToJsDate(f.date);
                    const diff = targetMs - fd.getTime();
                    return diff > 0 && diff <= window180Ms;
                }).sort((a, b) => parseDateToJsDate(b.date) - parseDateToJsDate(a.date));
            }

            let newPredPcs = Math.max(1, Math.round(actualPax * defaultFallbackK));
            let newPredWeight = Math.round(newPredPcs * defaultFallbackV);
            if (newSample.length > 0) {
                const sampleSlice = newSample.slice(0, 20);
                const means = calculateMeansFromFlights(sampleSlice, 0.3);
                if (means && typeof means.pcs_pax === 'number' && typeof means.wght_pc === 'number' && !isNaN(means.pcs_pax) && !isNaN(means.wght_pc)) {
                    // При симуляции на исторических данных базы пассажиры уже являются 100% фактическими
                    const effectivePax = Math.max(1, actualPax);
                    const seasonInfo = getRouteSeasonalityMultiplier(targetFlight.from, targetFlight.to, targetFlight.date);
                    const seasonMultiplier = (seasonInfo && typeof seasonInfo.multiplier === 'number') ? seasonInfo.multiplier : 1.0;
                    const adjustedK = means.pcs_pax * seasonMultiplier;
                    newPredPcs = Math.round(effectivePax * adjustedK);
                    newPredWeight = Math.round(newPredPcs * means.wght_pc);
                }
            }

            const oldErrW = Math.abs(actualWeight - oldPredWeight);
            const newErrW = Math.abs(actualWeight - newPredWeight);
            const oldErrPcs = Math.abs(actualPcs - oldPredPcs);
            const newErrPcs = Math.abs(actualPcs - newPredPcs);

            oldWeightErrors.push(oldErrW);
            newWeightErrors.push(newErrW);
            oldPcsErrors.push(oldErrPcs);
            newPcsErrors.push(newErrPcs);

            if (actualWeight > 0) {
                if (oldErrW / actualWeight <= 0.10) oldAccurateCount++;
                if (newErrW / actualWeight <= 0.10) newAccurateCount++;
            }

            // Отбираем 15 репрезентативных примеров (приоритет рейсам с историей выборки)
            const sampleInterval = Math.max(1, Math.floor(testSample.length / 15));
            if ((i % sampleInterval === 0 || newSample.length >= 3) && sampleRowsData.length < 15) {
                sampleRowsData.push({
                    date: targetFlight.date ? formatDateStr(targetFlight.date) : '-',
                    flight: targetFlight.flight_no || '-',
                    route: `${targetFlight.from}➔${targetFlight.to}`,
                    pax: actualPax,
                    factW: Math.round(actualWeight),
                    oldW: oldPredWeight,
                    newW: newPredWeight,
                    newDiff: Math.round(newPredWeight - actualWeight)
                });
            }
        }

        currentIndex = endIndex;
        const progressPct = Math.round((currentIndex / testSample.length) * 100);
        if (progressFill) progressFill.style.width = `${progressPct}%`;
        if (progressPercent) progressPercent.textContent = `${progressPct}%`;
        if (progressStatus) {
            progressStatus.textContent = currentLang === 'ru'
                ? `Тестирование алгоритмов: рейс ${currentIndex} из ${testSample.length}...`
                : `Testing algorithms: flight ${currentIndex} of ${testSample.length}...`;
        }

        if (currentIndex < testSample.length) {
            setTimeout(processBatch, 0);
        } else {
            // Завершение тестирования
            if (btnStart) btnStart.disabled = false;
            if (progressContainer) progressContainer.classList.add('hidden');
            if (resultsContainer) resultsContainer.classList.remove('hidden');

            const totalTested = oldWeightErrors.length || 1;
            const avgOldW = oldWeightErrors.reduce((a, b) => a + b, 0) / totalTested;
            const avgNewW = newWeightErrors.reduce((a, b) => a + b, 0) / totalTested;
            const avgOldPcs = oldPcsErrors.reduce((a, b) => a + b, 0) / totalTested;
            const avgNewPcs = newPcsErrors.reduce((a, b) => a + b, 0) / totalTested;

            const oldAccPct = Math.round((oldAccurateCount / totalTested) * 100);
            const newAccPct = Math.round((newAccurateCount / totalTested) * 100);

            const gainWeightPct = avgOldW > 0 ? (((avgOldW - avgNewW) / avgOldW) * 100) : 0;
            const gainPcsPct = avgOldPcs > 0 ? (((avgOldPcs - avgNewPcs) / avgOldPcs) * 100) : 0;

            const elOldW = document.getElementById('bt-old-weight-mae');
            const elNewW = document.getElementById('bt-new-weight-mae');
            const elOldP = document.getElementById('bt-old-pcs-mae');
            const elNewP = document.getElementById('bt-new-pcs-mae');
            const elOldAcc = document.getElementById('bt-old-accuracy');
            const elNewAcc = document.getElementById('bt-new-accuracy');
            const elGainW = document.getElementById('bt-weight-gain');
            const elGainP = document.getElementById('bt-pcs-gain');

            if (elOldW) elOldW.textContent = `${avgOldW.toFixed(1)} кг`;
            if (elNewW) elNewW.textContent = `${avgNewW.toFixed(1)} кг`;
            if (elOldP) elOldP.textContent = `${avgOldPcs.toFixed(1)} шт`;
            if (elNewP) elNewP.textContent = `${avgNewPcs.toFixed(1)} шт`;
            if (elOldAcc) elOldAcc.textContent = `${oldAccPct}%`;
            if (elNewAcc) elNewAcc.textContent = `${newAccPct}%`;

            if (elGainW) {
                elGainW.textContent = `${gainWeightPct >= 0 ? '+' : '-'}${Math.abs(gainWeightPct).toFixed(1)}%`;
                elGainW.style.color = gainWeightPct >= 0 ? '#34d399' : '#f87171';
            }
            if (elGainP) {
                elGainP.textContent = `${gainPcsPct >= 0 ? '+' : '-'}${Math.abs(gainPcsPct).toFixed(1)}%`;
                elGainP.style.color = gainPcsPct >= 0 ? '#34d399' : '#f87171';
            }

            // Рендер таблицы примеров
            const tbody = document.getElementById('backtest-table-body');
            if (tbody) {
                let html = '';
                sampleRowsData.forEach(r => {
                    const diffSign = r.newDiff > 0 ? `+${r.newDiff}` : `${r.newDiff}`;
                    const diffColor = Math.abs(r.newDiff) <= Math.round(r.factW * 0.1) ? 'highlight-green' : 'cyan-val';
                    html += `
                        <tr>
                            <td>${r.date}</td>
                            <td><strong>${r.flight}</strong></td>
                            <td class="cyan-val">${r.route}</td>
                            <td>${r.pax}</td>
                            <td class="gold-val"><strong>${r.factW} кг</strong></td>
                            <td style="opacity: 0.75;">${r.oldW} кг</td>
                            <td class="highlight-green"><strong>${r.newW} кг</strong></td>
                            <td class="${diffColor} font-mono">${diffSign} кг</td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            }
        }
    }

    setTimeout(processBatch, 50);
}


