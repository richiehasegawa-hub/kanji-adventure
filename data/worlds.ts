/**
 * ものがたり漢字アドベンチャー — ワールド・エピソード・クイズデータ
 * data/worlds.ts  （MVP_コンテンツ仕様書.xlsx 準拠版）
 *
 * storyText: プレーンテキスト。対象漢字は「漢字（よみ）」形式。
 *            それ以外の漢字はひらがなで記述。
 * quizzes:   正解は options[0] に格納。表示時にシャッフル。
 */

// ============================================================
// 型定義
// ============================================================

export interface KanjiData {
  character: string;
  readings: string[];          // 訓読み優先
  examples: string;            // 例文（訓読み文脈）
  exampleOnyomi?: string;      // 例文（音読み文脈）
  hint?: string;               // 覚えコツ（ひらがな・やさしい表現）
}

export interface QuizQuestion {
  id: string;
  type: "4択" | "絵合わせ" | "穴埋め";
  targetKanji: string;
  question: string;
  options: [string, string, string, string]; // options[0] = 正解
  hint: string;
}

export interface EpisodeData {
  id: string;
  number: number;
  title: string;
  titleKana?: string;          // タイトルのよみかた（むずかしいばあいに表示）
  emoji: string;
  storyText: string;           // プレーンテキスト（対象漢字のみ漢字表記）
  kanjiList: KanjiData[];
  quizzes: QuizQuestion[];
}

export interface WorldData {
  id: string;
  name: string;
  reading: string;
  emoji: string;
  cardColor: string;
  episodes: EpisodeData[];
}

// ============================================================
// ワールドデータ
// ============================================================

export const WORLDS: WorldData[] = [

  // ══════════════════════════════════════════
  // 🏭 ワールド1：からくり工場
  // ══════════════════════════════════════════
  {
    id: "kojou",
    name: "からくり工場",
    reading: "こうじょう",
    emoji: "🏭",
    cardColor: "#4CAF50",
    episodes: [
      {
        id: "ep1",
        number: 1,
        title: "リクの工場見学",
        titleKana: "リクのこうじょうけんがく",
        emoji: "🏭",
        storyText:
          "かんじたんてい・リクは、ふしぎな「からくりこうじょう」にまよいこんだ。\n" +
          "いりぐちのちずには、からだのパーツをあらわすかんじがかかれていた。\n\n" +
          "「手（て）・足（あし）・目（め）・口（くち）・耳（みみ）……ぼく、これぜんぶしってるぞ！」\n\n" +
          "リクがかんじをよむと、てつのとびらがゆっくりあいた。\n" +
          "さあ、からくりこうじょうのぼうけんがはじまる！",
        kanjiList: [
          {
            character: "手", readings: ["て", "しゅ"],
            examples: "リクの手（て）にちずがあった",
            exampleOnyomi: "握手（あくしゅ）しようよ！",
            hint: "5ほんゆびをひろげた形",
          },
          {
            character: "足", readings: ["あし", "そく"],
            examples: "足（あし）がしびれた！",
            exampleOnyomi: "遠足（えんそく）、はやくこないかな",
            hint: "「口」のしたに「止」——あしがとまっている形",
          },
          {
            character: "目", readings: ["め", "もく"],
            examples: "リクは目（め）をかがやかせた",
            exampleOnyomi: "今日（きょう）の目標（もくひょう）は50てん",
            hint: "よこむきの目のかたち",
          },
          {
            character: "口", readings: ["くち", "こう"],
            examples: "おおきな口（くち）でわらった",
            exampleOnyomi: "入口（いりぐち）はどこ？",
            hint: "くちの形そのまま□",
          },
          {
            character: "耳", readings: ["みみ", "じ"],
            examples: "耳（みみ）をすましてみて",
            exampleOnyomi: "耳鼻科（じびか）にいった",
            hint: "耳（みみ）のかたちをしている",
          },
        ],
        quizzes: [
          {
            id: "q1", type: "4択", targetKanji: "手",
            question: "「手」の訓読みはどれ？",
            options: ["て", "しゅ", "あし", "め"],
            hint: "手はてのひらの「て」！",
          },
          {
            id: "q2", type: "絵合わせ", targetKanji: "足",
            question: "足をつかうスポーツはどれ？",
            options: ["サッカー", "しょうぎ", "どくしょ", "りょうり"],
            hint: "足（あし）でボールをけるよ！",
          },
          {
            id: "q3", type: "穴埋め", targetKanji: "目",
            question: "きょうの（　）ひょうは50てんだ",
            options: ["目", "木", "土", "石"],
            hint: "もくひょうの「もく」は目！",
          },
        ],
      },

      {
        id: "ep2",
        number: 2,
        title: "謎の機械を直せ！",
        titleKana: "なぞのきかいをなおせ！",
        emoji: "⚙️",
        storyText:
          "こうじょうのおくに、おおきなきかいがあった。\n" +
          "でも、きかいはとまっていた。\n\n" +
          "せっけいずにはこうかいてある。\n" +
          "「力（ちから）をいれて、火（ひ）をつけて、水（みず）でひやす。気（き）あいじゅうぶんでやれ！」\n\n" +
          "「わかった！ぼくがなおしてやる！」\n" +
          "リクは心（こころ）をきめた。",
        kanjiList: [
          {
            character: "力", readings: ["ちから", "りょく"],
            examples: "リクは力（ちから）をあわせた",
            exampleOnyomi: "ぼくはぜんりょく（全力）でがんばった！",
            hint: "うでのきんにくをよこからみた形",
          },
          {
            character: "火", readings: ["ひ", "か"],
            examples: "キャンプの火（ひ）をみた",
            exampleOnyomi: "なつの花火（はなび）がきれいだった",
            hint: "ほのおがゆらめく形",
          },
          {
            character: "水", readings: ["みず", "すい"],
            examples: "水（みず）たまりでジャンプした！",
            exampleOnyomi: "プールで水泳（すいえい）したい！",
            hint: "ながれる水（みず）の形",
          },
          {
            character: "心", readings: ["こころ", "しん"],
            examples: "ぼくは心（こころ）がどきどきした",
            exampleOnyomi: "心配（しんぱい）しないで",
            hint: "しんぞうのドキドキの形",
          },
          {
            character: "気", readings: ["き", "け"],
            examples: "気（き）ぶんさいこうだ！",
            exampleOnyomi: "今日（きょう）の天気（てんき）は？",
            hint: "くうき・げんき…みえないエネルギー",
          },
        ],
        quizzes: [
          {
            id: "q4", type: "4択", targetKanji: "力",
            question: "「全力」の読み方は？",
            options: ["ぜんりょく", "ぜんりき", "ぜんき", "ぜんか"],
            hint: "力はりょく・りきどっちもよめるよ",
          },
          {
            id: "q5", type: "4択", targetKanji: "火",
            question: "花火の「か」はどの漢字？",
            options: ["火", "花", "下", "日"],
            hint: "火が「か」とよむ。花火は火のはな！",
          },
          {
            id: "q6", type: "穴埋め", targetKanji: "気",
            question: "きょうは（　）ぶんさいこうだ！",
            options: ["気", "木", "水", "心"],
            hint: "きぶんの「き」は気！",
          },
        ],
      },

      {
        id: "ep3",
        number: 3,
        title: "発明コンテスト！",
        titleKana: "はつめいコンテスト！",
        emoji: "🤖",
        storyText:
          "はつめいコンテストのひがやってきた！\n" +
          "リクのロボットのざいりょうラベルにはかんじがいっぱい。\n\n" +
          "「木（き）・土（つち）・金（かね）・石（いし）・光（ひかり）……ぜんぶよめるぞ！」\n\n" +
          "ロボットは光（ひかり）をはなちながら、ゆっくりとうごきはじめた。\n" +
          "「やったー！いっとうしょうだ！！」",
        kanjiList: [
          {
            character: "木", readings: ["き", "もく"],
            examples: "おおきな木（き）にのぼった",
            exampleOnyomi: "木曜（もくよう）はサッカーのひ",
            hint: "みきとえだとねがある木（き）の形",
          },
          {
            character: "土", readings: ["つち", "ど"],
            examples: "土（つち）をほってむしをさがした",
            exampleOnyomi: "土曜（どよう）はLEGOのひ",
            hint: "じめんからくさがはえている形",
          },
          {
            character: "金", readings: ["かね", "きん"],
            examples: "お金（かね）をためてる",
            exampleOnyomi: "金曜（きんよう）はすきなひ",
            hint: "かがやくきんぞくのかたちだよ",
          },
          {
            character: "石", readings: ["いし", "せき"],
            examples: "すごい石（いし）をみつけた！",
            exampleOnyomi: "岩石（がんせき）をあつめてる",
            hint: "がけからおちたいわの形",
          },
          {
            character: "光", readings: ["ひかり", "こう"],
            examples: "ほしの光（ひかり）がきれいだった",
            exampleOnyomi: "光線（こうせん）みたいにはやい！",
            hint: "ほのおのうえにひとがたっている形",
          },
        ],
        quizzes: [
          {
            id: "q7", type: "4択", targetKanji: "木",
            question: "木曜日の「もく」はどの漢字？",
            options: ["木", "目", "口", "月"],
            hint: "木（き）＝もくようび",
          },
          {
            id: "q8", type: "4択", targetKanji: "金",
            question: "お金の「かね」はどの漢字？",
            options: ["金", "銀", "石", "力"],
            hint: "金（きん）はかがやくもの",
          },
          {
            id: "q9", type: "絵合わせ", targetKanji: "光",
            question: "「光」のことばはどれ？",
            options: ["光線", "木曜", "足音", "友だち"],
            hint: "こうせんは光（ひかり）のせん！",
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // 🗺️ ワールド2：謎の古地図
  // ══════════════════════════════════════════
  {
    id: "furumappu",
    name: "謎の古地図",
    reading: "なぞのふるちず",
    emoji: "🗺️",
    cardColor: "#FF9800",
    episodes: [
      {
        id: "ep4",
        number: 1,
        title: "古地図の秘密",
        titleKana: "ふるちずのひみつ",
        emoji: "🗺️",
        storyText:
          "リクはふるいちずをみつけた。\n" +
          "ちずには、山（やま）・川（かわ）・森（もり）・道（みち）・町（まち）のかんじがいっぱい。\n\n" +
          "「この道（みち）をたどれば、たからがみつかるぞ！」\n\n" +
          "リクはおおきな山（やま）をこえ、きれいな川（かわ）をわたり、森（もり）のなかへすすんだ。\n" +
          "むこうに町（まち）のあかりがみえてきた。",
        kanjiList: [
          {
            character: "山", readings: ["やま", "さん"],
            examples: "おじいちゃんと山（やま）にのぼったよ",
            exampleOnyomi: "富士山（ふじさん）にいきたい！",
            hint: "3つのとがったやまのかたち",
          },
          {
            character: "川", readings: ["かわ", "せん"],
            examples: "川（かわ）でいしをなげた",
            exampleOnyomi: "河川（かせん）こうじをしていた",
            hint: "3ほんのながれが川（かわ）をあらわしている",
          },
          {
            character: "森", readings: ["もり", "しん"],
            examples: "おおきな森（もり）にはいった",
            exampleOnyomi: "森林（しんりん）がひろがる",
            hint: "き3ほんあつまって森（もり）",
          },
          {
            character: "道", readings: ["みち", "どう"],
            examples: "この道（みち）をあるく",
            exampleOnyomi: "道路（どうろ）があたらしくなった",
            hint: "あたまをもってすすむ形",
          },
          {
            character: "町", readings: ["まち", "ちょう"],
            examples: "町（まち）のあかりがみえた",
            exampleOnyomi: "町内（ちょうない）のぎょうじ",
            hint: "たんぼとみちがまじわるばしょ",
          },
        ],
        quizzes: [
          {
            id: "q10", type: "4択", targetKanji: "山",
            question: "「山」の音読みは？",
            options: ["さん", "やま", "かわ", "もり"],
            hint: "富士山（ふじさん）の「さん」がおんよみ",
          },
          {
            id: "q11", type: "4択", targetKanji: "道",
            question: "「道路」の読み方は？",
            options: ["どうろ", "みちろ", "どろ", "みちみち"],
            hint: "道（みち）＝どう とよむ",
          },
          {
            id: "q12", type: "穴埋め", targetKanji: "川",
            question: "川（かわ）で（　）をなげた",
            options: ["石", "花", "火", "目"],
            hint: "いしをかわになげるよ！",
          },
        ],
      },

      {
        id: "ep5",
        number: 2,
        title: "東西南北の旅",
        titleKana: "とうざいなんぼくのたび",
        emoji: "🧭",
        storyText:
          "ちずには4つのほうがくがかかれていた。\n" +
          "「東（ひがし）・西（にし）・南（みなみ）・北（きた）……どこへいけばいい？」\n\n" +
          "リクは空（そら）をみあげた。\n" +
          "たいようは東（ひがし）からのぼって西（にし）にしずむ。\n\n" +
          "「北（きた）のほしがゴールだ！」\n" +
          "リクはあおい空（そら）のした、北（きた）をめざしてはしった。",
        kanjiList: [
          {
            character: "東", readings: ["ひがし", "とう"],
            examples: "東（ひがし）のそらがあかるい",
            exampleOnyomi: "東京（とうきょう）にいきたい！",
            hint: "きにたいようがかかっている形",
          },
          {
            character: "西", readings: ["にし", "せい"],
            examples: "西（にし）のそらがあかい",
            exampleOnyomi: "関西（かんさい）のりょうりがすき",
            hint: "とりがすにかえるゆうがたの形",
          },
          {
            character: "南", readings: ["みなみ", "なん"],
            examples: "南（みなみ）のしまにいきたい",
            exampleOnyomi: "南極（なんきょく）にペンギンがいる",
            hint: "みなみのあたたかいイメージ",
          },
          {
            character: "北", readings: ["きた", "ほく"],
            examples: "北（きた）のそらにほしがひかる",
            exampleOnyomi: "北極（ほっきょく）グマをみた",
            hint: "ふたりがせなかをむけている形",
          },
          {
            character: "空", readings: ["そら", "くう"],
            examples: "あおい空（そら）をみあげた",
            exampleOnyomi: "空港（くうこう）でおみおくり",
            hint: "ひろいそら・なにもないくうかん",
          },
        ],
        quizzes: [
          {
            id: "q13", type: "4択", targetKanji: "東",
            question: "東京の「とう」はどの漢字？",
            options: ["東", "冬", "道", "土"],
            hint: "東（ひがし）＝とうきょうの「とう」",
          },
          {
            id: "q14", type: "4択", targetKanji: "北",
            question: "北極（ほっきょく）グマはどのほうがく？",
            options: ["北", "南", "東", "西"],
            hint: "きた＝ほく",
          },
          {
            id: "q15", type: "絵合わせ", targetKanji: "南",
            question: "南（みなみ）のうみのいきものはどれ？",
            options: ["サメ", "ペンギン", "ライオン", "キリン"],
            hint: "みなみのうみにはサメがいるよ！",
          },
        ],
      },

      {
        id: "ep6",
        number: 3,
        title: "光の洞窟と星の宝",
        titleKana: "ひかりのどうくつとほしのたから",
        emoji: "✨",
        storyText:
          "どうくつのなかは、光（ひかり）できらきらかがやいていた。\n" +
          "「天（てん）のかわみたいだ……」\n\n" +
          "そとでは雨（あめ）と風（かぜ）がはげしくなってきた。\n" +
          "でもてんじょうには星（ほし）のような光（ひかり）がいっぱい。\n\n" +
          "「これがたからだ！星（ほし）の光（ひかり）がここをまもっていたんだ。」\n" +
          "リクは風（かぜ）のおとをきながら、たからに手をのばした。",
        kanjiList: [
          {
            character: "光", readings: ["ひかり", "こう"],
            examples: "ほしの光（ひかり）がきれいだった",
            exampleOnyomi: "光線（こうせん）みたいにはやい！",
            hint: "ほのおのうえにひとがたっている形",
          },
          {
            character: "星", readings: ["ほし", "せい"],
            examples: "よぞらに星（ほし）がひかる",
            exampleOnyomi: "流れ星（ながれぼし）をみた",
            hint: "「日」と「生」——たいようのようにひかる",
          },
          {
            character: "風", readings: ["かぜ", "ふう"],
            examples: "風（かぜ）がつよくふいた",
            exampleOnyomi: "台風（たいふう）がきた！",
            hint: "むしがかぜにとばされている形",
          },
          {
            character: "雨", readings: ["あめ", "う"],
            examples: "雨（あめ）がふってきた",
            exampleOnyomi: "大雨（おおあめ）にちゅうい",
            hint: "くもからしずくがおちている形",
          },
          {
            character: "天", readings: ["てん", "あま"],
            examples: "あおいそらのことを天（てん）ともいう",
            exampleOnyomi: "今日（きょう）の天気（てんき）は？",
            hint: "「大」のうえにいっぽんせん——そらのうえ",
          },
        ],
        quizzes: [
          {
            id: "q16", type: "4択", targetKanji: "風",
            question: "台風（たいふう）の「ふう」はどの漢字？",
            options: ["風", "雨", "天", "空"],
            hint: "たいふうの「ふう」は風（かぜ）！",
          },
          {
            id: "q17", type: "4択", targetKanji: "星",
            question: "よぞらにかがやく「ほし」はどの漢字？",
            options: ["星", "石", "光", "天"],
            hint: "ほしがながれるよ！",
          },
          {
            id: "q18", type: "穴埋め", targetKanji: "天",
            question: "きょうの（　）気ははれ",
            options: ["天", "空", "雨", "月"],
            hint: "てんきの「てん」は天！",
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // 🌟 ワールド3：星の図書館
  // ══════════════════════════════════════════
  {
    id: "hoshi",
    name: "星の図書館",
    reading: "ほしのとしょかん",
    emoji: "🌟",
    cardColor: "#9C27B0",
    episodes: [
      {
        id: "ep7",
        number: 1,
        title: "魔法の図書館",
        titleKana: "まほうのとしょかん",
        emoji: "📚",
        storyText:
          "ほしのとしょかんについたリク。\n" +
          "ほんがどこまでもつづいている。\n\n" +
          "「ここではほんを読（よ）んで、ことばを聞（き）いて、じぶんで書（か）くんだよ。」\n" +
          "としょかんのようせいが言（い）った。\n\n" +
          "リクはめをおおきく見（み）ひらいた。\n" +
          "「ぼく、ぜんぶ読（よ）んでみる！」",
        kanjiList: [
          {
            character: "読", readings: ["よ", "どく"],
            examples: "ほんを読（よ）むのがすき",
            exampleOnyomi: "読書（どくしょ）のじかん",
            hint: "ことばをうる→よむ",
          },
          {
            character: "書", readings: ["か", "しょ"],
            examples: "てがみを書（か）いた",
            exampleOnyomi: "読書（どくしょ）・書道（しょどう）",
            hint: "ふででかいている形",
          },
          {
            character: "聞", readings: ["き", "ぶん"],
            examples: "みみをすまして聞（き）く",
            exampleOnyomi: "新聞（しんぶん）をよむ",
            hint: "もんからみをのりだして聞（き）いている形",
          },
          {
            character: "見", readings: ["み", "けん"],
            examples: "とおくまで見（み）える",
            exampleOnyomi: "見学（けんがく）にいく",
            hint: "めのうえにひとがのってみている形",
          },
          {
            character: "言", readings: ["い", "げん"],
            examples: "ありがとうと言（い）った",
            exampleOnyomi: "言語（げんご）をまなぶ",
            hint: "くちからことばがでている形",
          },
        ],
        quizzes: [
          {
            id: "q19", type: "4択", targetKanji: "読",
            question: "「読書」の読み方は？",
            options: ["どくしょ", "よみしょ", "どくかき", "よみかき"],
            hint: "読（よ）む＝どく",
          },
          {
            id: "q20", type: "4択", targetKanji: "聞",
            question: "「新聞」の「ぶん」はどの漢字？",
            options: ["聞", "文", "分", "問"],
            hint: "しんぶんの「ぶん」は聞！",
          },
          {
            id: "q21", type: "穴埋め", targetKanji: "見",
            question: "こうじょう（　）がくにいきたい",
            options: ["見", "目", "聞", "書"],
            hint: "けんがくの「けん」は見！",
          },
        ],
      },

      {
        id: "ep8",
        number: 2,
        title: "言葉の迷宮",
        titleKana: "ことばのめいきゅう",
        emoji: "💬",
        storyText:
          "めいきゅうのとびらには、ことばのなぞなぞが。\n" +
          "「友（とも）だちと話（はなし）すとき、いちばんたいせつなものは？」\n\n" +
          "リクは気（き）あいをいれてかんがえた。\n" +
          "「名（な）まえをちゃんとよぶこと！ぼくの名（な）はリクだ！」\n\n" +
          "とびらがあいた。友（とも）だちのかたりがめいきゅうにひびいた。",
        kanjiList: [
          {
            character: "話", readings: ["はなし", "わ"],
            examples: "ともだちと話（はなし）した",
            exampleOnyomi: "電話（でんわ）ではなす",
            hint: "ことばがしたからあふれでる形",
          },
          {
            character: "語", readings: ["かた", "ご"],
            examples: "ものがたりが好き（すき）",
            exampleOnyomi: "日本語（にほんご）をまなぶ",
            hint: "ことば＋わたし→かたる",
          },
          {
            character: "名", readings: ["なまえ", "めい"],
            examples: "ぼくの名前（なまえ）はリク",
            exampleOnyomi: "有名（ゆうめい）なひとをしってる？",
            hint: "ゆうぐれになをよぶ形",
          },
          {
            character: "友", readings: ["とも", "ゆう"],
            examples: "友（とも）だちがきた",
            exampleOnyomi: "友情（ゆうじょう）がたいじ",
            hint: "てとてがたすけあっている形",
          },
          {
            character: "気", readings: ["き", "け"],
            examples: "気（き）ぶんさいこうだ！",
            exampleOnyomi: "今日（きょう）の天気（てんき）はいい",
            hint: "くうき・げんき…みえないエネルギー",
          },
        ],
        quizzes: [
          {
            id: "q22", type: "4択", targetKanji: "話",
            question: "でんわの「わ」はどの漢字？",
            options: ["話", "語", "言", "名"],
            hint: "でんわの「わ」は話（はなし）！",
          },
          {
            id: "q23", type: "4択", targetKanji: "友",
            question: "「友情」の読み方は？",
            options: ["ゆうじょう", "ともじょう", "ゆうき", "ともだち"],
            hint: "友（とも）＝ゆう",
          },
          {
            id: "q24", type: "穴埋め", targetKanji: "名",
            question: "ぼくの（　）まえはリクだ",
            options: ["名", "明", "目", "月"],
            hint: "なまえの「な」は名！",
          },
        ],
      },

      {
        id: "ep9",
        number: 3,
        title: "最後の扉と帰り道",
        titleKana: "さいごのとびらとかえりみち",
        emoji: "🚪",
        storyText:
          "今（いま）、リクはさいごのとびらのまえにたっていた。\n\n" +
          "「今（いま）まで来（き）たみち、行（い）ったばしょ、帰（かえ）ったきおく……」\n\n" +
          "時（とき）がとまったようなきがした。\n" +
          "でもとびらはあき、ひかりがさしてきた。\n\n" +
          "「帰（かえ）ろう！ぼくのぼうけんはまだおわらない！」\n" +
          "リクは今（いま）、つぎの時（とき）へむかってはしりだした。",
        kanjiList: [
          {
            character: "今", readings: ["いま", "こん"],
            examples: "今（いま）すぐいく！",
            exampleOnyomi: "今週（こんしゅう）はいそがしい",
            hint: "いま・このしゅんかんのイメージ",
          },
          {
            character: "来", readings: ["き", "らい"],
            examples: "ともだちが来（き）た！",
            exampleOnyomi: "来週（らいしゅう）またあおう",
            hint: "きのうえからくる→くる",
          },
          {
            character: "行", readings: ["い", "こう"],
            examples: "ぼうけんに行（い）く！",
            exampleOnyomi: "旅行（りょこう）にいく",
            hint: "じゅうじろをひとがあるく形",
          },
          {
            character: "帰", readings: ["かえ", "き"],
            examples: "はやくいえに帰（かえ）りたい",
            exampleOnyomi: "帰国（きこく）した",
            hint: "ほうきでみちをはいてかえる",
          },
          {
            character: "時", readings: ["とき", "じ"],
            examples: "時（とき）がたつ",
            exampleOnyomi: "時間（じかん）をたいせつに",
            hint: "「日」と「寺」——じかんのながれ",
          },
        ],
        quizzes: [
          {
            id: "q25", type: "4択", targetKanji: "今",
            question: "「今週」の読み方は？",
            options: ["こんしゅう", "いましゅう", "こんしゅ", "きしゅう"],
            hint: "今（いま）＝こん",
          },
          {
            id: "q26", type: "4択", targetKanji: "行",
            question: "りょこうの「こう」はどの漢字？",
            options: ["行", "来", "帰", "今"],
            hint: "りょこうの「こう」は行（い）く！",
          },
          {
            id: "q27", type: "穴埋め", targetKanji: "帰",
            question: "はやくいえに（　）りたい",
            options: ["帰", "来", "行", "時"],
            hint: "かえるの「かえ」は帰！",
          },
        ],
      },
    ],
  },
];
