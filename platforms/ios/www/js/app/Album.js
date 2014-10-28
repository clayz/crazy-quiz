CQ.Album = {
    TOTAL_ALBUM: 1,

    Category: {
        Film: { id: 1, name: '映画' },
        Series: { id: 2, name: 'ドラマ' },
        Cartoon: { id: 3, name: '漫画' },
        Entertainer: { id: 4, name: '芸能人' },
        Brand: { id: 5, name: 'ブランド' },
        Celebrity: { id: 6, name: '有名人' },
        Game: { id: 7, name: 'ゲーム' },
        Sports: { id: 8, name: 'スポーツ' },
        Animation: { id: 9, name: 'アニメ' },
        Building: { id: 10, name: '建物' },
        History: { id: 11, name: '歴史' },
        Place: { id: 12, name: '場所' },
        Geography: { id: 13, name: '地理' }
    },

    AnswerType: {
        English: { id: 1, pictures: [] },
        Kanji: { id: 2, pictures: [] },
        Hiragana: { id: 3, pictures: [] },
        Katakana: { id: 4, pictures: [] },
        Mix: { id: 5, pictures: [] }
    },

    init: function() {
        if (CQ.dev) {
            // this logic is only been used for generating picture answers during development
            for (var i = 1; i <= 6; i++)
                for (var j = 0; j < 20; j++) {
                    var picture = this.getPicture(this.getPictureId(i, j));

                    if (CQ.Album.AnswerType.English === picture.type)
                        CQ.Album.AnswerType.English.pictures.push(picture);
                    else if (CQ.Album.AnswerType.Kanji === picture.type)
                        CQ.Album.AnswerType.Kanji.pictures.push(picture);
                    else if (CQ.Album.AnswerType.Hiragana === picture.type)
                        CQ.Album.AnswerType.Hiragana.pictures.push(picture);
                    else if (CQ.Album.AnswerType.Katakana === picture.type)
                        CQ.Album.AnswerType.Katakana.pictures.push(picture);
                    else {
                        // does not support auto generate answers for this type
                    }
                }
        }
    },

    getAlbum: function(id) {
        switch (id) {
            case CQ.Album.Default.id:
                return CQ.Album.Default;
            default:
                return null;
        }
    },

    isAlbumLocked: function(id) {
        return id > CQ.Datastore.Picture.getLastAlbumId();
    },

    unlockAlbum: function(albumId, isPurchase) {
        console.log('Unlock album {0}, is purchase: {1}'.format(albumId, isPurchase));
        var lastAlbumId = CQ.Datastore.Picture.getLastAlbumId();

        if (albumId > this.TOTAL_ALBUM) {
            console.info('There is no such album to unlock.');
            return false;
        } else if (albumId != (lastAlbumId + 1)) {
            console.error('Incorrect unlock album {0}, last album {1}'.format(albumId, lastAlbumId));
            return false;
        }

        if (!isPurchase || CQ.Currency.consume(CQ.Currency.Consume.UnlockAlbum, albumId)) {
            CQ.Datastore.Picture.setLastAlbumId(albumId);
            CQ.Page.Main.refreshCurrency();
            CQ.Page.Main.enableAlbum(albumId);

            if (isPurchase) CQ.GA.track(CQ.GA.Album.UnlockPurchase, CQ.GA.Album.UnlockPurchase.label.format(albumId));
            else CQ.GA.track(CQ.GA.Album.Unlock, CQ.GA.Album.Unlock.label.format(albumId));

            return true;
        } else return false;
    },

    getLevel: function(level) {
        return this.levels[level - 1];
    },

    unlockLevel: function(albumId, level, isPurchase) {
        console.log('Unlock album {0} level {1}, is purchase: {2}'.format(albumId, level, isPurchase));
        var lastLevel = CQ.Datastore.Picture.getLastLevel(albumId), album = CQ.Album.getAlbum(albumId);

        if (level > album.levels.length) {
            console.info('There is no such level to unlock.');
            return false;
        } else if (level != (lastLevel + 1)) {
            console.info('Incorrect unlock level {0}, last level {1}'.format(level, lastLevel));
            return false;
        }

        if (!isPurchase || CQ.Currency.consume(CQ.Currency.Consume.UnlockLevel, albumId, level)) {
            CQ.Datastore.Picture.setLastLevel(albumId, level);
            CQ.Page.Main.refreshCurrency();
            CQ.Page.Main.enableLevel(albumId, level);

            if (isPurchase) CQ.GA.track(CQ.GA.Level.UnlockPurchase, CQ.GA.Level.UnlockPurchase.label.format(albumId, level));
            else CQ.GA.track(CQ.GA.Level.Unlock, CQ.GA.Level.Unlock.label.format(albumId, level));

            return true;
        } else return false;
    },

    getPicture: function(id) {
        var levelAndIndex = this.getPictureLevelAndIndex(id);
        return this.levels[levelAndIndex.level - 1].pictures[levelAndIndex.index];
    },

    getPictureId: function(level, index) {
        return parseInt(level.toString() + (index >= 10 ? index : '0' + index));
    },

    getPicturePath: function(id) {
        return '{0}{1}.jpg'.format(this.path, id);
    },

    getPictureLevelAndIndex: function(id) {
        var idString = id.toString();
        return {
            level: idString.charAt(0),
            index: parseInt(idString.substring(1, 3), 10)
        }
    },

    getFirstPicture: function(level) {
        return this.levels[level - 1].pictures[0];
    },

    getNextPicture: function(id) {
        var levelAndIndex = this.getPictureLevelAndIndex(id), level = this.levels[levelAndIndex.level - 1];
        return levelAndIndex.index >= level.pictures.length ? null : level.pictures[levelAndIndex.index + 1];
    },

    getAlternativeAnswerChars: function(pictureId, length) {
        var picture = this.getPicture(pictureId),
            chars = picture.name.split(''),
            answerIds = picture.answers,
            remainingChars = length - picture.name.length,
            alternativeAnswers = [pictureId];

        if (answerIds.length > 0) {
            // has alternative answers defined
            for (var i = 0; (remainingChars > 0) && (answerIds.length > i); i++) {
                var alternativePictureId = answerIds[i],
                    alternativeChars = this.getPicture(alternativePictureId).name;

                if (remainingChars > alternativeChars.length) {
                    chars = chars.concat(alternativeChars.split(''));
                    alternativeAnswers.push(alternativePictureId);
                    remainingChars -= alternativeChars.length;
                } else if (remainingChars == alternativeChars.length) {
                    chars = chars.concat(alternativeChars.split(''));
                    alternativeAnswers.push(alternativePictureId);
                    break;
                } else {
                    chars = chars.concat(alternativeChars.split('').slice(0, remainingChars));
                    break;
                }
            }
        } else {
            // no alternative answers, generate random chars
            while (remainingChars > 0) {
                // generate random picture id which does not been used
                var candidates = null;

                if (CQ.Album.AnswerType.English === picture.type)
                    candidates = CQ.Album.AnswerType.English.pictures;
                else if (CQ.Album.AnswerType.Kanji === picture.type)
                    candidates = CQ.Album.AnswerType.Kanji.pictures
                        .concat(CQ.Album.AnswerType.Mix.pictures);
                else if (CQ.Album.AnswerType.Katakana === picture.type)
                    candidates = CQ.Album.AnswerType.Katakana.pictures
                        .concat(CQ.Album.AnswerType.Mix.pictures);
                else
                    candidates = CQ.Album.AnswerType.Kanji.pictures
                        .concat(CQ.Album.AnswerType.Hiragana.pictures)
                        .concat(CQ.Album.AnswerType.Katakana.pictures)
                        .concat(CQ.Album.AnswerType.Mix.pictures);

                var randomIndex = Math.floor(Math.random() * candidates.length);
                console.info("Candidates length: {0}, Random index: {1}".format(candidates.length, randomIndex));
                var randomPicture = candidates[randomIndex], randomId = randomPicture.id;

                if ($.inArray(randomId, alternativeAnswers) == -1) {
                    var randomName = this.getPicture(randomId).name;

                    // get characters from random picture name
                    if (remainingChars > randomName.length) {
                        chars = chars.concat(randomName.split(''));
                        alternativeAnswers.push(randomId);
                        remainingChars -= randomName.length;
                    } else if (remainingChars == randomName.length) {
                        chars = chars.concat(randomName.split(''));
                        alternativeAnswers.push(randomId);
                        break;
                    } else {
                        chars = chars.concat(randomName.split('').slice(0, remainingChars));
                        break;
                    }
                }
            }
        }

        console.log('Generated random chars from pictures: ' + alternativeAnswers.join(', '));

        return {
            chars: CQ.Album.shuffle(chars),
            alternativeAnswers: alternativeAnswers
        };
    },

    shuffle: function(arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
};

CQ.Album.Default = {
    id: 1,
    name: 'クラシック',
    path: 'img/album/default/',
    active: true,

    levels: [
        {
            level: 1,
            name: 'ステージ１',
            pictures: [
                { id: 100, name: 'ロナウド', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [506, 618, 104, 319, 315, 203], text_answers:["ペレ", "ジーコ", "ドゥンガ", "マラドーナ", "ロマリオ", "クライフ", "ネドベド"] },
                { id: 101, name: '通天閣', category: CQ.Album.Category.Building, type: CQ.Album.AnswerType.Kanji, answers: [612, 611, 216, 609, 414, 604, 614, 607, 403], text_answers:["普信閣", "三十三間堂", "二条城", "寺田屋", "明治神宮", "福岡タワー", "太陽の塔"] },
                { id: 102, name: 'ワンピース', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Katakana, answers: [311, 404, 517, 100, 413], text_answers:["ドラゴンボール", "バガボンド", "パタリロ！", "アパート", "イベント"] },
                { id: 103, name: 'ジョーダン', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [506, 513, 100, 315, 417], text_answers:["ラッセル", "チェンバレン", "ドレクスラー", "バード", "トーマス", "ユリ"] },
                { id: 104, name: 'シドニー', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [212, 613, 407, 400, 519, 210], text_answers:["シカゴ", "モスクワ", "ロサンゼルス", "メルボルン", "ジャカルタ", "ダラス"] },
                { id: 105, name: 'スーパーマリオ', category: CQ.Album.Category.Game, type: CQ.Album.AnswerType.Katakana, answers: [100, 300, 112, 407, 212], text_answers:["アレックス", "ルイージ", "ワリオ", "キャサリン"] },
                { id: 106, name: 'SMAP', category: CQ.Album.Category.Entertainer, type: CQ.Album.AnswerType.English, answers: [515, 304, 406, 119, 108, 307, 214], text_answers:["Glay", "V6", "Perfume", "Kalafina", "Flower"] },
                { id: 107, name: 'アバター', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [314, 401, 504, 603, 610, 415], text_answers:["クレイジーズ", "ザ・セル", "ノウイング", "パンドラム", "スーパーマン"] },
                { id: 108, name: 'CHANEL', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [307, 214, 304, 515, 200, 206], text_answers:["Hermes", "Cartier", "Tiffany", "Prada"] },
                { id: 109, name: 'FACEBOOK', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [307, 119, 304, 206, 515, 106], text_answers:["Google", "Yahoo", "Livedoor", "fc2"] },
                { id: 110, name: 'ジョブズ', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [217, 318, 310, 416, 300, 501, 208], text_answers:["ゲイツ", "ライナス", "エリソン", "バフェット", "ソロス", "ページ", "バルマー"] },
                { id: 111, name: 'オバマ', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [519, 505, 116, 512, 113, 610], text_answers:["ブッシュ", "クリントン", "レーガン", "ルーズベルト", "フーバー", "テイラー"] },
                { id: 112, name: 'アメリ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [405, 619, 107, 613, 519, 501, 313, 509], text_answers:["ルーシー", "マレフィセント", "ロボコップ", "アイアンマン", "アウトロー"] },
                { id: 113, name: 'ロレックス', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [502, 417, 313, 210, 509], text_answers:["バーバリー", "オメガ", "ヴェルサーチ", "ティファニー", "モンブラン"] },
                { id: 114, name: 'ジョニーデップ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [318, 501, 400, 407, 511], text_answers:["トムクルーズ", "ザックエフロン", "ジャッキーチェン", "レノ"] },
                { id: 115, name: '相棒', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.Kanji, answers: [207, 403, 604, 101, 607, 419, 218, 609], text_answers:["探偵物語", "月下の棋士", "浪花少年探偵団", "生存", "人間の証明", "名探偵の掟"] },
                { id: 116, name: 'トロイ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [410, 100, 417, 306, 105], text_answers:["アイオロス", "ヘクトル", "ケンタウロス", "キルケ", "ヘロとレアンドロス"] },
                { id: 117, name: 'ロッテリア', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [407, 618, 100, 319, 208], text_answers:["モスバーガー", "マクドナルド", "ビッグボーイ", "ウェンディーズ"] },
                { id: 118, name: '千と千尋の神隠し', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Mix, answers: [418, 301, 412, 614, 617], text_answers:["耳をすませば", "もののけ姫", "魔女の宅急便", "猫の恩返し"] },
                { id: 119, name: 'SONY', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [214, 206, 109, 515, 307], text_answers:["SEGA", "Nintendo", "CAPCOM", "Eighting"] }
            ]
        },
        {
            level: 2,
            name: 'ステージ２',
            pictures: [
                { id: 200, name: 'YAHOO', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [109, 406, 304, 214, 206, 108], text_answers:["RAKUTEN", "NAVER", "DMM", "HULU", "KAKAKU"] },
                { id: 201, name: 'ガンダム', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Katakana, answers: [509, 113, 211, 312, 309, 112], text_answers:["セクサロイド", "トランスフォーマー", "ガンヘッド", "ダイアクロン"] },
                { id: 202, name: 'スターバックス', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [111, 513, 506, 511, 315, 502], text_answers:["ベローチェ", "サンマルク", "ドトール", "ベックス", "エッセンス"] },
                { id: 203, name: 'アマゾン', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [504, 313, 405, 610, 103, 110], text_answers:["オイシックス", "イーベイ", "ナニデル", "グーオク", "ノジマオンライン"] },
                { id: 204, name: 'うまい棒', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [418, 205, 414, 500, 615, 410], text_answers:["ダース", "パイの実", "コアラのマーチ", "ミルキー", "小梅", "ピザポテト"] },
                { id: 205, name: 'マイケル', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [618, 213, 104, 316, 113, 217, 511], text_answers:["シンプソン", "スウィフト", "ダイレクション", "ビーバー", "ウィーザー"] },
                { id: 206, name: 'ADIDAS', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [214, 307, 109, 119, 200], text_answers:["NIKE", "PUMA", "MIZUNO", "UMBRO", "KAPPA"] },
                { id: 207, name: '浅田真央', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Kanji, answers: [414, 609, 611, 115, 600, 514, 218, 607, 101], text_answers:["川端絵美", "太田渉子", "伊藤有希", "安藤美姫", "村上佳菜子", "中野友加里"] },
                { id: 208, name: 'ワシントン', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [309, 418, 509, 603, 113], text_answers:["ニューヨーク", "ヒューストン", "サンアントニオ", "サンディエゴ"] },
                { id: 209, name: 'タイタニック', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [404, 103, 415, 312, 116], text_answers:["ゴースト", "シザーハンズ", "ボディガード", "ホリデイ", "ショコラ"] },
                { id: 210, name: 'リンカーン', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [519, 613, 508, 512, 516, 416], text_answers:["ジェファーソン", "モンロー", "ジャクソン", "テイラー", "フィルモア"] },
                { id: 211, name: 'アンダーワールド', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [210, 415, 407, 117], text_answers:["パニック・ゲーム", "デイ・ウォッチ", "ブラッドレイン"] },
                { id: 212, name: 'ポケモン', category: CQ.Album.Category.Game, type: CQ.Album.AnswerType.Katakana, answers: [412, 501, 210, 318, 315, 213], text_answers:["フリープレイ", "ハンターアイランド", "マジモン", "マイ・ドラゴン"] },
                { id: 213, name: 'ロンドン', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [517, 519, 203, 404, 501, 513], text_answers:["リーズ", "ブリストル", "ミラノ", "パレルモ", "ジェノバ", "パドヴァ", "ケルン"] },
                { id: 214, name: 'WENDYS', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [515, 307, 119, 109, 106, 304], text_answers:["SUBWAY", "ARBYS", "PIZZAHUT", "DENNYS"] },
                { id: 215, name: '金閣寺', category: CQ.Album.Category.Building, type: CQ.Album.AnswerType.Kanji, answers: [101, 607, 218, 207, 403, 219, 609], text_answers:["大福寺", "浅草寺", "玉川大師玉眞院", "永平寺", "大阪城", "由岐神社", "赤山禅院"] },
                { id: 216, name: '貞子', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Kanji, answers: [218, 514, 101, 215, 609, 414, 219, 207], text_answers:["富江", "伽椰子", "花子", "沙織", "優子", "美々子", "明日香", "由美", "奈津子", "美咲", "李麗", "結衣"] },
                { id: 217, name: 'ブラジル', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [314, 610, 114, 603, 110], text_answers:["フランス", "コロンビア", "アーセナル", "リヴァプール", "ドルトムント"] },
                { id: 218, name: '半沢直樹', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.Kanji, answers: [600, 514, 403, 101, 219, 414, 614, 612], text_answers:["沫嶋黎士", "湯川学", "羽生晴樹", "弾間龍二", "南雲準", "加賀恭一郎", "今岡勝"] },
                { id: 219, name: '歌舞伎町一番街', category: CQ.Album.Category.Place, type: CQ.Album.AnswerType.Kanji, answers: [419, 215, 600, 609, 414, 614, 607, 115], text_answers:["高円寺純情商店街", "吉祥寺サンロード", "渋谷センター街"] }
            ]
        },
        {
            level: 3,
            name: 'ステージ３',
            pictures: [
                { id: 300, name: 'スカイツリー', category: CQ.Album.Category.Building, type: CQ.Album.AnswerType.Katakana, answers: [412, 519, 310, 104, 601, 410, 201], text_answers:["ゴールドタワー", "クロスランドタワー", "天王スカイタワー"] },
                { id: 301, name: 'モスバーガー', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [400, 117, 404, 401, 602], text_answers:["ディコス", "ベッカーズ", "サンテオレ", "サブウェイ", "ジョリビー"] },
                { id: 302, name: 'ドラえもん', category: CQ.Album.Category.Cartoon, type: CQ.Album.AnswerType.Mix, answers: [618, 500, 317, 418, 204, 301], text_answers:["あさりちゃん", "うしおととら", "ちはやふる", "ぬらりひょんの孫"] },
                { id: 303, name: 'ソフトバンク犬', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [114, 315, 107, 317, 410], text_answers:["ハチ", "まさお君", "カイ", "シンシア", "きな子", "サーブ", "ゼウス", "シロ"] },
                { id: 304, name: 'LV', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [200, 406, 109, 307, 515, 214], text_answers:["Celine", "Chaumet", "tiffany", "Burberry"] },
                { id: 305, name: 'サウスパーク', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Katakana, answers: [504, 309, 209, 217, 210], text_answers:["ザ・シンプソンズ‎", "トムとジェリー‎", "パックワールド", "モーターシティ"] },
                { id: 306, name: 'アイアンマン', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [316, 301, 418, 312, 211], text_answers:["マイティ・ソー", "ゴーストライダー", "スパイダーマン", "ブレイド"] },
                { id: 307, name: 'BMW', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [406, 106, 200, 108, 119, 206], text_answers:["KTM", "AMG", "FERRARI", "AUDI", "BRABUS", "SRT", "HONDA"] },
                { id: 308, name: '忍者タートルズ', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Mix, answers: [504, 215, 216, 607, 403, 512, 312], text_answers:["タイムコップ", "マスク", "時空を超えた戦い", "暗黒魔王の陰謀"] },
                { id: 309, name: 'キャデラック', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [301, 512, 412, 205, 316, 100], text_answers:["ランボルギーニ", "マセラティ", "ジャガー", "ベントレー", "レクサス"] },
                { id: 310, name: 'ユベントス', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [316, 105, 418, 208, 311], text_answers:["バルセロナ", "トッテナム", "チェルシー", "ベンフィカ", "アーセナル"] },
                { id: 311, name: 'アイスエイジ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [102, 501, 202, 418, 111], text_answers:["シンデレラ", "スピリット", "ダイナソー", "チキンラン", "ターザン"] },
                { id: 312, name: 'ビルゲイツ', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [500, 117, 407, 509, 513, 511], text_answers:["レディーガガ", "トムクルーズ", "ジャックマン", "ティムバートン"] },
                { id: 313, name: 'ヴェネツィア', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [412, 100, 212, 306, 117, 104], text_answers:["パリ", "ロンドン", "バルセロナ", "サンフランシスコ", "マラケシュ"] },
                { id: 314, name: 'インセプション', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [318, 205, 103, 208, 519, 111], text_answers:["フィラデルフィア", "トータルリコール", "スノーホワイト"] },
                { id: 315, name: 'マツコデラックス', category: CQ.Album.Category.Entertainer, type: CQ.Album.AnswerType.Katakana, answers: [410, 401, 618, 117, 212, 112, 217], text_answers:["ローラ", "エリーローズ", "マドモアゼルユリア", "ゆってぃ"] },
                { id: 316, name: 'マクドナルド', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [500, 309, 610, 111, 405, 116], text_answers:["ロッテリア", "ピザハット", "タコベル", "ピザーラ", "サブウェイ"] },
                { id: 317, name: 'バルセロナ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [315, 615, 509, 103, 117, 112], text_answers:["セルティック", "ラツィオ", "セビージャ", "プルゼニ", "ゲンク", "グレミオ"] },
                { id: 318, name: 'バーミヤン', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [208, 512, 502, 615, 311, 409, 114], text_answers:["チャイナ", "ラーメン力", "メゾンドユーロン", "シェフス", "カリュウ"] },
                { id: 319, name: 'マリーキュリー', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [317, 203, 314, 315, 610], text_answers:["イーダタッケ", "モードスライ", "リーゼマイトナー", "オテルマ"] }
            ]
        },
        {
            level: 4,
            name: 'ステージ４',
            pictures: [
                { id: 400, name: 'アインシュタイン', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [501, 319, 315, 313], text_answers:["オイラー", "フレミング", "マクスウェル", "ガウス", "デカルト"] },
                { id: 401, name: 'ソニック', category: CQ.Album.Category.Game, type: CQ.Album.AnswerType.Katakana, answers: [409, 506, 407, 317, 300], text_answers:["シグルト", "クライス", "メイソン", "ヨッシー", "フォックス", "ピカチュウ"] },
                { id: 402, name: 'ちびまる子ちゃん', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Mix, answers: [209, 506, 615, 201, 104, 204], text_answers:["時をかける少女", "蛍火の杜へ", "耳をすませば", "空の境界"] },
                { id: 403, name: '野口英世', category: CQ.Album.Category.History, type: CQ.Album.AnswerType.Kanji, answers: [607, 115, 419, 604, 414, 101, 614, 514, 308], text_answers:["大久保利通", "伊藤博文", "夏目漱石", "井上靖", "大江健三郎", "阿倍仲麻呂"] },
                { id: 404, name: 'ハーゲンダッツ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [117, 603, 113, 610, 506, 317], text_answers:["シャトレーゼ", "クラシエフーズ", "タカナシ", "セリアロイル"] },
                { id: 405, name: 'ローマ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [117, 502, 107, 205, 314, 506], text_answers:["バーリ", "パレルモ", "トリエステ", "ボローニャ", "トリエステ", "カターニア"] },
                { id: 406, name: 'LOST', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.English, answers: [109, 307, 200, 206, 108], text_answers:["Gotham", "Arrow", "Homeland", "Revenge"] },
                { id: 407, name: 'フォレストガンプ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [619, 416, 417, 410, 117], text_answers:["アベンジャーズ", "タイム", "プロメテウス", "バトルシップ"] },
                { id: 408, name: 'もののけ姫', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Mix, answers: [516, 104, 500, 207, 609, 607, 411], text_answers:["うる星やつら", "はなかっぱ", "とっとこハム太郎", "忍たま乱太郎"] },
                { id: 409, name: 'フェラーリ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [516, 208, 110, 418, 511, 111], text_answers:["リンカーン", "ビュイック", "ポンテアック", "スマート", "シトロエン"] },
                { id: 410, name: 'モスクワ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [205, 415, 110, 111, 107, 516, 511], text_answers:["キンセール", "スプリト", "オビドス", "リヴィウ", "アヴェイロ", "ジローナ"] },
                { id: 411, name: 'すき家', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [419, 100, 601, 217, 417, 611], text_answers:["吉野家", "松屋", "牛丼太郎", "京町桜しずく", "もぐら", "日南市じとっこ組合"] },
                { id: 412, name: 'オレオ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [107, 203, 619, 610, 317, 212, 401], text_answers:["ラングドシャ", "リッツ", "バタークッキー", "ピコラいちご", "プレミアム"] },
                { id: 413, name: 'ニコニコ動画', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [105, 210, 107, 514, 609, 604, 308], text_answers:["なんとか", "にこびで", "ひまわり", "バラエティ", "テレビドガッチ"]},
                { id: 414, name: '花王', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Kanji, answers: [215, 604, 607, 207, 218, 115, 600, 612, 403, 101], text_answers:["貝印", "川島商事", "伊勢藤", "白十字", "永光", "台和", "太洋", "大香", "阪和", "美健", "不二貿易"] },
                { id: 415, name: 'キングコング', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [603, 116, 517, 208, 615, 510], text_answers:["パシフィック・リム", "モスラ", "深海獣レイゴー", "デスカッパ"] },
                { id: 416, name: 'オニール', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [400, 113, 511, 210, 100, 217], text_answers:["チェンバレン", "リード", "ウエスト", "ウォルトン", "ピッペン", "マイカン"] },
                { id: 417, name: 'リオデジャネイロ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [311, 110, 203, 100, 416, 511], text_answers:["サンパウロ", "サンディアゴ", "パタゴニア", "ユングフラウ"] },
                { id: 418, name: 'デビッドベッカム', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [511, 509, 512, 311, 309, 410], text_answers:["ロビーファウラー", "ピータークラウチ", "ダニーミルズ"] },
                { id: 419, name: '羊たちの沈黙', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Kanji, answers: [219, 101, 614, 414, 218, 611], text_answers:["十二人の怒れる男", "評決のとき", "私は告白する", "代理人", "激突"] }
            ]
        },
        {
            level: 5,
            name: 'ステージ５',
            pictures: [
                { id: 500, name: 'アルゼンチン', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [417, 205, 504, 510, 114], text_answers:["インドネシア", "グルジア", "ガイアナ", "グアテマラ", "ニカラグア"] },
                { id: 501, name: 'ナルト', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Katakana, answers: [113, 615, 619, 516, 412, 519, 618, 310], text_answers:["ワンピース", "キャッツアイ", "キングダム", "デスノート", "ヘルプマン!"] },
                { id: 502, name: 'マラドーナ', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Katakana, answers: [410, 506, 114, 111, 113, 416], text_answers:["カニージャ", "バティストゥータ", "ケンペス", "サビオラ", "リケルメ"] },
                { id: 503, name: 'アングリーバード', category: CQ.Album.Category.Game, type: CQ.Album.AnswerType.Katakana, answers: [400, 409, 417, 509], text_answers:["アニマルコレクション", "パタポコアニマル", "ぺそぎん"] },
                { id: 504, name: 'サブウェイ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [310, 315, 107, 116, 519, 501], text_answers:["ジョリビー", "ピザハット", "ビッグボーイ", "タコベル", "サンテオレ"] },
                { id: 505, name: 'スタートレック', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [506, 317, 509, 113, 603, 501], text_answers:["アウトランダー", "ドールハウス", "フラッシュフォワード"] },
                { id: 506, name: 'フレンズ', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.Katakana, answers: [505, 512, 404, 500, 315], text_answers:["プリズンブレイク", "メンタリスト", "キャノンボール", "デクスター"] },
                { id: 507, name: '鉄腕アトム', category: CQ.Album.Category.Cartoon, type: CQ.Album.AnswerType.Mix, answers: [415, 600, 514, 502, 101, 317, 408], text_answers:["名探偵コナン", "金色のガッシュ", "キャプテン翼", "ガラスの仮面"] },
                { id: 508, name: 'シュレック', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [113, 601, 201, 415, 213, 111], text_answers:["クッキーマン", "ピノキオ", "ベンジャミン", "ブラッド", "ガストン"] },
                { id: 509, name: 'イエス', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [316, 313, 300, 407, 412], text_answers:["トラロック", "アナト", "アグニ", "オシリス", "イムホテプ", "ハトホル", "セクメト"] },
                { id: 510, name: 'グラディエーター', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [113, 517, 407, 412, 309], text_answers:["スパルタカス", "クレオパトラ", "ローマン・エンパイア"] },
                { id: 511, name: 'チリ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [100, 504, 113, 116, 508, 110, 401], text_answers:["タイ", "ボリビア", "サモア", "バヌアツ", "ブラジル", "エクアドル", "アルゼンチン"] },
                { id: 512, name: 'マダガスカル', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [112, 418, 212, 409, 213, 618], text_answers:["コルドロン", "シュレック", "バットマン", "ダイナソー", "スマーフ"] },
                { id: 513, name: 'ドバイ', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [508, 602, 417, 205, 519, 317], text_answers:["メッカ", "ニューヨーク", "シカゴ", "クアラルンプール", "アブダビ", "ハノイ"] },
                { id: 514, name: '豐臣秀吉', category: CQ.Album.Category.History, type: CQ.Album.AnswerType.Kanji, answers: [207, 607, 419, 115, 403, 614, 218], text_answers:["織田信長", "石田三成", "上杉謙信", "徳川家康", "武田信玄", "森蘭丸", "北条家"] },
                { id: 515, name: 'AMEBA', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.English, answers: [109, 406, 200, 214, 304, 106], text_answers:["SNOOPY", "PLUTO", "CHIP", "BUSTER", "DALE"] },
                { id: 516, name: 'プレスリー', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [512, 506, 618, 410, 511, 203, 416], text_answers:["アッシャー", "ウィリアムス", "ハンソン", "ボンジョビ", "ヴィントン"] },
                { id: 517, name: 'ロールスロイス', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [516, 412, 217, 506, 418, 519], text_answers:["ベントレー", "ジャガー", "ポンテアック", "シボレー", "ジネッタ"] },
                { id: 518, name: 'COCO壱番屋', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [414, 305, 116, 101, 102, 214], text_answers:["砂の岬", "ボタニカリー", "元祖小いけ", "らっきょ＆Star"] },
                { id: 519, name: 'ブッシュ', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [418, 105, 312, 613, 310], text_answers:["バイデン", "クエール", "モンデール", "ヴルフ", "ルーズベルト", "カーター"] }
            ]
        },
        {
            level: 6,
            name: 'ステージ６',
            pictures: [
                { id: 600, name: '関羽', category: CQ.Album.Category.History, type: CQ.Album.AnswerType.Kanji, answers: [614, 403, 611, 207, 219, 607, 308], text_answers:["張飛", "程普", "李典", "孟達", "許褚", "周瑜", "左慈", "諸葛亮", "公孫瓚", "龐統", "徐晃", "劉備", "于禁"] },
                { id: 601, name: 'クリントン', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [418, 312, 313, 113, 613], text_answers:["プーチン", "メドヴェージェフ", "キャメロン", "ブレア", "サッチャー"] },
                { id: 602, name: 'ロシア', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [412, 410, 110, 500, 202, 603], text_answers:["サンマリノ", "ウクライナ", "スロバキア", "デンマーク", "チェコ", "セルビア"] },
                { id: 603, name: 'ホーキング', category: CQ.Album.Category.Celebrity, type: CQ.Album.AnswerType.Katakana, answers: [313, 212, 618, 410, 513, 613, 506], text_answers:["ルーズベルト", "リーダー", "エジソン", "アインシュタイン", "ガウス"] },
                { id: 604, name: '丸井', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Kanji, answers: [115, 612, 611, 219, 403, 414, 207, 216, 507], text_answers:["三越", "浜屋", "大丸", "西武", "髙島屋", "東急", "川徳", "藤崎", "中合", "八木橋", "京王", "岡島", "井上", "名鉄"] },
                { id: 605, name: '英国王のスピーチ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Mix, answers: [210, 611, 110, 100, 403, 510], text_answers:["チャップリンの独裁者", "大統領の陰謀", "ペリカン文書"] },
                { id: 606, name: 'アナと雪の女王', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Mix, answers: [207, 614, 609, 613, 513, 319, 508], text_answers:["白雪姫", "眠れる森の美女", "ラマになった王様", "ダイナソー"] },
                { id: 607, name: '桜木花道', category: CQ.Album.Category.Animation, type: CQ.Album.AnswerType.Kanji, answers: [414, 219, 215, 101, 419, 611, 616], text_answers:["緑間真太郎", "早川充洋", "武内源太", "高尾和成", "青峰大輝", "長谷川健志"] },
                { id: 608, name: 'セーラームーン', category: CQ.Album.Category.Cartoon, type: CQ.Album.AnswerType.Katakana, answers: [400, 311, 310, 309], text_answers:["ケロケロちゃいむ", "ピグマリオ", "プリパラ", "アオハライド", "コイケヤ"] },
                { id: 609, name: '高知县', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Kanji, answers: [207, 514, 219, 414, 614, 604, 218, 308], text_answers:["長野県", "石川県", "沖縄県", "愛知県", "大阪府", "奈良県", "静岡県", "和歌山県", "富山県"] },
                { id: 610, name: 'プリングス', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [205, 519, 103, 512, 501, 104, 305], text_answers:["カルビー", "ノースカラーズ", "カークランド", "ドリトス"] },
                { id: 611, name: '三丁目の夕日', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Kanji, answers: [218, 215, 612, 609, 419, 216, 614, 115], text_answers:["鬼龍院花子の生涯", "人生劇場", "未完の対局", "トキワ荘の青春"] },
                { id: 612, name: '告白', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Kanji, answers: [101, 115, 604, 216, 419, 600, 219, 207, 414], text_answers:["東京ラブストーリー", "妹よ", "高校教師", "大奥", "流れ星", "もう誰も愛さない"] },
                { id: 613, name: 'グリコ', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Katakana, answers: [312, 310, 602, 102, 619, 315], text_answers:["ウィリーウィンキー", "アリックス", "イートアンド", "イチビキ"] },
                { id: 614, name: '香川真司', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Kanji, answers: [215, 101, 115, 609, 611, 600, 514, 218, 219], text_answers:["川口能活", "中澤佑二", "名波浩", "今野泰幸", "稲本潤一", "加地亮", "三浦知良"] },
                { id: 615, name: 'ガリレオ', category: CQ.Album.Category.Series, type: CQ.Album.AnswerType.Katakana, answers: [315, 415, 202, 505], text_answers:["コメットさん", "プレイガール", "ジャングル", "バーチャルガール", "アローム"] },
                { id: 616, name: '広島東洋カープ', category: CQ.Album.Category.Sports, type: CQ.Album.AnswerType.Mix, answers: [107, 509, 314, 500, 614, 215], text_answers:["阪神タイガース", "読売ジャイアンツ", "埼玉西武ライオンズ"] },
                { id: 617, name: '白い恋人', category: CQ.Album.Category.Brand, type: CQ.Album.AnswerType.Mix, answers: [512, 508, 116, 300, 414, 103, 207], text_answers:["東京ばな奈", "ひよこ", "筑紫もち", "博多通りもん", "ありあけハーバー"] },
                { id: 618, name: 'ゴジラ', category: CQ.Album.Category.Film, type: CQ.Album.AnswerType.Katakana, answers: [404, 610, 113, 205, 114, 510], text_answers:["モゲラ", "マグマ", "キングギドラ", "ドラット", "ゴロザウルス", "カマキラス"] },
                { id: 619, name: 'インド', category: CQ.Album.Category.Geography, type: CQ.Album.AnswerType.Katakana, answers: [310, 410, 315, 103, 309, 519], text_answers:["フィリピン", "アフガニスタン", "ネパール", "ブータン", " バングラデシュ"] }
            ]
        }
    ]
};

CQ.App.inherits(CQ.Album.Default, CQ.Album);
//CQ.App.register(CQ.Album.Default);